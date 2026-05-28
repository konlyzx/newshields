<script lang="ts">
  import { toast } from 'svelte-sonner';
  import { Copy, Check } from '@lucide/svelte';
  import BadgeSvg from './BadgeSvg.svelte';
  import { buildBadgeMarkdown, buildBadgeUrl } from '$lib/utils/badge-url';
  import { copyToClipboard } from '$lib/utils/clipboard';
  import { cn } from '$lib/utils/style';
  import type { CatalogBadge } from '$content/badges';
  import { page } from '$app/stores';

  type Props = {
    badge: CatalogBadge;
    class?: string;
  };

  let { badge, class: className }: Props = $props();
  let copied = $state(false);
  let cardEl: HTMLButtonElement | null = $state(null);

  function handleMove(e: MouseEvent): void {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    cardEl.style.setProperty('--mx', `${x * 100}%`);
    cardEl.style.setProperty('--my', `${y * 100}%`);
  }

  const params = $derived({
    label: badge.label,
    title: badge.title,
    icon: badge.icon,
    theme: badge.theme
  });

  const origin = $derived($page.url.origin);
  const markdown = $derived(buildBadgeMarkdown(origin, params));
  const directUrl = $derived(buildBadgeUrl(origin, params));

  async function handleCopy(): Promise<void> {
    const ok = await copyToClipboard(markdown);
    if (ok) {
      copied = true;
      toast.success('Markdown copied', {
        description: `${badge.label} ${badge.title}`,
        duration: 1800
      });
      setTimeout(() => (copied = false), 1500);
    } else {
      toast.error('Could not copy to clipboard');
    }
  }
</script>

<button
  type="button"
  onclick={handleCopy}
  onmousemove={handleMove}
  bind:this={cardEl}
  class={cn(
    'group reveal relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-transparent bg-white/[0.025] p-6 text-left transition-[box-shadow,background-color,border-color] duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)] focus:outline-none focus:ring-2 focus:ring-white/20',
    className
  )}
  aria-label={`Copy markdown for ${badge.title}`}
>
  <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
  <div
    class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    style="background: radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.08), transparent 70%);"
  ></div>

  <div class="flex flex-1 items-center justify-center py-2">
    <BadgeSvg {...params} scale={0.72} class="drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-[1.04]" />
  </div>

  <div class="flex w-full items-center justify-between gap-3 border-t border-white/5 pt-3">
    <span class="truncate font-mono text-[10px] tracking-tight text-white/35">{directUrl.replace(origin, '')}</span>
    <span
      class={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors',
        copied ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white/80'
      )}
    >
      {#if copied}
        <Check class="h-3 w-3" />
        Copied
      {:else}
        <Copy class="h-3 w-3" />
        Copy MD
      {/if}
    </span>
  </div>
</button>
