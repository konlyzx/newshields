/**
 * Fetches the star count for the GitHub repo and caches it in memory + sessionStorage.
 */

const REPO = 'konlyzx/newshields';
const CACHE_KEY = 'ns:gh-stars';
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

let cached: { count: number; ts: number } | null = null;

function fromSession(): { count: number; ts: number } | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts < CACHE_TTL) return parsed;
  } catch {
    // ignore
  }
  return null;
}

function toSession(count: number): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ count, ts: Date.now() }));
  } catch {
    // ignore
  }
}

export async function fetchGitHubStars(signal?: AbortSignal): Promise<number> {
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.count;

  const session = fromSession();
  if (session) {
    cached = session;
    return session.count;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, { signal });
    if (!res.ok) return 0;
    const data = await res.json();
    const count = data.stargazers_count ?? 0;
    cached = { count, ts: Date.now() };
    toSession(count);
    return count;
  } catch {
    return 0;
  }
}

export function formatStars(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(count);
}
