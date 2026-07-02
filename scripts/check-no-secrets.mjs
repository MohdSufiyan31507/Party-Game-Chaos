import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ignored = new Set([
  ".git",
  "node_modules",
  "dist",
  ".agents",
]);

const suspiciousPatterns = [
  /gemini/i,
  /google[_-]?ai/i,
  /api[_-]?key\s*=\s*["']?[A-Za-z0-9_-]{20,}/i,
  /AIza[0-9A-Za-z_-]{20,}/,
];

const allowedFiles = new Set([
  "README.md",
  "docs/DEPLOYMENT.md",
  "docs/OPERATIONS.md",
  "scripts/check-no-secrets.mjs",
]);

const hits = [];

function walk(dir) {
  for (const item of readdirSync(dir)) {
    if (ignored.has(item)) continue;

    const path = join(dir, item);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      walk(path);
      continue;
    }

    if (!/\.(ts|tsx|js|mjs|json|md|example|yaml|yml)$/i.test(item)) continue;

    const repoPath = relative(process.cwd(), path).replaceAll("\\", "/");
    const text = readFileSync(path, "utf8");

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(text) && !allowedFiles.has(repoPath)) {
        hits.push(`${repoPath} matched ${pattern}`);
      }
    }
  }
}

walk(process.cwd());

if (hits.length) {
  console.error("Potential secret or forbidden AI reference found:");
  for (const hit of hits) console.error(`- ${hit}`);
  process.exit(1);
}

console.log("No obvious committed secrets or forbidden AI API references found.");
