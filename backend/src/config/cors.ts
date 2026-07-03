import { env } from "./env.js";

function normalizeOrigin(origin: string) {
  try {
    return new URL(origin).origin;
  } catch {
    return origin.replace(/\/$/, "");
  }
}

const allowedOrigins = new Set(
  [
    env.clientUrl,
    "https://party-game-chaos-frontend.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].map(normalizeOrigin),
);

export function isAllowedCorsOrigin(origin?: string) {
  if (!origin) return true;

  const normalizedOrigin = normalizeOrigin(origin);

  return allowedOrigins.has(normalizedOrigin) || normalizedOrigin.endsWith(".vercel.app");
}
