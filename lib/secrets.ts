import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes, randomInt } from "node:crypto";
import bcrypt from "bcryptjs";

const SECRETS_DIR = join(process.cwd(), "data");
const SECRETS_FILE = join(SECRETS_DIR, "secrets.json");

type SecretsStore = {
  authSecret?: string;
  dbKey?: string;
  adminPasswordHash?: string;
};

let store: SecretsStore | null = null;

function readStore(): SecretsStore {
  if (!existsSync(SECRETS_FILE)) return {};
  try {
    return JSON.parse(readFileSync(SECRETS_FILE, "utf8")) as SecretsStore;
  } catch {
    return {};
  }
}

function writeStore(secrets: SecretsStore) {
  mkdirSync(SECRETS_DIR, { recursive: true });
  writeFileSync(SECRETS_FILE, JSON.stringify(secrets, null, 2) + "\n", {
    encoding: "utf8",
    mode: 0o600,
  });
}

function load(): SecretsStore {
  if (store) return store;
  const current = readStore();
  const next: SecretsStore = { ...current };
  if (!next.authSecret) {
    next.authSecret = randomBytes(48).toString("base64url");
  }
  if (!next.dbKey) {
    next.dbKey = randomBytes(32).toString("hex");
  }
  if (JSON.stringify(next) !== JSON.stringify(current)) {
    writeStore(next);
  }
  store = next;
  return store;
}

export function getAuthSecret(): string {
  const fromEnv = process.env.AUTH_SECRET;
  if (fromEnv && fromEnv.trim()) return fromEnv;
  return load().authSecret as string;
}

export function getDatabaseKey(): string {
  const fromEnv = process.env.DATABASE_ENCRYPTION_KEY;
  if (fromEnv && fromEnv.trim()) return fromEnv;
  return load().dbKey as string;
}

const PASSWORD_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#%*";

function randomPassword(length = 18): string {
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += PASSWORD_ALPHABET[randomInt(PASSWORD_ALPHABET.length)];
  }
  return result;
}

export function getAdminPasswordValue(): string {
  const fromEnv = process.env.ADMIN_PASSWORD;
  if (fromEnv && fromEnv.trim()) return fromEnv;

  const secrets = load();
  if (secrets.adminPasswordHash) return secrets.adminPasswordHash;

  if (process.env.NODE_ENV === "production") {
    const generated = randomPassword();
    const hash = bcrypt.hashSync(generated, 10);
    secrets.adminPasswordHash = hash;
    writeStore(secrets);
    console.warn(
      "[secrets] Админ-пароль не задан. Сгенерирован при первом запуске: " +
        generated,
    );
    return hash;
  }

  return "admin123";
}

export function setAdminPassword(plain: string) {
  const secrets = load();
  secrets.adminPasswordHash = bcrypt.hashSync(plain, 10);
  writeStore(secrets);
}