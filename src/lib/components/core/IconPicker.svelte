<script lang="ts">
  import { onMount } from 'svelte';
  import { Search, Loader2, X } from '@lucide/svelte';
  import {
    svglList,
    svglSearch,
    svglRoute,
    svglSlug,
    svglAssetUrl,
    type SvglIcon
  } from '$lib/utils/svgl';
  import { cn } from '$lib/utils/style';

  type Props = {
    value: string;
    onChange: (slug: string) => void;
  };

  let { value, onChange }: Props = $props();

  let query = $state('');
  let popular = $state<SvglIcon[]>([]);
  let results = $state<SvglIcon[]>([]);
  let loading = $state(false);
  let errored = $state(false);
  let activeCtrl: AbortController | null = null;

  onMount(async () => {
    try {
      const initial = await svglList({ limit: 48 });
      popular = initial;
    } catch {
      errored = true;
    }
  });

  // Debounced search
  let debounce: ReturnType<typeof setTimeout> | null = null;
  $effect(() => {
    const q = query.trim();
    if (debounce) clearTimeout(debounce);
    if (!q) {
      results = [];
      loading = false;
      activeCtrl?.abort();
      return;
    }
    loading = true;
    debounce = setTimeout(async () => {
      activeCtrl?.abort();
      const ctrl = new AbortController();
      activeCtrl = ctrl;
      try {
        const r = await svglSearch(q, ctrl.signal);
        if (!ctrl.signal.aborted) {
          results = r.slice(0, 80);
        }
      } catch {
        if (!ctrl.signal.aborted) results = [];
      } finally {
        if (!ctrl.signal.aborted) loading = false;
      }
    }, 220);
  });

  const displayed = $derived(query.trim() ? results : popular);

  function pick(icon: SvglIcon): void {
    onChange(svglSlug(icon));
  }
</script>

<div class="flex flex-col gap-2.5">
  <div class="flex items-center justify-between">
    <span class="text-xs font-medium uppercase tracking-wider text-white/50">Icon</span>
    <span class="font-mono text-[10px] uppercase tracking-widest text-white/35">
      via <a href="https://svgl.app" target="_blank" rel="noopener noreferrer" class="underline-offset-2 hover:text-white hover:underline">SVGL</a>
    </span>
  </div>

  <!-- Search input -->
  <div class="relative">
    <Search class="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
    <input
      type="search"
      placeholder="Search 500+ brand icons…"
      bind:value={query}
      class="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-9 pr-9 text-sm text-white placeholder:text-white/30 transition-all focus:border-white/30 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-white/10"
    />
    {#if query}
      <button
        type="button"
        onclick={() => (query = '')}
        class="absolute right-2.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-white/40 transition hover:bg-white/5 hover:text-white"
        aria-label="Clear search"
      >
        <X class="h-3.5 w-3.5" />
      </button>
    {/if}
  </div>

  <!-- Current selection chip -->
  <div class="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
    <div class="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/10">
      <img
        src={svglAssetUrl(value)}
        alt=""
        loading="lazy"
        class="h-4 w-4 object-contain"
        onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
      />
    </div>
    <div class="flex min-w-0 flex-1 flex-col leading-tight">
      <span class="truncate text-xs font-medium text-white">Current</span>
      <span class="truncate font-mono text-[10px] text-white/40">{value}</span>
    </div>
    <span class="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/50">selected</span>
  </div>

  <!-- Grid of icons -->
  <div class="relative max-h-72 overflow-y-auto rounded-lg border border-white/10 bg-black/20 p-2" data-lenis-prevent>
    {#if loading}
      <div class="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[10px] uppercase tracking-widest text-white/60">
        <Loader2 class="h-3 w-3 animate-spin" />
        Searching
      </div>
    {/if}

    {#if errored && !displayed.length}
      <p class="px-2 py-6 text-center text-xs text-white/40">
        Couldn't reach the SVGL API. Check your connection and try again.
      </p>
    {:else if !displayed.length && query}
      <p class="px-2 py-6 text-center text-xs text-white/40">No icons match "{query}".</p>
    {:else if !displayed.length}
      <p class="px-2 py-6 text-center text-xs text-white/40">Loading popular icons…</p>
    {:else}
      <div class="grid grid-cols-6 gap-1.5">
        {#each displayed as icon (icon.id)}
          {@const slug = svglSlug(icon)}
          {@const url = svglRoute(icon, 'dark')}
          <button
            type="button"
            onclick={() => pick(icon)}
            title={icon.title}
            aria-label={`Use ${icon.title}`}
            class={cn(
              'group relative flex aspect-square items-center justify-center rounded-md border border-transparent bg-white/[0.02] p-2 transition-all hover:border-white/15 hover:bg-white/[0.05]',
              value === slug && 'border-white/30 bg-white/10 ring-1 ring-white/20'
            )}
          >
            <img src={url} alt={icon.title} loading="lazy" class="h-6 w-6 object-contain" />
            <span class="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full whitespace-nowrap rounded bg-black/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white opacity-0 transition-opacity group-hover:opacity-100">
              {icon.title}
            </span>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <span class="text-[11px] text-white/35">
    Brand SVGs are rendered fresh on the edge — original colors preserved.
  </span>
</div>
