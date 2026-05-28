import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export type UpstashEnv = {
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
};

type LimiterShape = {
  limit(identifier: string): Promise<{ success: boolean; remaining: number; reset: number; limit: number }>;
};

let cachedLimiter: LimiterShape | null = null;

function createNoopLimiter(): LimiterShape {
  return {
    async limit() {
      return { success: true, remaining: 999, reset: Date.now() + 60_000, limit: 999 };
    }
  };
}

export function getBadgeRatelimiter(env: UpstashEnv | undefined): LimiterShape {
  if (cachedLimiter) return cachedLimiter;

  const url = env?.UPSTASH_REDIS_REST_URL;
  const token = env?.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    cachedLimiter = createNoopLimiter();
    return cachedLimiter;
  }

  const redis = new Redis({ url, token });
  cachedLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    analytics: true,
    prefix: 'premium-badges'
  });
  return cachedLimiter;
}

export function getClientIdentifier(request: Request): string {
  const cf = request.headers.get('cf-connecting-ip');
  if (cf) return cf;
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'anonymous';
}
