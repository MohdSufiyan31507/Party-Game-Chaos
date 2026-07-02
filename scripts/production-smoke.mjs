process.env.JWT_SECRET ??= "production-smoke-local-secret";
process.env.MONGO_URI ??= "mongodb://127.0.0.1:27017/chaos-ka-adda";
process.env.CLIENT_URL ??= "http://127.0.0.1:5173";

const [{ createServer }, { createApp }, { initSocketServer }, mongooseModule] = await Promise.all([
  import("node:http"),
  import("../backend/dist/app.js"),
  import("../backend/dist/sockets/socketServer.js"),
  import("mongoose"),
]);

const mongoose = mongooseModule.default;

await mongoose.connect(process.env.MONGO_URI);
const app = createApp();
const server = createServer(app);
initSocketServer(server);

await new Promise((resolve) => server.listen(0, resolve));
const address = server.address();
if (!address || typeof address !== "object") {
  throw new Error("Could not start production smoke server");
}

const baseUrl = `http://127.0.0.1:${address.port}`;
const health = await fetch(`${baseUrl}/api/health`).then((response) => response.json());
const config = await fetch(`${baseUrl}/api/config-check`).then((response) => response.json());

if (!health.ok || !config.ok || !config.config.jwtConfigured) {
  throw new Error("Production smoke check failed");
}

await new Promise((resolve) => server.close(resolve));
await mongoose.disconnect();

console.log("Production smoke check passed.");
