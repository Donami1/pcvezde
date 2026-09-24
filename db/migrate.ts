import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { db } from "./db.js";

const folder = join(process.cwd(), "drizzle");
if (!existsSync(folder)) {
  console.error("Migrations folder not found:", folder);
  console.error('Run "npm run db:generate" first, then apply with this command.');
  process.exit(1);
}

migrate(db, { migrationsFolder: folder });
console.log("Migrations applied over SQLCipher connection.");