import type { Request, Response } from "express";
import { promptsForGame } from "../data/gamePrompts.js";
import {
  RoomModel,
  type RoomDocument,
  type RoomStatus,
  type RoomTeam,
} from "../models/Room.js";
import { UserModel } from "../models/User.js";
import { emitRoomUpdated } from "../sockets/socketServer.js";
import { HttpError } from "../utils/httpError.js";
import { createRoomCode } from "../utils/roomCode.js";

const MAX_CODE_ATTEMPTS = 8;
const DEFAULT_ROUND_DURATION_SECONDS = 60;

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readMaxPlayers(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 8;
  }

  return Math.min(Math.max(Math.round(parsed), 2), 16);
}

function serializeRoom(room: RoomDocument) {
  return room.toJSON();
}

function defaultTeams(): RoomTeam[] {
  return [
    { id: "red", name: "Red Team", accent: "red", playerIds: [] },
    { id: "blue", name: "Blue Team", accent: "blue", playerIds: [] },
  ];
}

function shuffled<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function roomCodeParam(req: Request) {
  return readString(req.params.code).toUpperCase();
}

async function createUniqueRoomCode() {
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt += 1) {
    const code = createRoomCode();
    const exists = await RoomModel.exists({ code });

    if (!exists) {
      return code;
    }
  }

  throw new HttpError(500, "Could not create a unique room code");
}

function requireCurrentUser(req: Request) {
  if (!req.user) {
    throw new HttpError(401, "Authentication required");
  }

  return req.user;
}

function requireHost(room: RoomDocument, userId: string) {
  if (room.host.toString() !== userId) {
    throw new HttpError(403, "Only the host can update this room");
  }
}

function roundEndsAt(durationSeconds = DEFAULT_ROUND_DURATION_SECONDS) {
  return new Date(Date.now() + durationSeconds * 1000);
}

function teamName(room: RoomDocument, teamId: "red" | "blue") {
  return room.teams.find((team) => team.id === teamId)?.name ?? `${teamId} Team`;
}

async function updatePlayerStats(room: RoomDocument, winnerTeamId: "red" | "blue" | "draw") {
  const scores = room.gameplay?.scores ?? { red: 0, blue: 0 };

  for (const team of room.teams) {
    for (const playerId of team.playerIds) {
      const didWin = winnerTeamId !== "draw" && team.id === winnerTeamId;
      await UserModel.findByIdAndUpdate(playerId, {
        $inc: {
          gamesPlayed: 1,
          wins: didWin ? 1 : 0,
          losses: didWin || winnerTeamId === "draw" ? 0 : 1,
          totalScore: scores[team.id],
          coins: didWin ? 75 : 25,
          xp: didWin ? 100 : 40,
        },
        $addToSet: {
          achievements: didWin ? "Main Character Energy" : "First Game Finished",
        },
      });
    }
  }
}

export async function createRoom(req: Request, res: Response) {
  const user = requireCurrentUser(req);
  const name = readString(req.body.name) || `${user.username}'s Chaos Room`;
  const maxPlayers = readMaxPlayers(req.body.maxPlayers);
  const code = await createUniqueRoomCode();

  const room = await RoomModel.create({
    code,
    name,
    host: user._id,
    maxPlayers,
    players: [
      {
        user: user._id,
        username: user.username,
        avatar: user.avatar,
        role: "host",
      },
    ],
    teams: defaultTeams(),
  });

  res.status(201).json({ room: serializeRoom(room) });
  emitRoomUpdated(room.code);
}

export async function joinRoom(req: Request, res: Response) {
  const user = requireCurrentUser(req);
  const code = readString(req.body.code).toUpperCase();

  if (!code) {
    throw new HttpError(400, "Room code is required");
  }

  const room = await RoomModel.findOne({ code });

  if (!room) {
    throw new HttpError(404, "Room not found");
  }

  if (room.status === "closed") {
    throw new HttpError(400, "Room is closed");
  }

  if (room.teamsLocked) {
    throw new HttpError(400, "Teams are already locked");
  }

  const userId = user._id.toString();
  const alreadyJoined = room.players.some((player) => player.user.toString() === userId);

  if (!alreadyJoined) {
    if (room.players.length >= room.maxPlayers) {
      throw new HttpError(400, "Room is full");
    }

    room.players.push({
      user: user._id,
      username: user.username,
      avatar: user.avatar,
      role: "player",
      joinedAt: new Date(),
    });

    await room.save();
    emitRoomUpdated(room.code);
  }

  res.json({ room: serializeRoom(room) });
}

export async function getRoom(req: Request, res: Response) {
  const code = roomCodeParam(req);
  const room = await RoomModel.findOne({ code });

  if (!room) {
    throw new HttpError(404, "Room not found");
  }

  res.json({ room: serializeRoom(room) });
}

export async function updateRoomStatus(req: Request, res: Response) {
  const user = requireCurrentUser(req);
  const code = roomCodeParam(req);
  const status = readString(req.body.status) as RoomStatus;
  const allowedStatuses: RoomStatus[] = ["lobby", "team-setup", "game-selection", "closed"];

  if (!allowedStatuses.includes(status)) {
    throw new HttpError(400, "Invalid room status");
  }

  const room = await RoomModel.findOne({ code });

  if (!room) {
    throw new HttpError(404, "Room not found");
  }

  requireHost(room, user._id.toString());

  room.status = status;
  await room.save();
  emitRoomUpdated(room.code);

  res.json({ room: serializeRoom(room) });
}

export async function randomizeTeams(req: Request, res: Response) {
  const user = requireCurrentUser(req);
  const code = roomCodeParam(req);
  const room = await RoomModel.findOne({ code });

  if (!room) {
    throw new HttpError(404, "Room not found");
  }

  requireHost(room, user._id.toString());

  if (room.teamsLocked) {
    throw new HttpError(400, "Teams are already locked");
  }

  const playerIds = shuffled(room.players.map((player) => player.user.toString()));
  const redPlayerIds = playerIds.filter((_, index) => index % 2 === 0);
  const bluePlayerIds = playerIds.filter((_, index) => index % 2 === 1);

  room.teams = [
    { id: "red", name: "Red Team", accent: "red", playerIds: redPlayerIds },
    { id: "blue", name: "Blue Team", accent: "blue", playerIds: bluePlayerIds },
  ];
  room.status = "team-setup";
  await room.save();
  emitRoomUpdated(room.code);

  res.json({ room: serializeRoom(room) });
}

export async function lockTeams(req: Request, res: Response) {
  const user = requireCurrentUser(req);
  const code = roomCodeParam(req);
  const room = await RoomModel.findOne({ code });

  if (!room) {
    throw new HttpError(404, "Room not found");
  }

  requireHost(room, user._id.toString());

  if (!room.teams.some((team) => team.playerIds.length > 0)) {
    const playerIds = room.players.map((player) => player.user.toString());
    room.teams = [
      { id: "red", name: "Red Team", accent: "red", playerIds: playerIds.filter((_, index) => index % 2 === 0) },
      { id: "blue", name: "Blue Team", accent: "blue", playerIds: playerIds.filter((_, index) => index % 2 === 1) },
    ];
  }

  room.teamsLocked = true;
  room.status = "game-selection";
  await room.save();
  emitRoomUpdated(room.code);

  res.json({ room: serializeRoom(room) });
}

export async function selectGame(req: Request, res: Response) {
  const user = requireCurrentUser(req);
  const code = roomCodeParam(req);
  const gameId = readString(req.body.gameId);
  const room = await RoomModel.findOne({ code });

  if (!gameId) {
    throw new HttpError(400, "Game id is required");
  }

  if (!room) {
    throw new HttpError(404, "Room not found");
  }

  requireHost(room, user._id.toString());

  if (!room.teamsLocked) {
    throw new HttpError(400, "Lock teams before selecting a game");
  }

  room.selectedGameId = gameId;
  room.status = "game-selection";
  await room.save();
  emitRoomUpdated(room.code);

  res.json({ room: serializeRoom(room) });
}

export async function selectCategory(req: Request, res: Response) {
  const user = requireCurrentUser(req);
  const code = roomCodeParam(req);
  const category = readString(req.body.category);
  const room = await RoomModel.findOne({ code });

  if (!category) {
    throw new HttpError(400, "Category is required");
  }

  if (!room) {
    throw new HttpError(404, "Room not found");
  }

  requireHost(room, user._id.toString());

  if (!room.selectedGameId) {
    throw new HttpError(400, "Select a game before selecting a category");
  }

  room.selectedCategory = category;
  await room.save();
  emitRoomUpdated(room.code);

  res.json({ room: serializeRoom(room) });
}

export async function startGameplay(req: Request, res: Response) {
  const user = requireCurrentUser(req);
  const code = roomCodeParam(req);
  const room = await RoomModel.findOne({ code });

  if (!room) {
    throw new HttpError(404, "Room not found");
  }

  requireHost(room, user._id.toString());

  if (!room.selectedGameId || !room.selectedCategory) {
    throw new HttpError(400, "Select a game and category before starting");
  }

  room.gameplay = {
    isActive: true,
    phase: "playing",
    currentPromptIndex: 0,
    activeTeamId: "red",
    round: 1,
    roundDurationSeconds: DEFAULT_ROUND_DURATION_SECONDS,
    roundEndsAt: roundEndsAt(),
    scores: { red: 0, blue: 0 },
    correct: { red: 0, blue: 0 },
    skips: { red: 0, blue: 0 },
    startedAt: new Date(),
    updatedAt: new Date(),
  };
  await room.save();
  emitRoomUpdated(room.code);

  res.json({ room: serializeRoom(room), prompt: promptsForGame(room.selectedGameId)[0] });
}

export async function submitGameplayAction(req: Request, res: Response) {
  const user = requireCurrentUser(req);
  const code = roomCodeParam(req);
  const action = readString(req.body.action);
  const room = await RoomModel.findOne({ code });

  if (!room) {
    throw new HttpError(404, "Room not found");
  }

  requireHost(room, user._id.toString());

  if (!room.gameplay?.isActive || room.gameplay.phase !== "playing" || !room.selectedGameId) {
    throw new HttpError(400, "Gameplay is not active");
  }

  if (action !== "correct" && action !== "skip") {
    throw new HttpError(400, "Action must be correct or skip");
  }

  const activeTeamId = room.gameplay.activeTeamId;
  const prompts = promptsForGame(room.selectedGameId);

  if (action === "correct") {
    room.gameplay.correct[activeTeamId] += 1;
    room.gameplay.scores[activeTeamId] += 10;
  } else {
    room.gameplay.skips[activeTeamId] += 1;
  }

  room.gameplay.currentPromptIndex =
    (room.gameplay.currentPromptIndex + 1) % prompts.length;
  room.gameplay.updatedAt = new Date();
  await room.save();
  emitRoomUpdated(room.code);

  res.json({
    room: serializeRoom(room),
    prompt: prompts[room.gameplay.currentPromptIndex],
  });
}

export async function switchGameplayTeam(req: Request, res: Response) {
  const user = requireCurrentUser(req);
  const code = roomCodeParam(req);
  const room = await RoomModel.findOne({ code });

  if (!room) {
    throw new HttpError(404, "Room not found");
  }

  requireHost(room, user._id.toString());

  if (!room.gameplay?.isActive) {
    throw new HttpError(400, "Gameplay is not active");
  }

  room.gameplay.activeTeamId = room.gameplay.activeTeamId === "red" ? "blue" : "red";
  room.gameplay.round += 1;
  room.gameplay.updatedAt = new Date();
  await room.save();
  emitRoomUpdated(room.code);

  res.json({ room: serializeRoom(room) });
}

export async function endRound(req: Request, res: Response) {
  const user = requireCurrentUser(req);
  const code = roomCodeParam(req);
  const reason = readString(req.body.reason) === "time-up" ? "time-up" : "manual";
  const room = await RoomModel.findOne({ code });

  if (!room) {
    throw new HttpError(404, "Room not found");
  }

  requireHost(room, user._id.toString());

  if (!room.gameplay?.isActive) {
    throw new HttpError(400, "Gameplay is not active");
  }

  const teamId = room.gameplay.activeTeamId;
  room.gameplay.phase = "round-result";
  room.gameplay.lastRoundResult = {
    teamId,
    score: room.gameplay.scores[teamId],
    correct: room.gameplay.correct[teamId],
    skips: room.gameplay.skips[teamId],
    round: room.gameplay.round,
    endedReason: reason,
    endedAt: new Date(),
  };
  room.gameplay.updatedAt = new Date();
  await room.save();
  emitRoomUpdated(room.code);

  res.json({ room: serializeRoom(room) });
}

export async function nextRound(req: Request, res: Response) {
  const user = requireCurrentUser(req);
  const code = roomCodeParam(req);
  const room = await RoomModel.findOne({ code });

  if (!room) {
    throw new HttpError(404, "Room not found");
  }

  requireHost(room, user._id.toString());

  if (!room.gameplay?.isActive) {
    throw new HttpError(400, "Gameplay is not active");
  }

  room.gameplay.phase = "playing";
  room.gameplay.activeTeamId = room.gameplay.activeTeamId === "red" ? "blue" : "red";
  room.gameplay.round += 1;
  room.gameplay.roundEndsAt = roundEndsAt(room.gameplay.roundDurationSeconds);
  room.gameplay.updatedAt = new Date();
  await room.save();
  emitRoomUpdated(room.code);

  res.json({ room: serializeRoom(room) });
}

export async function finishGame(req: Request, res: Response) {
  const user = requireCurrentUser(req);
  const code = roomCodeParam(req);
  const room = await RoomModel.findOne({ code });

  if (!room) {
    throw new HttpError(404, "Room not found");
  }

  requireHost(room, user._id.toString());

  if (!room.gameplay?.isActive) {
    throw new HttpError(400, "Gameplay is not active");
  }

  const scores = room.gameplay.scores;
  const winnerTeamId =
    scores.red === scores.blue ? "draw" : scores.red > scores.blue ? "red" : "blue";
  const loserTeamId = winnerTeamId === "red" ? "blue" : winnerTeamId === "blue" ? "red" : null;

  room.gameplay.isActive = false;
  room.gameplay.phase = "round-result";
  room.status = "closed";
  room.finalResult = {
    winnerTeamId,
    winnerTeamName: winnerTeamId === "draw" ? "Draw" : teamName(room, winnerTeamId),
    loserTeamName: loserTeamId ? teamName(room, loserTeamId) : undefined,
    scores,
    finishedAt: new Date(),
  };

  await updatePlayerStats(room, winnerTeamId);
  await room.save();
  emitRoomUpdated(room.code);

  res.json({ room: serializeRoom(room) });
}

export async function resetRoom(req: Request, res: Response) {
  const user = requireCurrentUser(req);
  const code = roomCodeParam(req);
  const room = await RoomModel.findOne({ code });

  if (!room) {
    throw new HttpError(404, "Room not found");
  }

  requireHost(room, user._id.toString());

  room.status = "lobby";
  room.teamsLocked = false;
  room.teams = defaultTeams();
  room.selectedGameId = undefined;
  room.selectedCategory = undefined;
  room.gameplay = undefined;
  room.finalResult = undefined;
  await room.save();
  emitRoomUpdated(room.code);

  res.json({ room: serializeRoom(room) });
}
