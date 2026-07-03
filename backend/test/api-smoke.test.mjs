import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";

process.env.JWT_SECRET ??= "node-test-local-secret";
process.env.MONGO_URI ??= "mongodb://127.0.0.1:27017/chaos-ka-adda";
process.env.CLIENT_URL ??= "http://127.0.0.1:5173";

const [
  { default: mongoose },
  { createApp },
  { RoomModel },
  { UserModel },
  { initSocketServer },
] = await Promise.all([
  import("mongoose"),
  import("../dist/app.js"),
  import("../dist/models/Room.js"),
  import("../dist/models/User.js"),
  import("../dist/sockets/socketServer.js"),
]);

async function bootApi() {
  await mongoose.connect(process.env.MONGO_URI);

  const app = createApp();
  const server = createServer(app);
  initSocketServer(server);
  await new Promise((resolve) => server.listen(0, resolve));

  const address = server.address();
  assert.equal(typeof address, "object");
  assert.ok(address);

  const baseUrl = `http://127.0.0.1:${address.port}/api`;
  const request = (path, options = {}) =>
    fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });

  return { request, server };
}

async function shutdown(server) {
  await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
}

test("guest user can complete the core room and gameplay API path", async () => {
  const { request, server } = await bootApi();
  const createdUserIds = [];
  let roomId;

  try {
    const host = await request("/auth/guest", {
      method: "POST",
      body: JSON.stringify({ username: `TestHost-${Date.now()}` }),
    }).then((response) => response.json());
    createdUserIds.push(host.user._id);
    const hostAuth = { Authorization: `Bearer ${host.token}` };

    const guest = await request("/auth/guest", {
      method: "POST",
      body: JSON.stringify({ username: `TestGuest-${Date.now()}` }),
    }).then((response) => response.json());
    createdUserIds.push(guest.user._id);

    const created = await request("/rooms", {
      method: "POST",
      headers: hostAuth,
      body: JSON.stringify({ name: "Automated Smoke", maxPlayers: 4 }),
    }).then((response) => response.json());
    roomId = created.room._id;

    assert.equal(created.room.players.length, 1);
    assert.match(created.room.code, /^[A-Z2-9]{6}$/);

    const joined = await request("/rooms/join", {
      method: "POST",
      headers: { Authorization: `Bearer ${guest.token}` },
      body: JSON.stringify({ code: created.room.code }),
    }).then((response) => response.json());
    assert.equal(joined.room.players.length, 2);

    const randomized = await request(`/rooms/${created.room.code}/teams/randomize`, {
      method: "POST",
      headers: hostAuth,
    }).then((response) => response.json());
    assert.equal(randomized.room.teams.length, 2);

    const locked = await request(`/rooms/${created.room.code}/teams/lock`, {
      method: "POST",
      headers: hostAuth,
    }).then((response) => response.json());
    assert.equal(locked.room.teamsLocked, true);

    const selectedGame = await request(`/rooms/${created.room.code}/game`, {
      method: "POST",
      headers: hostAuth,
      body: JSON.stringify({ gameId: "guess-movie" }),
    }).then((response) => response.json());
    assert.equal(selectedGame.room.selectedGameId, "guess-movie");

    const selectedCategory = await request(`/rooms/${created.room.code}/category`, {
      method: "POST",
      headers: hostAuth,
      body: JSON.stringify({ category: "Bollywood" }),
    }).then((response) => response.json());
    assert.equal(selectedCategory.room.selectedCategory, "Bollywood");

    const started = await request(`/rooms/${created.room.code}/gameplay/start`, {
      method: "POST",
      headers: hostAuth,
    }).then((response) => response.json());
    assert.equal(started.room.gameplay.isActive, true);
    assert.equal(started.room.gameplay.phase, "playing");

    const scored = await request(`/rooms/${created.room.code}/gameplay/action`, {
      method: "POST",
      headers: hostAuth,
      body: JSON.stringify({ action: "correct" }),
    }).then((response) => response.json());
    assert.equal(scored.room.gameplay.scores.red, 10);

    const result = await request(`/rooms/${created.room.code}/gameplay/end-round`, {
      method: "POST",
      headers: hostAuth,
      body: JSON.stringify({ reason: "manual" }),
    }).then((response) => response.json());
    assert.equal(result.room.gameplay.phase, "round-result");

    const finished = await request(`/rooms/${created.room.code}/gameplay/finish`, {
      method: "POST",
      headers: hostAuth,
    }).then((response) => response.json());
    assert.equal(finished.room.status, "closed");
    assert.equal(finished.room.finalResult.winnerTeamName, "Red Team");

    const leaderboard = await request("/users/leaderboard", {
      headers: hostAuth,
    }).then((response) => response.json());
    assert.ok(Array.isArray(leaderboard.players));
  } finally {
    if (roomId) await RoomModel.deleteOne({ _id: roomId });
    if (createdUserIds.length) await UserModel.deleteMany({ _id: { $in: createdUserIds } });
    await shutdown(server);
  }
});

test("store purchase spends coins and records ownership", async () => {
  const { request, server } = await bootApi();
  let userId;

  try {
    const guest = await request("/auth/guest", {
      method: "POST",
      body: JSON.stringify({ username: `StoreTest-${Date.now()}` }),
    }).then((response) => response.json());
    userId = guest.user._id;
    const auth = { Authorization: `Bearer ${guest.token}` };

    const store = await request("/users/store", { headers: auth }).then((response) =>
      response.json(),
    );
    assert.equal(store.items.length, 3);

    const purchase = await request("/users/store/purchase", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({ itemId: store.items[0].id }),
    }).then((response) => response.json());

    assert.equal(purchase.alreadyOwned, false);
    assert.ok(purchase.user.purchases.includes(store.items[0].id));
    assert.equal(purchase.user.coins, 250 - store.items[0].cost);
  } finally {
    if (userId) await UserModel.deleteOne({ _id: userId });
    await shutdown(server);
  }
});

test("host can leave and the next player becomes host", async () => {
  const { request, server } = await bootApi();
  const createdUserIds = [];
  let roomId;

  try {
    const host = await request("/auth/guest", {
      method: "POST",
      body: JSON.stringify({ username: `LeaveHost-${Date.now()}` }),
    }).then((response) => response.json());
    createdUserIds.push(host.user._id);
    const hostAuth = { Authorization: `Bearer ${host.token}` };

    const guest = await request("/auth/guest", {
      method: "POST",
      body: JSON.stringify({ username: `LeaveGuest-${Date.now()}` }),
    }).then((response) => response.json());
    createdUserIds.push(guest.user._id);
    const guestAuth = { Authorization: `Bearer ${guest.token}` };

    const created = await request("/rooms", {
      method: "POST",
      headers: hostAuth,
      body: JSON.stringify({ name: "Leave Test", maxPlayers: 4 }),
    }).then((response) => response.json());
    roomId = created.room._id;

    await request("/rooms/join", {
      method: "POST",
      headers: guestAuth,
      body: JSON.stringify({ code: created.room.code }),
    }).then((response) => response.json());

    const left = await request(`/rooms/${created.room.code}/leave`, {
      method: "POST",
      headers: hostAuth,
    }).then((response) => response.json());

    assert.equal(left.left, true);
    assert.equal(left.deleted, false);
    assert.equal(left.room.host, guest.user._id);
    assert.equal(left.room.players.length, 1);
    assert.equal(left.room.players[0].role, "host");
  } finally {
    if (roomId) await RoomModel.deleteOne({ _id: roomId });
    if (createdUserIds.length) await UserModel.deleteMany({ _id: { $in: createdUserIds } });
    await shutdown(server);
  }
});

test("placeholder games cannot be selected for live gameplay", async () => {
  const { request, server } = await bootApi();
  const createdUserIds = [];
  let roomId;

  try {
    const host = await request("/auth/guest", {
      method: "POST",
      body: JSON.stringify({ username: `PlaceholderHost-${Date.now()}` }),
    }).then((response) => response.json());
    createdUserIds.push(host.user._id);
    const hostAuth = { Authorization: `Bearer ${host.token}` };

    const created = await request("/rooms", {
      method: "POST",
      headers: hostAuth,
      body: JSON.stringify({ name: "Placeholder Test", maxPlayers: 4 }),
    }).then((response) => response.json());
    roomId = created.room._id;

    await request(`/rooms/${created.room.code}/teams/lock`, {
      method: "POST",
      headers: hostAuth,
    }).then((response) => response.json());

    const response = await request(`/rooms/${created.room.code}/game`, {
      method: "POST",
      headers: hostAuth,
      body: JSON.stringify({ gameId: "reverse-charades" }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.message, "This game is not playable yet");
  } finally {
    if (roomId) await RoomModel.deleteOne({ _id: roomId });
    if (createdUserIds.length) await UserModel.deleteMany({ _id: { $in: createdUserIds } });
    await shutdown(server);
  }
});
