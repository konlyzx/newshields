/**
 * Lightweight isomorphic SVG parser: extracts the inner XML of an `<svg>` root
 * along with its viewBox / width / height. Sufficient for inlining brand SVGs
 * (SVGL output) inside our badge SVG without depending on DOMParser.
 */

export interface ParsedSvg {
  inner: string;
  viewBox: string;
  width?: string;
  height?: string;
}

const SVG_OPEN_RE = /<svg\b([^>]*)>/i;
const SVG_CLOSE_RE = /<\/svg\s*>/i;
const VIEWBOX_RE = /\bviewBox\s*=\s*"([^"]+)"/i;
const WIDTH_RE = /\bwidth\s*=\s*"([^"]+)"/i;
const HEIGHT_RE = /\bheight\s*=\s*"([^"]+)"/i;

export function parseSvg(source: string): ParsedSvg | null {
  if (!source) return null;
  const openMatch = source.match(SVG_OPEN_RE);
  const closeMatch = source.match(SVG_CLOSE_RE);
  if (!openMatch || !closeMatch) return null;

  const openEnd = (openMatch.index ?? 0) + openMatch[0].length;
  const closeStart = source.lastIndexOf('</svg');
  if (closeStart < 0 || closeStart < openEnd) return null;

  const attrs = openMatch[1];
  const viewBox =
    VIEWBOX_RE.exec(attrs)?.[1] ??
    deriveViewBox(WIDTH_RE.exec(attrs)?.[1], HEIGHT_RE.exec(attrs)?.[1]);
  const width = WIDTH_RE.exec(attrs)?.[1];
  const height = HEIGHT_RE.exec(attrs)?.[1];

  let inner = source.slice(openEnd, closeStart);
  // Strip XML/DOCTYPE declarations or comments that may have slipped through.
  inner = inner.replace(/<\?xml[^?]*\?>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  inner = normalizeIconFills(inner.trim());
  return { inner, viewBox, width, height };
}

function deriveViewBox(width?: string, height?: string): string {
  const w = parseFloat(width ?? '24');
  const h = parseFloat(height ?? '24');
  return `0 0 ${Number.isFinite(w) ? w : 24} ${Number.isFinite(h) ? h : 24}`;
}

const DARK_FILL_RE = /\b(fill|stroke)\s*=\s*"(#(?:0{3,6}|1{6}|2{6})|black|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))"/gi;
const DARK_STYLE_FILL_RE = /(?:fill|stroke)\s*:\s*(#(?:0{3,6})|black)/gi;

/**
 * Replaces hardcoded black/near-black fills with `currentColor` so monochromatic
 * brand icons (Vercel, Docker, Go, Node.js…) inherit the badge theme accent color.
 * Leaves multi-color icons untouched because their fills won't match the pattern.
 */
function normalizeIconFills(inner: string): string {
  return inner
    .replace(DARK_FILL_RE, (_, attr) => `${attr}="currentColor"`)
    .replace(DARK_STYLE_FILL_RE, (match) => match.replace(/#0{3,6}|black/i, 'currentColor'));
}
