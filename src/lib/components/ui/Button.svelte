<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils/style';

  type Variant = 'primary' | 'secondary' | 'ghost' | 'glow';
  type Size = 'sm' | 'md' | 'lg';

  type Props = HTMLButtonAttributes & {
    variant?: Variant;
    size?: Size;
    children: Snippet;
  };

  let {
    variant = 'primary',
    size = 'md',
    class: className,
    children,
    ...rest
  }: Props = $props();

  const variants: Record<Variant, string> = {
    primary:
      'bg-white text-black hover:bg-white/90 ring-1 ring-white/20 shadow-[0_8px_30px_-12px_rgba(255,255,255,0.4)]',
    secondary:
      'bg-white/5 text-white hover:bg-white/10 ring-1 ring-white/10 backdrop-blur',
    ghost: 'text-white/70 hover:text-white hover:bg-white/5',
    glow: 'relative bg-gradient-to-br from-violet-500/40 to-cyan-400/30 text-white ring-1 ring-white/15 hover:from-violet-500/50 hover:to-cyan-400/40 shadow-[0_0_40px_-10px_rgba(120,120,255,0.6)]'
  };

  const sizes: Record<Size, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };
</script>

<button
  class={cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    className
  )}
  {...rest}
>
  {@render children()}
</button>
