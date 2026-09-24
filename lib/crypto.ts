import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  hkdfSync,
  randomBytes,
} from "node:crypto";
import { getAuthSecret } from "@/lib/secrets";

const KEY_INFO = "pcvezde:pii:v1";
const ALGO = "aes-256-gcm";
const IV_BYTES = 12;
const TAG_BYTES = 16;
const PREFIX = "v1:";

let keyCache: Buffer | null = null;

function fieldKey(): Buffer {
  if (keyCache) return keyCache;
  const master = Buffer.from(getAuthSecret(), "utf8");
  keyCache = Buffer.from(hkdfSync("sha256", master, Buffer.alloc(32), Buffer.from(KEY_INFO), 32));
  return keyCache;
}

/**
 * AES-256-GCM с случайным nonce. Формат: "v1:" + base64url(iv|tag|ct).
 * Для users.phone используйте encryptDeterministic(), остальные поля — encrypt().
 */
export function encrypt(value: string | null | undefined): string | null {
  if (value == null || value === "") return value ?? null;
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, fieldKey(), iv);
  const ct = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return PREFIX + Buffer.concat([iv, tag, ct]).toString("base64url");
}

/**
 * Детерминированное шифрование: nonce выводится из значения (SIV-подход).
 * Позволяет искать по зашифрованному значению (логин по телефону, UNIQUE).
 */
export function encryptDeterministic(value: string | null | undefined): string | null {
  if (value == null || value === "") return value ?? null;
  const key = fieldKey();
  const iv = createHmac("sha256", key).update(value, "utf8").digest().subarray(0, IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return PREFIX + Buffer.concat([iv, tag, ct]).toString("base64url");
}

/**
 * Расшифровка. Данные без префикса "v1:" считаются легаси-открытым текстом
 * и возвращаются как есть (бесшовный переход на шифрование).
 */
export function decrypt(value: string | null | undefined): string | null {
  if (value == null || value === "") return value ?? null;
  if (!value.startsWith(PREFIX)) return value;

  const raw = Buffer.from(value.slice(PREFIX.length), "base64url");
  if (raw.length < IV_BYTES + TAG_BYTES) return value;

  const iv = raw.subarray(0, IV_BYTES);
  const tag = raw.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const ct = raw.subarray(IV_BYTES + TAG_BYTES);

  try {
    const decipher = createDecipheriv(ALGO, fieldKey(), iv);
    decipher.setAuthTag(tag);
    return decipher.update(ct, undefined, "utf8") + decipher.final("utf8");
  } catch {
    return value;
  }
}