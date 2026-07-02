import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { getConfigSummary } from "./utils/configSummary.js";
import { authRoutes } from "./routes/authRoutes.js";
import { roomRoutes } from "./routes/roomRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "chaos-ka-adda-api" });
  });

  app.get("/api/config-check", (_req, res) => {
    res.json({ ok: true, config: getConfigSummary() });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/rooms", roomRoutes);
  app.use("/api/users", userRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
