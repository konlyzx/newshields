<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { ArrowUpRight } from '@lucide/svelte';
  import { navigation, site } from '$lib/config/site';
  import { cn } from '$lib/utils/style';
  import { fetchGitHubStars, formatStars } from '$lib/utils/github-stars';

  const currentPath = $derived($page.url.pathname);
  let starCount = $state(0);

  onMount(() => {
    fetchGitHubStars().then((n) => (starCount = n));
  });
</script>

<header class="pointer-events-none fixed inset-x-0 top-0 z-50">
  <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-950/80 via-ink-950/40 to-transparent backdrop-blur-[2px]"></div>

  <div class="pointer-events-auto relative mx-auto flex max-w-[1400px] items-center justify-between px-6 pt-5">
    <a href="/" class="group flex items-center gap-3">
      <span class="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/50 via-fuchsia-500/30 to-cyan-400/40 ring-1 ring-white/15">
        <span class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]"></span>
        <span class="relative font-display text-base uppercase leading-none text-white">S</span>
      </span>
      <div class="flex flex-col leading-none">
        <span class="font-display text-base uppercase tracking-wide text-white">{site.name}</span>
        <span class="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">shields · edge</span>
      </div>
    </a>

    <nav class="hidden items-center gap-1 rounded-full bg-white/[0.04] p-1.5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl md:flex">
      {#each navigation as item (item.href)}
        {@const active = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href.split('#')[0]) && item.href.startsWith(currentPath))}
        <a
          href={item.href}
          class={cn(
            'inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all',
            active ? 'bg-white text-black shadow-sm' : 'text-white/70 hover:bg-white/10 hover:text-white'
          )}
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-2">
      <a
        href={site.links.github}
        target="_blank"
        rel="noopener noreferrer"
        class="snake-border group inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/85 backdrop-blur-xl transition hover:bg-white/10"
      >
        <svg viewBox="0 0 16 16" class="h-3.5 w-3.5 fill-current" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2 1.02A7.66 7.66 0 0 1 8 4.07c.68 0 1.36.09 2 .27 1.53-1.04 2.2-1.02 2.2-1.02.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
        <span class="hidden sm:inline">Star on GitHub</span>
        {#if starCount > 0}
          <span class="font-mono text-[10px] text-white/50">{formatStars(starCount)}</span>
        {/if}
        <ArrowUpRight class="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </div>
  </div>
</header>
