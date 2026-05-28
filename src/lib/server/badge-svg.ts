import { BADGE_DIMENSIONS, COMPACT_BADGE_DIMENSIONS, BADGE_LIMITS } from '$lib/config/badge';
import { getIcon, isLocalOnly } from '$content/icons';
import { getTheme } from '$content/themes';
import type { BadgeParams } from '$lib/utils/badge-url';
import { parseSvg } from '$lib/utils/parse-svg';
import { svglApiSvgUrl } from '$lib/utils/svgl';

export type { BadgeParams };

/** In-isolate cache of fetched SVGL svgs (raw text, already parsed-friendly). */
const remoteSvgCache = new Map<string, Promise<string | null>>();

async function fetchRemoteSvg(slug: string): Promise<string | null> {
  const key = slug.toLowerCase();
  const hit = remoteSvgCache.get(key);
  if (hit) return hit;
  const p = (async () => {
    try {
      const res = await fetch(svglApiSvgUrl(slug), {
        // SVGL serves CORS-friendly, immutable assets.
        headers: { accept: 'image/svg+xml,text/plain,*/*' }
      });
      if (!res.ok) return null;
      const text = await res.text();
      return text;
    } catch {
      return null;
    }
  })();
  remoteSvgCache.set(key, p);
  return p;
}

const ALLOWED = /^[\w\s.,!?+\-/&():@'#]*$/u;

export function sanitizeBadgeParams(raw: Partial<Record<keyof BadgeParams, string | null>>): BadgeParams {
  const label = sanitize(raw.label, BADGE_LIMITS.defaultLabel, BADGE_LIMITS.labelMaxLength);
  const title = sanitize(raw.title, BADGE_LIMITS.defaultTitle, BADGE_LIMITS.titleMaxLength);
  const icon = (raw.icon ?? BADGE_LIMITS.defaultIcon).toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const theme = (raw.theme ?? BADGE_LIMITS.defaultTheme).toLowerCase().replace(/[^a-z0-9-]/g, '');
  
  // For GitHub metrics (stars/forks/issues), allow empty title to be filled later
  const isGitHubMetric = ['stars', 'forks', 'issues'].includes(label.toLowerCase());
  
  return {
    label: label || BADGE_LIMITS.defaultLabel,
    title: isGitHubMetric ? (title || '') : (title || BADGE_LIMITS.defaultTitle),
    icon: icon || BADGE_LIMITS.defaultIcon,
    theme: theme || BADGE_LIMITS.defaultTheme
  };
}

function sanitize(value: string | null | undefined, fallback: string, max: number): string {
  if (!value) return fallback;
  const trimmed = value.trim().slice(0, max);
  if (!ALLOWED.test(trimmed)) {
    return trimmed.replace(/[<>&"]/g, '').slice(0, max);
  }
  return trimmed;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function renderBadgeSvg(params: BadgeParams, compact = false): Promise<string> {
  const theme = getTheme(params.theme);
  const dimensions = compact ? COMPACT_BADGE_DIMENSIONS : BADGE_DIMENSIONS;
  const { width, height, padding, iconSize, borderRadius } = dimensions;

  const labelText = escapeXml(params.label);
  const titleText = escapeXml(params.title);
  const uid = quickHash(`${params.label}|${params.title}|${params.icon}|${params.theme}`);

  const iconX = padding;
  const iconY = (height - iconSize) / 2;
  const textX = iconX + iconSize + 16;

  const iconMarkup = await renderIconMarkup(params.icon, theme.accent, iconSize);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${labelText}: ${titleText}">
  <defs>
    <linearGradient id="surface-${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.surface.from}" />
      <stop offset="100%" stop-color="${theme.surface.to}" />
    </linearGradient>
    <linearGradient id="border-${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.border}" stop-opacity="0.85" />
      <stop offset="50%" stop-color="${theme.accent}" stop-opacity="0.6" />
      <stop offset="100%" stop-color="${theme.glow}" stop-opacity="0.85" />
    </linearGradient>
    <radialGradient id="sheen-${uid}" cx="20%" cy="0%" r="80%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
    <style>
      .badge-label { font-family: 'Inter','Segoe UI',system-ui,sans-serif; font-weight: 500; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; }
      .badge-title { font-family: 'Inter','Segoe UI',system-ui,sans-serif; font-weight: 700; font-size: 22px; letter-spacing: -0.01em; }
    </style>
  </defs>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" ry="${borderRadius}" fill="url(#surface-${uid})"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" ry="${borderRadius}" fill="url(#sheen-${uid})"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${borderRadius}" ry="${borderRadius}" fill="none" stroke="url(#border-${uid})" stroke-width="1.4"/>
  <g transform="translate(${iconX} ${iconY})">
    ${iconMarkup}
  </g>
  <text x="${textX}" y="${height / 2 - 8}" class="badge-label" fill="${theme.text.label}">${labelText}</text>
  <text x="${textX}" y="${height / 2 + 18}" class="badge-title" fill="${theme.text.title}">${titleText}</text>
</svg>`;
}

async function renderIconMarkup(slug: string, accent: string, size: number): Promise<string> {
  // Special handling for New Shields icon
  if (slug === 'newshields') {
    return `<svg width="${size}" height="${size}" viewBox="0 0 156 153" fill="none">
  <defs>
    <linearGradient id="ns1" x1="65.176" y1="42.8212" x2="65.176" y2="129.606" gradientUnits="userSpaceOnUse">
      <stop stop-color="#E3E3E3"/><stop offset="1" stop-color="#7D7D7D"/>
    </linearGradient>
    <linearGradient id="ns2" x1="89.824" y1="21.4843" x2="89.824" y2="108.269" gradientUnits="userSpaceOnUse">
      <stop stop-color="#E3E3E3"/><stop offset="1" stop-color="#7D7D7D"/>
    </linearGradient>
  </defs>
  <path d="M105.599 129.606L19.4054 47.8906L24.7527 42.8212L110.947 124.536L105.599 129.606ZM52.2533 129.606L19.4054 98.3439L24.7527 93.2745L57.7279 124.536L52.2533 129.606Z" fill="url(#ns1)"/>
  <path d="M49.4007 21.4843L135.595 103.199L130.247 108.269L44.0534 26.5538L49.4007 21.4843ZM102.747 21.4843L135.595 52.746L130.247 57.8155L97.2721 26.5538L102.747 21.4843Z" fill="url(#ns2)"/>
</svg>`;
  }

  // Prefer SVGL brand icon unless the slug is an explicit local-only generic.
  if (!isLocalOnly(slug)) {
    const remote = await fetchRemoteSvg(slug);
    const parsed = remote ? parseSvg(remote) : null;
    if (parsed) {
      return `<svg width="${size}" height="${size}" viewBox="${escapeXml(parsed.viewBox)}" preserveAspectRatio="xMidYMid meet">${parsed.inner}</svg>`;
    }
  }
  const local = getIcon(slug);
  const viewBox = local.viewBox ?? '0 0 24 24';
  return `<svg width="${size}" height="${size}" viewBox="${viewBox}" fill="${accent}"><path d="${local.path}"/></svg>`;
}

function quickHash(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}


