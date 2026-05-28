/**
 * Tiny client/server wrapper for the SVGL API (https://svgl.app/docs/api).
 * No auth, public, rate-limited.
 */

export type SvglTheme = { dark: string; light: string };

export interface SvglIcon {
  id: number;
  title: string;
  category: string | string[];
  route: string | SvglTheme;
  url: string;
  wordmark?: string | SvglTheme;
  brandUrl?: string;
}

export interface SvglCategory {
  category: string;
  total: number;
}

const API_BASE = 'https://api.svgl.app';
const ASSET_BASE = 'https://svgl.app';

export function svglRoute(icon: SvglIcon, mode: 'light' | 'dark' = 'dark'): string {
  return typeof icon.route === 'string' ? icon.route : icon.route[mode];
}

/** Returns the slug used by SVGL ("svelte", "axiom-dark", etc.) */
export function svglSlug(icon: SvglIcon, mode: 'light' | 'dark' = 'dark'): string {
  const route = svglRoute(icon, mode);
  const match = route.match(/\/([^/]+?)\.svg$/);
  return match ? match[1] : icon.title.toLowerCase().replace(/\s+/g, '-');
}

/** Direct, cacheable URL for the optimized SVG. */
export function svglAssetUrl(slug: string): string {
  return `${ASSET_BASE}/${cleanSlug(slug)}.svg`;
}

export function svglApiSvgUrl(slug: string): string {
  return `${API_BASE}/svg/${cleanSlug(slug)}.svg`;
}

function cleanSlug(slug: string): string {
  return slug.replace(/\.svg$/i, '').replace(/[^a-z0-9_-]/gi, '').toLowerCase();
}

export async function svglList(opts: { limit?: number; signal?: AbortSignal } = {}): Promise<SvglIcon[]> {
  const url = opts.limit ? `${API_BASE}?limit=${opts.limit}` : API_BASE;
  const res = await fetch(url, { signal: opts.signal });
  if (!res.ok) throw new Error(`SVGL list failed: ${res.status}`);
  return res.json();
}

export async function svglSearch(query: string, signal?: AbortSignal): Promise<SvglIcon[]> {
  const q = query.trim();
  if (!q) return [];
  const res = await fetch(`${API_BASE}?search=${encodeURIComponent(q)}`, { signal });
  if (!res.ok) return [];
  return res.json();
}

export async function svglCategory(category: string, signal?: AbortSignal): Promise<SvglIcon[]> {
  const res = await fetch(`${API_BASE}/category/${encodeURIComponent(category.toLowerCase())}`, { signal });
  if (!res.ok) return [];
  return res.json();
}

export async function svglCategories(signal?: AbortSignal): Promise<SvglCategory[]> {
  const res = await fetch(`${API_BASE}/categories`, { signal });
  if (!res.ok) throw new Error(`SVGL categories failed: ${res.status}`);
  return res.json();
}

export async function svglFetchSvg(slug: string, signal?: AbortSignal): Promise<string> {
  const res = await fetch(svglApiSvgUrl(slug), { signal });
  if (!res.ok) throw new Error(`SVGL svg ${slug} failed: ${res.status}`);
  return res.text();
}

/* ---------- in-memory caches (dedupe identical requests) ---------- */

const svgCache = new Map<string, Promise<string>>();

export function svglFetchSvgCached(slug: string, signal?: AbortSignal): Promise<string> {
  const key = cleanSlug(slug);
  const hit = svgCache.get(key);
  if (hit) return hit;
  const p = svglFetchSvg(key, signal).catch((err) => {
    svgCache.delete(key);
    throw err;
  });
  svgCache.set(key, p);
  return p;
}
