<script lang="ts">
  import { ArrowRight, ArrowUpRight, Sparkles, Zap, Palette, Code2, Wand2 } from '@lucide/svelte';
  import BadgeCard from '$lib/components/core/BadgeCard.svelte';
  import { allBadges } from '$content/badges';
  import { cn } from '$lib/utils/style';

  const featured = $derived(allBadges.filter((b) => b.featured));
  const rest = $derived(allBadges.filter((b) => !b.featured));

  function spanClass(span: string | undefined): string {
    if (span === 'wide') return 'md:col-span-2';
    if (span === 'tall') return 'md:row-span-2';
    return '';
  }

  const totalBadges = allBadges.length;
</script>

<svelte:head>
  <title>New Shields — Glowing tech badges for modern READMEs</title>
  <meta
    name="description"
    content="A premium catalog and generator of glassmorphic tech badges for GitHub READMEs and portfolios."
  />
</svelte:head>

<section class="relative z-10 flex min-h-screen flex-col justify-center overflow-hidden">
  <div class="relative mx-auto w-full max-w-[1400px] px-6 pb-20 pt-32 sm:pt-36">

    <p class="reveal font-mono text-[11px] uppercase tracking-[0.28em] text-white/35">
      {totalBadges} badges · Edge-rendered · SVGL icons
    </p>

    <h1
      class="reveal display-text mt-6 select-none uppercase leading-[0.88]"
      data-delay="1"
      style="font-size: clamp(5.5rem, 16vw, 17rem);"
    >
      <span class="display-gradient">New</span><br />
      <span class="display-gradient">Shields</span>
    </h1>

    <div class="reveal mt-10 max-w-2xl" data-delay="2">
      <p class="text-balance text-lg leading-relaxed text-white/50 sm:text-xl">
        Glowing, glassmorphic tech badges for modern READMEs and portfolios.
        Click to copy Markdown instantly, or build your own with the live editor.
      </p>
    </div>

    <div class="reveal mt-6 flex flex-wrap gap-x-8 gap-y-3" data-delay="2">
      <div class="flex items-center gap-2">
        <span class="h-1.5 w-1.5 rounded-full bg-violet-400"></span>
        <span class="font-mono text-[11px] uppercase tracking-widest text-white/40">8 curated themes</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
        <span class="font-mono text-[11px] uppercase tracking-widest text-white/40">SVG · under 40ms</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        <span class="font-mono text-[11px] uppercase tracking-widest text-white/40">Cloudflare edge</span>
      </div>
    </div>

    <div class="reveal mt-14 flex flex-wrap items-center gap-4" data-delay="3">
      <a
        href="/create"
        class="snake-border group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-[0_8px_30px_-12px_rgba(255,255,255,0.4)] transition hover:bg-white/90"
      >
        <Sparkles class="h-4 w-4" />
        Open the builder
        <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
      <a
        href="#catalog"
        class="snake-border group inline-flex items-center gap-2.5 rounded-full bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white/80 backdrop-blur-xl transition hover:bg-white/10"
      >
        <Code2 class="h-4 w-4" />
        Browse catalog
      </a>
    </div>

  </div>
</section>

<div class="relative z-10 bg-[#0a0a0a] pb-32">

<section id="catalog" class="mx-auto max-w-[1400px] px-6 pt-32">
  <div class="reveal mb-10 flex items-end justify-between gap-6">
    <div>
      <span class="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">— 01 / Catalog</span>
      <h2 class="display-text mt-3 text-5xl uppercase text-white sm:text-6xl">
        <span class="display-gradient">The catalog</span>
      </h2>
      <p class="mt-3 max-w-md text-sm text-white/45">
        Click any card to copy the Markdown to your clipboard. Every badge is rendered fresh on the edge.
      </p>
    </div>
    <a
      href="/create"
      class="hidden items-center gap-1.5 self-end font-mono text-[11px] uppercase tracking-widest text-white/60 transition hover:text-white sm:inline-flex"
    >
      Build your own <ArrowUpRight class="h-3.5 w-3.5" />
    </a>
  </div>

  <div class="reveal grid auto-rows-[1fr] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-delay="1">
    {#each featured as badge (badge.id)}
      <BadgeCard {badge} class={spanClass(badge.span)} />
    {/each}
    {#each rest as badge (badge.id)}
      <BadgeCard {badge} class={spanClass(badge.span)} />
    {/each}
  </div>
</section>

<section class="mx-auto mt-32 max-w-[1400px] px-6">
  <div class="reveal mb-12">
    <span class="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">— 02 / Why these</span>
    <h2 class="display-text mt-3 text-5xl uppercase sm:text-6xl">
      <span class="display-gradient">Crafted to</span>
      <span class="serif-italic text-white/90"> stand out.</span>
    </h2>
    <p class="mt-3 max-w-xl text-sm leading-relaxed text-white/50">
      Designed for portfolios and READMEs that want to look premium without lifting a finger.
      Every badge is SVG, accessible, and rendered on Cloudflare's edge.
    </p>
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each [
      { icon: Zap, color: 'text-violet-300', glow: 'rgba(139,92,246,0.15)', accent: 'from-violet-500/20 to-transparent', title: 'Edge-rendered SVG', body: "Fresh render on Cloudflare's edge under 40ms. No caching tricks, no stale CDN copies." },
      { icon: Palette, color: 'text-cyan-300', glow: 'rgba(34,211,238,0.12)', accent: 'from-cyan-500/20 to-transparent', title: 'Eight curated themes', body: 'Aurora, Sunset, Midnight, Forest — each gradient hand-tuned for dark READMEs.' },
      { icon: Code2, color: 'text-emerald-300', glow: 'rgba(52,211,153,0.12)', accent: 'from-emerald-500/20 to-transparent', title: 'Open API', body: 'Single GET to /api/badge.svg. Any params combo, validated and rate-limited at the edge.' },
      { icon: Wand2, color: 'text-fuchsia-300', glow: 'rgba(232,121,249,0.12)', accent: 'from-fuchsia-500/20 to-transparent', title: 'Live builder', body: 'Reactive editor with theme swatches, SVGL icon search and one-click Markdown copy.' },
      { icon: Sparkles, color: 'text-amber-300', glow: 'rgba(251,191,36,0.12)', accent: 'from-amber-500/20 to-transparent', title: 'Glassmorphic glow', body: 'Hand-tuned gradients, rim lighting and blur on every badge. Zero flat clipart.' },
      { icon: ArrowUpRight, color: 'text-sky-300', glow: 'rgba(56,189,248,0.12)', accent: 'from-sky-500/20 to-transparent', title: 'Open source', body: 'MIT licensed. Self-host your own catalog in one command on Cloudflare Pages.' }
    ] as f, i (f.title)}
      {@const Icon = f.icon}
      <div
        class="reveal group relative flex flex-col gap-6 overflow-hidden rounded-2xl bg-white/[0.025] p-7 ring-1 ring-white/[0.07] transition-all duration-300 hover:bg-white/[0.04] hover:ring-white/15"
        data-delay={String(Math.min(6, i + 1))}
      >
        <div
          class="pointer-events-none absolute left-0 top-0 h-32 w-full opacity-60"
          style={`background: radial-gradient(ellipse 80% 60% at 20% 0%, ${f.glow}, transparent 70%);`}
        ></div>
        <div class="relative z-10 flex items-center justify-between">
          <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
            <Icon class={cn('h-5 w-5', f.color)} />
          </div>
          <span class="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">{String(i + 1).padStart(2, '0')}</span>
        </div>
        <div class="relative z-10">
          <h3 class="text-base font-semibold tracking-tight text-white">{f.title}</h3>
          <p class="mt-2 text-sm leading-relaxed text-white/50">{f.body}</p>
        </div>
      </div>
    {/each}
  </div>
</section>

</div>

