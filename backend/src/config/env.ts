import dotenv from "dotenv";

dotenv.config();

function readEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri:
    process.env.MONGO_URI ??
    process.env.MONGODB_URI ??
    "mongodb://127.0.0.1:27017/chaos-ka-adda",
  jwtSecret: readEnv("JWT_SECRET"),
  clientUrl: readEnv("CLIENT_URL", "http://127.0.0.1:5173"),
};
