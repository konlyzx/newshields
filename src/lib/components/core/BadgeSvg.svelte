<script lang="ts">
  import { BADGE_DIMENSIONS } from '$lib/config/badge';
  import { getIcon, isLocalOnly } from '$content/icons';
  import { getTheme, type BadgeTheme } from '$content/themes';
  import { svglFetchSvgCached } from '$lib/utils/svgl';
  import { parseSvg, type ParsedSvg } from '$lib/utils/parse-svg';

  type Props = {
    label: string;
    title: string;
    icon: string;
    theme: string;
    customTheme?: BadgeTheme;
    scale?: number;
    class?: string;
    backgroundImage?: string | null;
  };

  let { label, title, icon, theme, customTheme, scale = 1, class: className, backgroundImage = null }: Props = $props();

  const resolvedTheme = $derived(customTheme ?? getTheme(theme));
  const local = $derived(isLocalOnly(icon));
  const fallback = $derived(getIcon(icon));
  const { width, height, padding, iconSize, borderRadius } = BADGE_DIMENSIONS;
  const iconX = padding;
  const iconY = (height - iconSize) / 2;
  const textX = iconX + iconSize + 16;
  const labelY = height / 2 - 8;
  const titleY = height / 2 + 18;

  const uid = $derived(
    `${label}|${title}|${icon}|${theme}`.replace(/[^a-z0-9]/gi, '').slice(0, 16)
  );

  let remoteIcon = $state<ParsedSvg | null>(null);
  let remoteError = $state(false);

  $effect(() => {
    remoteIcon = null;
    remoteError = false;
    if (local) return;
    const slug = icon;
    const ctrl = new AbortController();
    svglFetchSvgCached(slug, ctrl.signal)
      .then((src) => {
        const parsed = parseSvg(src);
        if (parsed) remoteIcon = parsed;
        else remoteError = true;
      })
      .catch(() => {
        remoteError = true;
      });
    return () => ctrl.abort();
  });
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={width * scale}
  height={height * scale}
  viewBox={`0 0 ${width} ${height}`}
  role="img"
  aria-label={`${label}: ${title}`}
  class={className}
>
  <defs>
    <linearGradient id={`s-${uid}`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color={resolvedTheme.surface.from} />
      <stop offset="100%" stop-color={resolvedTheme.surface.to} />
    </linearGradient>
    <linearGradient id={`b-${uid}`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color={resolvedTheme.border} stop-opacity="0.85" />
      <stop offset="50%" stop-color={resolvedTheme.accent} stop-opacity="0.6" />
      <stop offset="100%" stop-color={resolvedTheme.glow} stop-opacity="0.85" />
    </linearGradient>
    <radialGradient id={`sh-${uid}`} cx="20%" cy="0%" r="80%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
    {#if backgroundImage}
      <pattern id={`bg-img-${uid}`} x="0" y="0" width="100%" height="100%" patternUnits="userSpaceOnUse" preserveAspectRatio="xMidYMid slice">
        <image href={backgroundImage} x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </pattern>
    {/if}
  </defs>

  <rect
    x="1"
    y="1"
    width={width - 2}
    height={height - 2}
    rx={borderRadius}
    ry={borderRadius}
    fill={backgroundImage ? `url(#bg-img-${uid})` : `url(#s-${uid})`}
  />
  <rect
    x="1"
    y="1"
    width={width - 2}
    height={height - 2}
    rx={borderRadius}
    ry={borderRadius}
    fill={`url(#sh-${uid})`}
  />
  <rect
    x="1"
    y="1"
    width={width - 2}
    height={height - 2}
    rx={borderRadius}
    ry={borderRadius}
    fill="none"
    stroke={`url(#b-${uid})`}
    stroke-width="1.4"
  />

  <g transform={`translate(${iconX} ${iconY})`}>
    {#if local || remoteError}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox={fallback.viewBox ?? '0 0 24 24'}
        fill={resolvedTheme.accent}
      >
        <path d={fallback.path} />
      </svg>
    {:else if remoteIcon}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox={remoteIcon.viewBox}
        preserveAspectRatio="xMidYMid meet"
        color={resolvedTheme.accent}
      >
        {@html remoteIcon.inner}
      </svg>
    {:else}
      <rect width={iconSize} height={iconSize} rx="6" fill="rgba(255,255,255,0.06)" />
    {/if}
  </g>

  <text
    x={textX}
    y={labelY}
    fill={resolvedTheme.text.label}
    style="font-family: Inter, system-ui, sans-serif; font-weight: 500; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;"
  >
    {label}
  </text>
  <text
    x={textX}
    y={titleY}
    fill={resolvedTheme.text.title}
    style="font-family: Inter, system-ui, sans-serif; font-weight: 700; font-size: 22px; letter-spacing: -0.01em;"
  >
    {title}
  </text>
</svg>
