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
const TYPES = "./index.d.ts";

function patchExports(exportsMap) {
  if (!exportsMap || typeof exportsMap !== "object") return false;
  const dot = exportsMap["."];
  if (!dot) return false;

  // String form: ".": "./lib/index.js"
  if (typeof dot === "string") {
    exportsMap["."] = { types: TYPES, default: dot };
    return true;
  }
  // Object form: ".": { "default": "./lib/index.js" } (or { import, require })
  if (typeof dot === "object" && !Array.isArray(dot)) {
    if (dot.types) return false;
    if (dot.default || dot.import) {
      dot.types = TYPES;
      return true;
    }
  }
  return false;
}

const changed = patchExports(pkg.exports);
if (changed) {
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
  console.log(`[patch-sqlcipher-types] patched: added "types" (${TYPES}) for "better-sqlite3-multiple-ciphers".`);
} else {
  console.log("[patch-sqlcipher-types] already patched or nothing to patch.");
}