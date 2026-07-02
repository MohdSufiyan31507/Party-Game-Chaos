import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const required = {
  "backend/.env.example": ["PORT", "MONGO_URI", "JWT_SECRET", "CLIENT_URL"],
  "backend/.env.production.example": ["NODE_ENV", "PORT", "MONGO_URI", "JWT_SECRET", "CLIENT_URL"],
  "frontend/.env.example": ["VITE_API_URL", "VITE_SOCKET_URL"],
  "frontend/.env.production.example": ["VITE_API_URL", "VITE_SOCKET_URL"],
};

for (const [file, keys] of Object.entries(required)) {
  const text = readFileSync(resolve(file), "utf8");

  for (const key of keys) {
    assert.match(text, new RegExp(`^${key}=`, "m"), `${file} is missing ${key}`);
  }
}

console.log("Environment examples include all required keys.");
