import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type HeaderReader = {
  get(name: string): string | null;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const redisLimiters = new Map<string, Ratelimit>();
let redisClient: Redis | null = null;
let redisInitError: string | null = null;

export type RateLimitResult = {
  limited: boolean;
  retryAfter: number;
};

export function getClientIp(headers: HeaderReader): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    headers.get("fastly-client-ip") ||
    "unknown"
  );
}

function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;
  if (redisInitError) return null;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    redisInitError = "Upstash Redis is not configured";
    return null;
  }

  try {
    redisClient = new Redis({ url, token });
    return redisClient;
  } catch (error) {
    redisInitError = error instanceof Error ? error.message : "Redis rate limiter unavailable";
    return null;
  }
}

function getRedisRateLimiter(limit: number, windowMs: number): Ratelimit | null {
  const client = getRedisClient();
  if (!client) return null;

  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  const cacheKey = `${limit}:${windowSec}`;

  const existing = redisLimiters.get(cacheKey);
  if (existing) return existing;

  try {
    const limiter = new Ratelimit({
      redis: client,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
      prefix: `demorestaurant:ratelimit:${cacheKey}`,
      analytics: false,
    });
    redisLimiters.set(cacheKey, limiter);
    return limiter;
  } catch (error) {
    redisInitError = error instanceof Error ? error.message : "Redis rate limiter unavailable";
    return null;
  }
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const redisLimiter = getRedisRateLimiter(limit, windowMs);
  if (redisLimiter) {
    const result = await redisLimiter.limit(key);
    return {
      limited: !result.success,
      retryAfter: result.reset > 0 ? Math.max(0, Math.ceil((result.reset - Date.now()) / 1000)) : 0,
    };
  }

  if (process.env.NODE_ENV === "production") {
    return {
      limited: true,
      retryAfter: Math.max(1, Math.ceil(windowMs / 1000)),
    };
  }

  const now = Date.now();
  const bucketKey = `${key}:${limit}:${windowMs}`;
  const current = buckets.get(bucketKey);

  if (!current || current.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    cleanupBuckets(now);
    return { limited: false, retryAfter: 0 };
  }

  current.count += 1;

  if (current.count > limit) {
    return {
      limited: true,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  return { limited: false, retryAfter: 0 };
}

function cleanupBuckets(now: number) {
  if (buckets.size < 5000) return;

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}
