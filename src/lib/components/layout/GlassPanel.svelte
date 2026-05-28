<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/style';

  type Props = {
    class?: string;
    intensity?: 'light' | 'strong';
    interactive?: boolean;
    children: Snippet;
  };

  let { class: className, intensity = 'light', interactive = false, children }: Props = $props();
</script>

<div
  class={cn(
    'relative overflow-hidden rounded-2xl',
    intensity === 'strong' ? 'glass-strong' : 'glass',
    interactive && 'hover-glow transition-transform duration-300 hover:-translate-y-0.5',
    className
  )}
>
  <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
  {@render children()}
</div>
