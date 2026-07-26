export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
}

interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes in long-running processes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      record.timestamps = record.timestamps.filter(ts => ts > now - 60000);
      if (record.timestamps.length === 0) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Returns rate limit tier limits based on the request path.
 * - Payment endpoints (/api/verify-payment, /api/checkout/stripe, /api/webhooks): 10 req/min
 * - Auth endpoints (/api/auth/*): 5 req/min
 * - General API (/api/*): 100 req/min
 */
export function getRateLimitTier(pathname: string): { limit: number; windowSeconds: number } {
  if (
    pathname.startsWith('/api/verify-payment') ||
    pathname.startsWith('/api/checkout/stripe') ||
    pathname.startsWith('/api/webhooks')
  ) {
    return { limit: 10, windowSeconds: 60 };
  }
  if (pathname.startsWith('/api/auth')) {
    return { limit: 5, windowSeconds: 60 };
  }
  if (pathname.startsWith('/api/')) {
    return { limit: 100, windowSeconds: 60 };
  }
  return { limit: 100, windowSeconds: 60 };
}

/**
 * Performs rate limiting check using key format `${tenantId}:${ip}:${path}`.
 * Tries Upstash Redis first if configured, otherwise falls back to in-memory sliding window.
 */
export async function checkRateLimit(
  tenantId: string,
  ip: string,
  pathname: string
): Promise<RateLimitResult> {
  const { limit, windowSeconds } = getRateLimitTier(pathname);
  const key = `${tenantId}:${ip}:${pathname}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = now - windowMs;

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken && redisUrl.startsWith('http')) {
    try {
      const { Redis } = await import('@upstash/redis');
      const { Ratelimit } = await import('@upstash/ratelimit');

      const redis = new Redis({ url: redisUrl, token: redisToken });
      const upstashRatelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
        analytics: true,
      });

      const result = await upstashRatelimit.limit(key);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: Math.ceil(result.reset / 1000),
      };
    } catch (err) {
      console.warn('[Ratelimit] Upstash Redis check failed, using in-memory store fallback:', err);
    }
  }

  // ── In-Memory Sliding Window Implementation ──
  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  // Remove timestamps outside the sliding window
  record.timestamps = record.timestamps.filter(ts => ts > windowStart);

  const currentCount = record.timestamps.length;

  if (currentCount >= limit) {
    const oldestTimestamp = record.timestamps[0] || now;
    const resetSec = Math.ceil((oldestTimestamp + windowMs) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      reset: resetSec,
    };
  }

  record.timestamps.push(now);
  const remaining = Math.max(0, limit - record.timestamps.length);
  const resetSec = Math.ceil((now + windowMs) / 1000);

  return {
    success: true,
    limit,
    remaining,
    reset: resetSec,
  };
}
