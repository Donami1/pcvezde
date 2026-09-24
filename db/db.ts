import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import Database from "better-sqlite3-multiple-ciphers";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { getDatabaseKey } from "@/lib/secrets";

const dbFile = process.env.DATABASE_FILE
  ? resolve(process.env.DATABASE_FILE)
  : join(process.cwd(), "data", "pcvezde.db");
mkdirSync(dirname(dbFile), { recursive: true });

const sqlite = new Database(dbFile);
sqlite.pragma("cipher = 'sqlcipher'");
sqlite.pragma(`key = '${getDatabaseKey().replace(/'/g, "''")}'`);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, {
  logger: false,
});
export { dbFile };

if (process.env.NODE_ENV !== "production") {
  db.$client.pragma("busy_timeout = 5000");
}