import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const requiredFiles = [
  "backend/dist/server.js",
  "backend/dist/app.js",
  "frontend/dist/index.html",
];

for (const file of requiredFiles) {
  const path = resolve(file);
  assert.ok(existsSync(path), `${file} is missing. Run the production builds first.`);
  assert.ok(statSync(path).size > 0, `${file} is empty.`);
}

console.log("Production build artifacts are present.");
