import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60_000;
const MAX_BUCKETS = 5000;
const buckets = new Map<string, Bucket>();

function prune(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function rateLimit(
  bucketKey: string,
  max: number,
  windowMs = WINDOW_MS,
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(bucketKey);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) prune(now);
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (bucket.count >= max) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}

export async function currentRateIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim();
  return ip || h.get("x-real-ip") || "unknown";
}