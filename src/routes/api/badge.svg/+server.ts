import { Hono } from 'hono';
import type { RequestHandler } from './$types';
import {
  renderBadgeSvg,
  sanitizeBadgeParams,
  type BadgeParams
} from '$lib/server/badge-svg';
import { getBadgeRatelimiter, getClientIdentifier, type UpstashEnv } from '$lib/server/upstash';

type AppEnv = {
  Bindings: UpstashEnv;
};

const app = new Hono<AppEnv>();

app.get('/api/badge.svg', async (c) => {
  const identifier = getClientIdentifier(c.req.raw);
  const limiter = getBadgeRatelimiter(c.env);
  const result = await limiter.limit(identifier);

  if (!result.success) {
    return c.json(
      {
        error: 'rate_limited',
        message: 'Too many requests. Please slow down.',
        reset: result.reset
      },
      429,
      {
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset)
      }
    );
  }

  const url = new URL(c.req.url);
  const params: BadgeParams = sanitizeBadgeParams({
    label: url.searchParams.get('label'),
    title: url.searchParams.get('title'),
    icon: url.searchParams.get('icon'),
    theme: url.searchParams.get('theme')
  });

  const svg = await renderBadgeSvg(params);

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
      'X-RateLimit-Limit': String(result.limit),
      'X-RateLimit-Remaining': String(result.remaining),
      'Access-Control-Allow-Origin': '*'
    }
  });
});

export const GET: RequestHandler = async ({ request, platform }) => {
  return app.fetch(request, platform?.env ?? {});
};
