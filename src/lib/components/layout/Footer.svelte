<script lang="ts">
  import { site } from '$lib/config/site';
</script>

<footer class="relative z-10 mt-0 bg-[#0a0a0a]">
  <div class="wordmark-wrap pointer-events-none relative w-full select-none overflow-hidden px-6 pt-16">
    <svg
      class="wordmark-svg"
      viewBox="0 0 1220 180"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="wm-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(255,255,255,0.13)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0.02)" />
        </linearGradient>
        <linearGradient id="wm-stroke-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#a78bfa" />
          <stop offset="50%" stop-color="#22d3ee" />
          <stop offset="100%" stop-color="#f472b6" />
        </linearGradient>
      </defs>
      <text class="wm-letter wm-fill" x="615" y="158" font-size="180" text-anchor="middle">NEW·SHIELDS</text>
      <text class="wm-letter" x="615" y="158" font-size="180" fill="none" text-anchor="middle">
        <tspan class="wm-stroke" style="animation-delay:0s">N</tspan><!--
        --><tspan class="wm-stroke" style="animation-delay:0.8s">E</tspan><!--
        --><tspan class="wm-stroke" style="animation-delay:1.6s">W</tspan><!--
        --><tspan class="wm-stroke" style="animation-delay:2.4s">·</tspan><!--
        --><tspan class="wm-stroke" style="animation-delay:3.2s">S</tspan><!--
        --><tspan class="wm-stroke" style="animation-delay:4.0s">H</tspan><!--
        --><tspan class="wm-stroke" style="animation-delay:4.8s">I</tspan><!--
        --><tspan class="wm-stroke" style="animation-delay:5.6s">E</tspan><!--
        --><tspan class="wm-stroke" style="animation-delay:6.4s">L</tspan><!--
        --><tspan class="wm-stroke" style="animation-delay:7.2s">D</tspan><!--
        --><tspan class="wm-stroke" style="animation-delay:8.0s">S</tspan>
      </text>
    </svg>
  </div>

  <div class="mx-auto max-w-[1550px] px-6 pb-10">
    <div class="flex flex-col items-start justify-between gap-6 border-t border-white/5 pt-8 sm:flex-row sm:items-center">
      <div class="flex items-center gap-4">
        <span class="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
          © {new Date().getFullYear()} · {site.name} · MIT License
        </span>
        <span class="hidden h-3 w-px bg-white/10 sm:inline-block"></span>
        <span class="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 sm:inline">
          Edge-rendered · SVGL icons · Svelte 5
        </span>
      </div>
      <div class="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
        <a href={site.links.github} target="_blank" rel="noopener noreferrer" class="transition hover:text-white">GitHub ↗</a>
        <a href="/create" class="transition hover:text-white">Builder</a>
        <a href="/#api" class="transition hover:text-white">API</a>
      </div>
    </div>
  </div>
</footer>

<style>
  .wordmark-wrap {
    width: 100%;
  }

  .wordmark-svg {
    width: 100%;
    height: auto;
    display: block;
    font-family: 'Anton', 'Plus Jakarta Sans', sans-serif;
    font-weight: 900;
    overflow: visible;
  }

  .wm-letter {
    font-family: inherit;
    font-weight: 900;
    text-transform: uppercase;
  }

  .wm-fill {
    fill: url(#wm-fill);
    stroke: none;
  }

  :global(.wm-stroke) {
    fill: none;
    stroke: url(#wm-stroke-grad);
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 2000;
    stroke-dashoffset: 2000;
    /* total cycle duration — all letters share the same period so they stay in sync */
    animation: letter-snake 18s cubic-bezier(0.4, 0, 0.2, 1) infinite both;
  }

  @keyframes letter-snake {
    0%    { stroke-dashoffset: 2000; opacity: 0; }
    1%    { stroke-dashoffset: 2000; opacity: 1; }
    8%    { stroke-dashoffset: 0;    opacity: 1; }
    80%   { stroke-dashoffset: 0;    opacity: 1; }
    90%   { stroke-dashoffset: 0;    opacity: 0; }
    100%  { stroke-dashoffset: 2000; opacity: 0; }
  }
</style>
