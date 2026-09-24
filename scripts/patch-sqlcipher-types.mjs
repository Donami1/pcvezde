// Automatically fixes TypeScript types for better-sqlite3-multiple-ciphers:
// the package ships its declarations behind a broken "exports" map, so we add
// a "types" entry. Runs on every npm install/postinstall (idempotent).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgPath = join(root, "node_modules", "better-sqlite3-multiple-ciphers", "package.json");

if (!existsSync(pkgPath)) {
  console.log("[patch-sqlcipher-types] package not found, skipping.");
  process.exit(0);
}

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

const exp = pkg.exports;
if (!exp || typeof exp !== "object") {
  console.log("[patch-sqlcipher-types] no exports map, nothing to do.");
  process.exit(0);
}

function patchEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  if (entry.types) return false;
  if (entry.types === undefined && entry.default) {
    entry.types = "./index.d.ts";
    return true;
  }
  return false;
}

let changed = false;
// ".": { types?, default }
if (exp["."] && typeof exp["."] === "object" && !Array.isArray(exp["."])) {
  changed = patchEntry(exp["."]) || changed;
}

if (changed) {
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
  console.log("[patch-sqlcipher-types] exports patched: added \"types\" for \"better-sqlite3-multiple-ciphers\".");
} else {
  console.log("[patch-sqlcipher-types] already patched or nothing to patch.");
}