import { env } from "../config/env.js";

export function getConfigSummary() {
  return {
    port: env.port,
    mongoConfigured: Boolean(env.mongoUri),
    clientUrl: env.clientUrl,
    jwtConfigured: Boolean(env.jwtSecret),
    nodeEnv: process.env.NODE_ENV ?? "development",
  };
}
