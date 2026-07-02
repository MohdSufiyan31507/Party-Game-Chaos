import { createServer } from "node:http";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { initSocketServer } from "./sockets/socketServer.js";
import { getConfigSummary } from "./utils/configSummary.js";

async function bootstrap() {
  await connectDatabase();

  const app = createApp();
  const server = createServer(app);
  initSocketServer(server);

  server.listen(env.port, () => {
    console.log(`Chaos API running on http://127.0.0.1:${env.port}`);
    console.log("Runtime config", getConfigSummary());
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start Chaos API", error);
  process.exit(1);
});
