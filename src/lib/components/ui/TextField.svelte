<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils/style';

  type Props = HTMLInputAttributes & {
    label?: string;
    hint?: string;
    error?: string;
    value: string;
  };

  let {
    label,
    hint,
    error,
    value = $bindable(''),
    class: className,
    id,
    ...rest
  }: Props = $props();

  const fieldId = $derived(id ?? `field-${Math.random().toString(36).slice(2, 8)}`);
</script>

<div class="flex flex-col gap-1.5">
  {#if label}
    <label for={fieldId} class="text-xs font-medium uppercase tracking-wider text-white/50">
      {label}
    </label>
  {/if}
  <input
    id={fieldId}
    bind:value
    class={cn(
      'h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 text-sm text-white placeholder:text-white/30 transition-all',
      'focus:border-white/30 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-white/10',
      error && 'border-red-500/50 focus:border-red-500/70',
      className
    )}
    {...rest}
  />
  {#if hint && !error}
    <span class="text-[11px] text-white/35">{hint}</span>
  {/if}
  {#if error}
    <span class="text-[11px] text-red-400">{error}</span>
  {/if}
</div>
