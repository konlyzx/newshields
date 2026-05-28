<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { page } from '$app/stores';
  import { toast } from 'svelte-sonner';
  import {
    Search,
    Copy,
    Download,
    Link2,
    RotateCcw,
    Heart,
    Loader2,
    X,
    Code2,
    Globe2,
    Sparkles,
    ZoomIn,
    ZoomOut,
    Hand,
    ArrowLeft,
    ChevronDown,
    Save,
    Type,
    Palette,
    Sliders,
    Upload,
    Image as ImageIcon,
    Terminal as TerminalIcon
  } from '@lucide/svelte';
  import BadgeSvg from '$lib/components/core/BadgeSvg.svelte';
  import { allThemes, type ThemeId, type BadgeTheme } from '$content/themes';
  import { BADGE_LIMITS } from '$lib/config/badge';
  import { buildBadgeMarkdown, buildBadgeUrl } from '$lib/utils/badge-url';
  import { copyToClipboard } from '$lib/utils/clipboard';
  import { highlightMarkdown } from '$lib/utils/highlight';
  import {
    svglList,
    svglSearch,
    svglRoute,
    svglSlug,
    type SvglIcon
  } from '$lib/utils/svgl';
  import { cn } from '$lib/utils/style';
  import { fetchGitHubStars, formatStars } from '$lib/utils/github-stars';

  let starCount = $state(0);

  let label = $state<string>(BADGE_LIMITS.defaultLabel);
  let title = $state<string>(BADGE_LIMITS.defaultTitle);
  let icon = $state<string>(BADGE_LIMITS.defaultIcon);
  let theme = $state<ThemeId>(BADGE_LIMITS.defaultTheme as ThemeId);

  /* ============== Custom theme state ============== */
  type CustomThemeMode = 'preset' | 'custom' | 'image';
  let themeMode = $state<CustomThemeMode>('preset');
  let customFrom = $state('#1A0B2E');
  let customTo = $state('#0B132B');
  let customAccent = $state('#8B5CF6');
  let customGlow = $state('#8B5CF6');
  let customTextLabel = $state('#C4B5FD');
  let customTextTitle = $state('#FFFFFF');
  let customBg = $state<string | null>(null);
  let fileInputEl: HTMLInputElement | null = $state(null);

  function handleImageUpload(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      customBg = ev.target?.result as string;
      try { localStorage.setItem('newshields:customBg', customBg); } catch { /**/ }
    };
    reader.readAsDataURL(file);
  }

  const PRESET_THEMES = allThemes.slice(0, 6);

  const customThemeObj = $derived.by<BadgeTheme | undefined>(() => {
    if (themeMode !== 'custom') return undefined;
    return {
      id: 'custom',
      name: 'Custom',
      description: 'User-defined gradient',
      surface: { from: customFrom, to: customTo },
      border: customAccent,
      glow: customGlow,
      text: { label: customTextLabel, title: customTextTitle },
      accent: customAccent,
      swatch: `linear-gradient(135deg, ${customFrom} 0%, ${customTo} 100%)`
    };
  });

  const canvasGlow = $derived.by(() => {
    if (themeMode === 'custom') return customGlow;
    return (allThemes.find(t => t.id === theme) ?? allThemes[0]).glow;
  });

  let stageScale = $state<number>(1.4);
  const SCALE_MIN = 0.5;
  const SCALE_MAX = 2.6;

  /* ============== Drag/pan state ============== */
  let panMode = $state(false);
  let dragOffsetX = $state(0);
  let dragOffsetY = $state(0);
  let isDragging = $state(false);
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOriginX = 0;
  let dragOriginY = 0;

  function onStageMouseDown(e: MouseEvent): void {
    if (!panMode) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragOriginX = dragOffsetX;
    dragOriginY = dragOffsetY;
  }
  function onDragMove(e: MouseEvent | TouchEvent): void {
    if (!isDragging) return;
    const point = 'touches' in e ? e.touches[0] : e;
    dragOffsetX = dragOriginX + (point.clientX - dragStartX);
    dragOffsetY = dragOriginY + (point.clientY - dragStartY);
  }
  function onDragEnd(): void {
    isDragging = false;
  }

  let iconQuery = $state('');
  let iconResults = $state<SvglIcon[]>([]);
  let iconPopular = $state<SvglIcon[]>([]);
  let iconLoading = $state(false);

  type Favorite = {
    slug: string;
    title: string;
    route: string | { dark: string; light: string };
  };
  let favorites = $state<Favorite[]>([]);
  let favoritesReady = $state(false);
  const favSlugs = $derived(new Set(favorites.map((f) => f.slug)));
  let favOnly = $state(false);

  let outputTab = $state<'markdown' | 'url' | 'api'>('markdown');
  let highlighted = $state<string>('');

  let openContent = $state(true);
  let openTheme = $state(true);
  let openIcon = $state(true);
  let openOutput = $state(true);

  const origin = $derived($page.url.origin);
  const params = $derived({ label, title, icon, theme });
  const markdown = $derived(buildBadgeMarkdown(origin, params));
  const directUrl = $derived(buildBadgeUrl(origin, params));
  const apiUrl = $derived(
    `${origin}/api/badge.svg?label=${encodeURIComponent(label)}&title=${encodeURIComponent(title)}&icon=${encodeURIComponent(icon)}&theme=${encodeURIComponent(theme)}`
  );

  $effect(() => {
    const code = markdown;
    highlightMarkdown(code)
      .then((html) => (highlighted = html))
      .catch(() => (highlighted = `<pre>${code}</pre>`));
  });

  onMount(async () => {
    try {
      const raw = localStorage.getItem('newshields:favorites');
      if (raw) favorites = JSON.parse(raw) as Favorite[];
    } catch {
      // ignore
    }
    favoritesReady = true;

    fetchGitHubStars().then((n) => (starCount = n));

    try {
      iconLoading = true;
      iconPopular = await svglList({ limit: 24 });
    } catch {
      // ignore
    } finally {
      iconLoading = false;
    }
  });

  $effect(() => {
    if (!favoritesReady) return;
    try {
      localStorage.setItem('newshields:favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  });

  /* ============== Icon search debounce ============== */
  let searchTimer: ReturnType<typeof setTimeout> | null = null;
  let searchCtrl: AbortController | null = null;

  $effect(() => {
    const q = iconQuery.trim();
    untrack(() => {
      if (searchTimer) clearTimeout(searchTimer);
      searchCtrl?.abort();

      if (!q) {
        iconResults = [];
        iconLoading = false;
        return;
      }
      iconLoading = true;
      searchTimer = setTimeout(async () => {
        const ctrl = new AbortController();
        searchCtrl = ctrl;
        try {
          const r = await svglSearch(q, ctrl.signal);
          if (!ctrl.signal.aborted) iconResults = r.slice(0, 100);
        } catch {
          // ignore
        } finally {
          if (!ctrl.signal.aborted) iconLoading = false;
        }
      }, 200);
    });
  });

  const iconList = $derived.by<SvglIcon[]>(() => {
    if (favOnly) {
      return favorites.map((f, i) => ({
        id: 1_000_000 + i,
        title: f.title,
        category: 'Favorites',
        route: f.route,
        url: ''
      }));
    }
    if (iconQuery.trim()) return iconResults;
    return iconPopular;
  });

  function setIconAndTitle(i: SvglIcon): void {
    icon = svglSlug(i);
    title = i.title;
  }
  function selectIconOnly(i: SvglIcon): void {
    icon = svglSlug(i);
  }
  function toggleFavorite(i: SvglIcon): void {
    const slug = svglSlug(i);
    if (favSlugs.has(slug)) {
      favorites = favorites.filter((f) => f.slug !== slug);
    } else {
      favorites = [
        ...favorites,
        { slug, title: i.title, route: i.route as Favorite['route'] }
      ];
    }
  }

  async function copy(value: string, what: string): Promise<void> {
    const ok = await copyToClipboard(value);
    if (ok) toast.success(`${what} copied`, { duration: 1200 });
    else toast.error(`Could not copy ${what.toLowerCase()}`);
  }

  function reset(): void {
    label = BADGE_LIMITS.defaultLabel;
    title = BADGE_LIMITS.defaultTitle;
    icon = BADGE_LIMITS.defaultIcon;
    theme = BADGE_LIMITS.defaultTheme as ThemeId;
    themeMode = 'preset';
    stageScale = 1.4;
    dragOffsetX = 0;
    dragOffsetY = 0;
    panMode = false;
    toast.info('Reset to defaults');
  }

  const SURPRISE_POOL: ReadonlyArray<{ slug: string; title: string }> = [
    { slug: 'svelte', title: 'Svelte' },
    { slug: 'react', title: 'React' },
    { slug: 'typescript', title: 'TypeScript' },
    { slug: 'tailwindcss', title: 'Tailwind CSS' },
    { slug: 'cloudflare', title: 'Cloudflare' },
    { slug: 'vercel', title: 'Vercel' },
    { slug: 'docker', title: 'Docker' },
    { slug: 'nextjs', title: 'Next.js' },
    { slug: 'astro', title: 'Astro' },
    { slug: 'bun', title: 'Bun' },
    { slug: 'rust', title: 'Rust' },
    { slug: 'go', title: 'Go' },
    { slug: 'python', title: 'Python' },
    { slug: 'nodejs', title: 'Node.js' },
    { slug: 'figma', title: 'Figma' },
    { slug: 'postgresql', title: 'PostgreSQL' },
    { slug: 'supabase', title: 'Supabase' },
    { slug: 'pocketbase', title: 'PocketBase' },
    { slug: 'prisma', title: 'Prisma' },
    { slug: 'planetscale', title: 'PlanetScale' },
    { slug: 'vite', title: 'Vite' },
    { slug: 'vitest', title: 'Vitest' },
    { slug: 'turborepo', title: 'Turborepo' },
    { slug: 'aws', title: 'AWS' },
    { slug: 'github', title: 'GitHub' },
    { slug: 'linear', title: 'Linear' },
    { slug: 'notion', title: 'Notion' },
    { slug: 'openai', title: 'OpenAI' },
    { slug: 'stripe', title: 'Stripe' },
    { slug: 'redis', title: 'Redis' },
    { slug: 'mongodb', title: 'MongoDB' },
    { slug: 'graphql', title: 'GraphQL' },
    { slug: 'drizzle', title: 'Drizzle' },
    { slug: 'nuxtjs', title: 'Nuxt' },
    { slug: 'angular', title: 'Angular' },
    { slug: 'vue', title: 'Vue' },
    { slug: 'solidjs', title: 'SolidJS' },
    { slug: 'deno', title: 'Deno' },
    { slug: 'elixir', title: 'Elixir' },
    { slug: 'swift', title: 'Swift' },
    { slug: 'flutter', title: 'Flutter' },
    { slug: 'kotlin', title: 'Kotlin' }
  ];

  function randomize(): void {
    const pick = SURPRISE_POOL[Math.floor(Math.random() * SURPRISE_POOL.length)];
    const randomTheme = allThemes[Math.floor(Math.random() * allThemes.length)];
    icon = pick.slug;
    theme = randomTheme.id as ThemeId;
    title = pick.title;
    toast.success('Surprise generated');
  }

  function downloadSvg(): void {
    const svg = document.querySelector<SVGSVGElement>('#stage-canvas svg');
    if (!svg) return;
    const source = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'badge').toLowerCase().replace(/\s+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('SVG downloaded');
  }

  function zoom(delta: number): void {
    stageScale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, +(stageScale + delta).toFixed(2)));
  }
  function zoomFit(): void {
    stageScale = 1.4;
  }

</script>

<svelte:head>
  <title>{icon} · {theme} — New Shields Editor</title>
</svelte:head>

<div class="editor-shell flex h-screen flex-col overflow-hidden bg-ink-950 text-white">
  <header
    class="flex h-14 shrink-0 items-center justify-between gap-3 bg-ink-950/60 px-3 backdrop-blur-xl sm:px-4"
    style="box-shadow: 0 1px 0 rgba(255,255,255,0.04);"
  >
    <div class="flex min-w-0 items-center gap-2">
      <a
        href="/"
        class="group inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
      >
        <ArrowLeft class="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Back
      </a>
    </div>

    <div class="flex items-center gap-1">
      <a
        href="https://github.com/konlyzx/newshields"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1.5 text-white/75 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        title="GitHub"
      >
        <svg viewBox="0 0 16 16" class="h-3.5 w-3.5 shrink-0 fill-current" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2 1.02A7.66 7.66 0 0 1 8 4.07c.68 0 1.36.09 2 .27 1.53-1.04 2.2-1.02 2.2-1.02.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
        <span class="font-mono text-[11px] tracking-tight">{formatStars(starCount)}</span>
      </a>
      <span class="mx-0.5 h-4 w-px bg-white/[0.08]"></span>
      <button
        type="button"
        onclick={randomize}
        title="Randomize"
        class="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs text-white/65 transition hover:bg-white/[0.06] hover:text-white"
      >
        <Sparkles class="h-3.5 w-3.5" />
        <span class="hidden md:inline">Surprise</span>
      </button>
      <button
        type="button"
        onclick={reset}
        title="Reset"
        class="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs text-white/65 transition hover:bg-white/[0.06] hover:text-white"
      >
        <RotateCcw class="h-3.5 w-3.5" />
        <span class="hidden md:inline">Reset</span>
      </button>

      <span class="mx-1.5 h-4 w-px bg-white/[0.08]"></span>

      <button
        type="button"
        onclick={() => copy(directUrl, 'URL')}
        class="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/[0.04] px-3 text-xs text-white/85 transition hover:bg-white/10"
      >
        <Save class="h-3.5 w-3.5" />
        <span class="hidden sm:inline">Save URL</span>
      </button>
      <button
        type="button"
        onclick={() => copy(markdown, 'Markdown')}
        class="ml-0.5 inline-flex h-8 items-center gap-2 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 px-3.5 text-xs font-medium text-white shadow-[0_4px_20px_-4px_rgba(140,90,255,0.6)] ring-1 ring-violet-400/30 transition hover:from-violet-400 hover:to-violet-500"
      >
        <Copy class="h-3.5 w-3.5" />
        Publish
      </button>
    </div>
  </header>

  <div class="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
    <main class="relative flex min-h-[60vh] min-w-0 flex-col overflow-hidden lg:min-h-0">
      <div
        class="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style="background-color: #08080A; background-image: radial-gradient(rgba(255,255,255,0.075) 1px, transparent 1px); background-size: 22px 22px; mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, black 60%, transparent 95%);"
      ></div>
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style="background: radial-gradient(closest-side, rgba(120,80,255,0.16), transparent 70%);"
        aria-hidden="true"
      ></div>

      <div class="relative z-10 flex justify-end items-center gap-2 pr-3 py-2 sm:pr-4">
        <span
          class="inline-flex items-center gap-1.5 rounded-md bg-ink-950/65 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 backdrop-blur top-0 right-0 sticky"
        >
          <span class="h-1.5 w-1.5"></span>
          {icon}.svg · {theme}
        </span>
      </div>

      <div
        id="stage-canvas"
        class="relative z-10 flex flex-1 items-center justify-center overflow-hidden px-4 py-6 sm:px-8"
        role="presentation"
        style={panMode ? (isDragging ? 'cursor: grabbing;' : 'cursor: grab;') : ''}
        onmousedown={onStageMouseDown}
        onmousemove={onDragMove}
        onmouseup={onDragEnd}
        onmouseleave={onDragEnd}
        ontouchmove={onDragMove}
        ontouchend={onDragEnd}
      >
        <div
          class="relative will-change-transform"
          style={`transform: translate(${dragOffsetX}px, ${dragOffsetY}px) scale(${stageScale}); transition: ${isDragging ? 'none' : 'transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)'}; filter: drop-shadow(0 20px 50px color-mix(in srgb, ${canvasGlow} 55%, transparent)) drop-shadow(0 4px 16px rgba(0,0,0,0.5));`}
        >
          <BadgeSvg
            {label}
            {title}
            {icon}
            {theme}
            customTheme={customThemeObj}
            scale={1}
            backgroundImage={themeMode === 'image' ? customBg : null}
          />
        </div>

        <div
          class="absolute bottom-4 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-white/10 bg-ink-900/85 p-1 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] backdrop-blur-xl"
        >
          <button
            type="button"
            onclick={() => zoom(-0.2)}
            aria-label="Zoom out"
            class="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/65 transition hover:bg-white/10 hover:text-white"
          >
            <ZoomOut class="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onclick={zoomFit}
            class="inline-flex h-7 min-w-[3.25rem] items-center justify-center rounded-full px-2 font-mono text-[10px] tabular-nums text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            {Math.round(stageScale * 100)}%
          </button>
          <button
            type="button"
            onclick={() => zoom(0.2)}
            aria-label="Zoom in"
            class="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/65 transition hover:bg-white/10 hover:text-white"
          >
            <ZoomIn class="h-3.5 w-3.5" />
          </button>
          <span class="mx-0.5 h-4 w-px bg-white/10"></span>
          <button
            type="button"
            onclick={() => (panMode = !panMode)}
            aria-label={panMode ? 'Disable pan mode' : 'Enable pan mode'}
            title={panMode ? 'Pan mode on — click to disable' : 'Click to pan badge'}
            class={cn(
              'inline-flex h-7 w-7 items-center justify-center rounded-full transition',
              panMode
                ? 'bg-violet-500/25 text-violet-300 ring-1 ring-violet-400/40'
                : 'text-white/65 hover:bg-white/10 hover:text-white'
            )}
          >
            <Hand class="h-3.5 w-3.5" />
          </button>
          <span class="mx-0.5 h-4 w-px bg-white/10"></span>
          <button
            type="button"
            onclick={downloadSvg}
            aria-label="Download SVG"
            title="Download SVG"
            class="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/65 transition hover:bg-white/10 hover:text-white"
          >
            <Download class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </main>

    <aside
      class="relative flex min-h-0 flex-col bg-ink-900/60 backdrop-blur"
      style="box-shadow: -1px 0 0 rgba(255,255,255,0.04);"
    >
      <header class="flex shrink-0 items-center justify-between px-4 py-3">
        <span class="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">Compose</span>
        <span class="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">v1</span>
      </header>
      <div class="mx-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent"></div>

      <div
        class="flex-1 overflow-y-auto px-2 pb-6"
        data-lenis-prevent
      >
        <section class="rounded-lg">
          <button
            type="button"
            onclick={() => (openContent = !openContent)}
            class="flex w-full items-center justify-between rounded-md px-2 py-2 text-left"
          >
            <span class="flex items-center gap-2">
              <Type class="h-3.5 w-3.5 text-white/55" />
              <span class="text-[13px] font-medium text-white">Content</span>
            </span>
            <ChevronDown
              class={cn(
                'h-3.5 w-3.5 text-white/40 transition-transform',
                !openContent && '-rotate-90'
              )}
            />
          </button>
          <div class="overflow-hidden transition-all duration-200" style={openContent ? 'max-height: 400px; opacity: 1;' : 'max-height: 0; opacity: 0;'}>
            <div class="space-y-2.5 px-2 pb-3 pt-1">
              <div class="space-y-1">
                <label
                  for="ed-label"
                  class="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45"
                >
                  Label
                </label>
                <input
                  id="ed-label"
                  type="text"
                  bind:value={label}
                  maxlength={BADGE_LIMITS.labelMaxLength}
                  placeholder="Powered by"
                  class="h-9 w-full rounded-md bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/30 transition-colors focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-violet-400/40"
                />
                <div class="flex justify-end">
                  <span class="font-mono text-[9px] tracking-widest text-white/30">
                    {label.length}/{BADGE_LIMITS.labelMaxLength}
                  </span>
                </div>
              </div>
              <div class="space-y-1">
                <label
                  for="ed-title"
                  class="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45"
                >
                  Title
                </label>
                <input
                  id="ed-title"
                  type="text"
                  bind:value={title}
                  maxlength={BADGE_LIMITS.titleMaxLength}
                  placeholder="Svelte 5"
                  class="h-9 w-full rounded-md bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/30 transition-colors focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-violet-400/40"
                />
                <div class="flex justify-end">
                  <span class="font-mono text-[9px] tracking-widest text-white/30">
                    {title.length}/{BADGE_LIMITS.titleMaxLength}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="mx-2 my-1 h-px bg-white/5"></div>

        <section>
          <button
            type="button"
            onclick={() => (openTheme = !openTheme)}
            class="flex w-full items-center justify-between rounded-md px-2 py-2 text-left"
          >
            <span class="flex items-center gap-2">
              <Palette class="h-3.5 w-3.5 text-white/55" />
              <span class="text-[13px] font-medium text-white">Theme</span>
            </span>
            <span class="flex items-center gap-2">
              <span class="font-mono text-[10px] uppercase tracking-widest text-white/40">
                {theme}
              </span>
              <ChevronDown
                class={cn(
                  'h-3.5 w-3.5 text-white/40 transition-transform',
                  !openTheme && '-rotate-90'
                )}
              />
            </span>
          </button>
          <div class="overflow-hidden transition-all duration-200" style={openTheme ? 'max-height: 600px; opacity: 1;' : 'max-height: 0; opacity: 0;'}>
            <div class="px-2 pb-3 pt-1 space-y-2">
              <div class="grid grid-cols-3 gap-1.5">
                {#each PRESET_THEMES as t (t.id)}
                  {@const active = themeMode === 'preset' && theme === t.id}
                  <button
                    type="button"
                    onclick={() => { theme = t.id as ThemeId; themeMode = 'preset'; }}
                    aria-label={`Apply ${t.name} theme`}
                    title={t.name}
                    class={cn(
                      'group relative aspect-[2/1] overflow-hidden rounded-lg ring-1 transition-all hover:ring-white/35',
                      active ? 'ring-2 ring-violet-300/70' : 'ring-white/10'
                    )}
                    style={`background: ${t.swatch}`}
                  >
                    <span
                      class={cn(
                        'absolute inset-0 flex items-end px-2 pb-1.5 bg-gradient-to-t from-black/60 to-transparent text-[9px] font-medium text-white opacity-0 transition group-hover:opacity-100',
                        active && 'opacity-100'
                      )}
                    >
                      {t.name}
                    </span>
                  </button>
                {/each}
              </div>

              <div class="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onclick={() => (themeMode = 'custom')}
                  class={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2.5 text-left ring-1 transition-all',
                    themeMode === 'custom'
                      ? 'bg-white/[0.06] ring-violet-400/50 text-white'
                      : 'bg-white/[0.02] ring-white/10 text-white/60 hover:bg-white/[0.04] hover:text-white'
                  )}
                >
                  <Sliders class="h-3.5 w-3.5 shrink-0" />
                  <span class="text-[11px] font-medium">Custom</span>
                </button>

                <button
                  type="button"
                  onclick={() => { themeMode = 'image'; fileInputEl?.click(); }}
                  class={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2.5 text-left ring-1 transition-all',
                    themeMode === 'image'
                      ? 'bg-white/[0.06] ring-violet-400/50 text-white'
                      : 'bg-white/[0.02] ring-white/10 text-white/60 hover:bg-white/[0.04] hover:text-white'
                  )}
                >
                  <Upload class="h-3.5 w-3.5 shrink-0" />
                  <span class="text-[11px] font-medium">Image</span>
                </button>
                <input
                  bind:this={fileInputEl}
                  type="file"
                  accept="image/*"
                  class="hidden"
                  onchange={handleImageUpload}
                />
              </div>

              {#if themeMode === 'custom'}
                <div class="space-y-2 rounded-lg bg-white/[0.03] p-2.5">
                  <div class="flex items-center gap-2">
                    <span class="w-14 font-mono text-[9px] uppercase tracking-widest text-white/40">From</span>
                    <input type="color" bind:value={customFrom} class="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                    <span class="font-mono text-[10px] text-white/50">{customFrom}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-14 font-mono text-[9px] uppercase tracking-widest text-white/40">To</span>
                    <input type="color" bind:value={customTo} class="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                    <span class="font-mono text-[10px] text-white/50">{customTo}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-14 font-mono text-[9px] uppercase tracking-widest text-white/40">Accent</span>
                    <input type="color" bind:value={customAccent} class="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                    <span class="font-mono text-[10px] text-white/50">{customAccent}</span>
                  </div>
                  <div class="my-1.5 h-px bg-white/[0.06]"></div>
                  <div class="flex items-center gap-2">
                    <span class="w-14 font-mono text-[9px] uppercase tracking-widest text-white/40">Label</span>
                    <input type="color" bind:value={customTextLabel} class="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                    <span class="font-mono text-[10px] text-white/50">{customTextLabel}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-14 font-mono text-[9px] uppercase tracking-widest text-white/40">Title</span>
                    <input type="color" bind:value={customTextTitle} class="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0" />
                    <span class="font-mono text-[10px] text-white/50">{customTextTitle}</span>
                  </div>
                </div>
              {/if}

              {#if themeMode === 'image' && customBg}
                <div class="relative overflow-hidden rounded-lg" style="aspect-ratio: 3/1;">
                  <img src={customBg} alt="Custom background" class="h-full w-full object-cover" />
                  <button
                    type="button"
                    onclick={() => { customBg = null; themeMode = 'preset'; }}
                    class="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white/80 transition hover:bg-black/80"
                  >
                    <X class="h-3 w-3" />
                  </button>
                </div>
              {/if}
            </div>
          </div>
        </section>

        <div class="mx-2 my-1 h-px bg-white/5"></div>

        <section>
          <button
            type="button"
            onclick={() => (openIcon = !openIcon)}
            class="flex w-full items-center justify-between rounded-md px-2 py-2 text-left"
          >
            <span class="flex items-center gap-2">
              <ImageIcon class="h-3.5 w-3.5 text-white/55" />
              <span class="text-[13px] font-medium text-white">Icon</span>
            </span>
            <span class="flex items-center gap-2">
              <span class="font-mono text-[10px] uppercase tracking-widest text-white/40">
                {icon}
              </span>
              <ChevronDown
                class={cn(
                  'h-3.5 w-3.5 text-white/40 transition-transform',
                  !openIcon && '-rotate-90'
                )}
              />
            </span>
          </button>

          <div class="overflow-hidden transition-all duration-200" style={openIcon ? 'max-height: 900px; opacity: 1;' : 'max-height: 0; opacity: 0;'}>
            <div class="space-y-2 px-2 pb-3 pt-1">
              <div class="relative">
                <Search class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
                <input
                  type="search"
                  bind:value={iconQuery}
                  placeholder="Search icons via SVGL…"
                  class="h-9 w-full rounded-md bg-white/[0.04] pl-8 pr-8 text-xs text-white placeholder:text-white/35 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-violet-400/40"
                />
                {#if iconQuery}
                  <button
                    type="button"
                    onclick={() => (iconQuery = '')}
                    class="absolute right-1.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-white/40 transition hover:bg-white/10 hover:text-white"
                    aria-label="Clear"
                  >
                    <X class="h-3 w-3" />
                  </button>
                {:else if iconLoading}
                  <Loader2 class="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-white/40" />
                {/if}
              </div>

              <div class="flex items-center justify-between text-[10px]">
                <button
                  type="button"
                  onclick={() => (favOnly = !favOnly)}
                  class={cn(
                    'inline-flex items-center gap-1 rounded px-1.5 py-1 font-mono uppercase tracking-widest transition',
                    favOnly
                      ? 'bg-rose-500/20 text-rose-200'
                      : 'text-white/55 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Heart class={cn('h-2.5 w-2.5', favOnly && 'fill-current')} />
                  Favorites · {favorites.length}
                </button>
                <span class="font-mono uppercase tracking-widest text-white/30">
                  {iconList.length} shown
                </span>
              </div>

              <div class="rounded-md bg-black/20 p-1.5">
                {#if iconList.length === 0 && favOnly}
                  <p class="px-2 py-6 text-center text-[11px] text-white/40">
                    No favorites yet — tap the heart on any icon.
                  </p>
                {:else if iconList.length === 0 && iconQuery && !iconLoading}
                  <p class="px-2 py-6 text-center text-[11px] text-white/40">
                    No icons match "{iconQuery}".
                  </p>
                {:else}
                  <div class="grid max-h-56 grid-cols-6 gap-1 overflow-y-auto pr-1">
                    {#if iconLoading && iconList.length === 0}
                      {#each Array(24) as _, pi (pi)}
                        <div class="aspect-square animate-pulse rounded-md bg-white/[0.05]" style={`animation-delay: ${pi * 30}ms`}></div>
                      {/each}
                    {/if}
                    {#each iconList as i (i.id + ':' + i.title)}
                      {@const slug = svglSlug(i)}
                      {@const url = svglRoute(i, 'dark')}
                      {@const selected = icon === slug}
                      {@const isFav = favSlugs.has(slug)}
                      <div
                        class={cn(
                          'group relative flex aspect-square items-center justify-center rounded-md border bg-white/[0.02] transition hover:border-white/25 hover:bg-white/[0.05]',
                          selected
                            ? 'border-violet-400/50 bg-violet-400/10 ring-1 ring-violet-400/40'
                            : 'border-transparent'
                        )}
                      >
                        <button
                          type="button"
                          onclick={() => selectIconOnly(i)}
                          ondblclick={() => setIconAndTitle(i)}
                          title={`${i.title} — click to use, double-click to set title too`}
                          class="flex h-full w-full items-center justify-center p-1.5"
                        >
                          <img
                            src={url}
                            alt={i.title}
                            loading="lazy"
                            class="h-5 w-5 object-contain"
                          />
                        </button>
                        <button
                          type="button"
                          onclick={() => toggleFavorite(i)}
                          aria-label={isFav ? 'Unfavorite' : 'Favorite'}
                          class={cn(
                            'absolute -right-0.5 -top-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/70 text-white/80 backdrop-blur transition',
                            isFav ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          )}
                        >
                          <Heart class={cn('h-2.5 w-2.5', isFav && 'fill-rose-400 text-rose-400')} />
                        </button>
                        {#if selected}
                          <div
                            class="absolute -left-0.5 -top-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-violet-300 text-violet-950 font-bold text-[8px]"
                          >✓</div>
                        {/if}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>

              <p class="px-1 text-[10px] leading-relaxed text-white/35">
                Click to set the icon · double-click to also use the brand name as title.
              </p>
            </div>
          </div>
        </section>

        <div class="mx-2 my-1 h-px bg-white/5"></div>

        <section>
          <button
            type="button"
            onclick={() => (openOutput = !openOutput)}
            class="flex w-full items-center justify-between rounded-md px-2 py-2 text-left"
          >
            <span class="flex items-center gap-2">
              <TerminalIcon class="h-3.5 w-3.5 text-white/55" />
              <span class="text-[13px] font-medium text-white">Output</span>
            </span>
            <ChevronDown
              class={cn(
                'h-3.5 w-3.5 text-white/40 transition-transform',
                !openOutput && '-rotate-90'
              )}
            />
          </button>
          <div class="overflow-hidden transition-all duration-200" style={openOutput ? 'max-height: 500px; opacity: 1;' : 'max-height: 0; opacity: 0;'}>
            <div class="px-2 pb-4 pt-1">
              <div class="overflow-hidden rounded-lg bg-black/25" style="box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);">
                <div class="flex items-stretch" style="box-shadow: 0 1px 0 rgba(255,255,255,0.06);">
                  {#each [
                    { id: 'markdown' as const, label: 'Markdown', icon: Code2 },
                    { id: 'url' as const, label: 'URL', icon: Link2 },
                    { id: 'api' as const, label: 'API', icon: Globe2 }
                  ] as t (t.id)}
                    {@const Icon = t.icon}
                    <button
                      type="button"
                      onclick={() => (outputTab = t.id)}
                      class={cn(
                        'inline-flex flex-1 items-center justify-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition',
                        outputTab === t.id
                          ? 'bg-white/[0.05] text-white'
                          : 'text-white/45 hover:bg-white/[0.02] hover:text-white/80'
                      )}
                    >
                      <Icon class="h-3 w-3" />
                      {t.label}
                    </button>
                  {/each}
                </div>
                {#if outputTab === 'markdown'}
                  <div class="p-3 text-xs leading-relaxed">
                    {#if highlighted}
                      {@html highlighted}
                    {:else}
                      <pre class="whitespace-pre-wrap break-all text-white/70">{markdown}</pre>
                    {/if}
                  </div>
                  <div style="box-shadow: 0 -1px 0 rgba(255,255,255,0.05);" class="flex items-center justify-end px-3 py-2">
                    <button
                      type="button"
                      onclick={() => copy(markdown, 'Markdown')}
                      class="inline-flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium text-white/80 transition hover:bg-white/15 hover:text-white"
                    >
                      <Copy class="h-3 w-3" />
                      Copy
                    </button>
                  </div>
                {:else if outputTab === 'url'}
                  <div class="break-all p-3 font-mono text-xs text-white/75">
                    {directUrl}
                  </div>
                  <div style="box-shadow: 0 -1px 0 rgba(255,255,255,0.05);" class="flex items-center justify-end px-3 py-2">
                    <button
                      type="button"
                      onclick={() => copy(directUrl, 'URL')}
                      class="inline-flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium text-white/80 transition hover:bg-white/15 hover:text-white"
                    >
                      <Copy class="h-3 w-3" />
                      Copy
                    </button>
                  </div>
                {:else}
                  <div class="break-all p-3 font-mono text-xs text-white/75">
                    {apiUrl}
                  </div>
                  <div style="box-shadow: 0 -1px 0 rgba(255,255,255,0.05);" class="flex items-center justify-end px-3 py-2">
                    <button
                      type="button"
                      onclick={() => copy(apiUrl, 'API URL')}
                      class="inline-flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium text-white/80 transition hover:bg-white/15 hover:text-white"
                    >
                      <Copy class="h-3 w-3" />
                      Copy
                    </button>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </section>
      </div>
    </aside>
  </div>
</div>

<style>
  :global(pre.shiki) {
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .editor-shell :global(*::-webkit-scrollbar) {
    width: 8px;
    height: 8px;
  }
  .editor-shell :global(*::-webkit-scrollbar-thumb) {
    background: rgba(255, 255, 255, 0.07);
    border-radius: 8px;
  }
  .editor-shell :global(*::-webkit-scrollbar-thumb:hover) {
    background: rgba(255, 255, 255, 0.15);
  }
</style>
