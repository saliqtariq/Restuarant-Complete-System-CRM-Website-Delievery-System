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
let redisRateLimiter: Ratelimit | null = null;
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

function getRedisRateLimiter(): Ratelimit | null {
  if (redisRateLimiter) return redisRateLimiter;
  if (redisInitError) return null;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    redisInitError = "Upstash Redis is not configured";
    return null;
  }

  try {
    redisRateLimiter = new Ratelimit({
      redis: new Redis({
        url,
        token,
      }),
      limiter: Ratelimit.slidingWindow(20, "1 m"),
      prefix: "demorestaurant:ratelimit",
      analytics: false,
    });
    return redisRateLimiter;
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
  const redisLimiter = getRedisRateLimiter();
  if (redisLimiter) {
    const result = await redisLimiter.limit(key);
    return {
      limited: !result.success,
      retryAfter: result.reset > 0 ? Math.max(0, Math.ceil((result.reset - Date.now()) / 1000)) : 0,
    };
  }

  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
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
