import { Hono } from 'hono';
import type { RequestHandler } from './$types';
import { getIcon, isLocalIcon } from '$content/icons';

const app = new Hono();

app.get('/api/icon.svg', (c) => {
  const url = new URL(c.req.url);
  const slug = url.searchParams.get('slug')?.toLowerCase() ?? '';

  // Only serve local icons from this endpoint
  if (!isLocalIcon(slug)) {
    return c.json(
      { error: 'not_found', message: 'Icon not found or not a local icon' },
      404
    );
  }

  const icon = getIcon(slug);
  const viewBox = icon.viewBox ?? '0 0 24 24';

  // Special handling for newshields icon - use original silver gradients
  if (slug === 'newshields') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="156" height="153" viewBox="${viewBox}" fill="none">
  <defs>
    <linearGradient id="g1" x1="65.176" y1="42.8212" x2="65.176" y2="129.606" gradientUnits="userSpaceOnUse">
      <stop stop-color="#E3E3E3"/>
      <stop offset="1" stop-color="#7D7D7D"/>
    </linearGradient>
    <linearGradient id="g2" x1="89.824" y1="21.4843" x2="89.824" y2="108.269" gradientUnits="userSpaceOnUse">
      <stop stop-color="#E3E3E3"/>
      <stop offset="1" stop-color="#7D7D7D"/>
    </linearGradient>
  </defs>
  <path d="M105.599 129.606L19.4054 47.8906L24.7527 42.8212L110.947 124.536L105.599 129.606ZM52.2533 129.606L19.4054 98.3439L24.7527 93.2745L57.7279 124.536L52.2533 129.606Z" fill="url(#g1)"/>
  <path d="M49.4007 21.4843L135.595 103.199L130.247 108.269L44.0534 26.5538L49.4007 21.4843ZM102.747 21.4843L135.595 52.746L130.247 57.8155L97.2721 26.5538L102.747 21.4843Z" fill="url(#g2)"/>
</svg>`;
    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // Default for other local icons
  const fill = url.searchParams.get('fill') ?? 'currentColor';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
  <path fill="${fill}" d="${icon.path}"/>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*'
    }
  });
});

export const GET: RequestHandler = async ({ request }) => {
  return app.fetch(request);
};
