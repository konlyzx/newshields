<script lang="ts" generics="T extends string">
  import { Select } from 'bits-ui';
  import { ChevronDown, Check } from '@lucide/svelte';
  import { cn } from '$lib/utils/style';

  type Option = { value: T; label: string; description?: string };

  type Props = {
    label?: string;
    value: T;
    options: ReadonlyArray<Option>;
    placeholder?: string;
    onChange: (value: T) => void;
  };

  let { label, value = $bindable(), options, placeholder = 'Select', onChange }: Props = $props();

  const selected = $derived(options.find((o) => o.value === value));
</script>

<div class="flex flex-col gap-1.5">
  {#if label}
    <span class="text-xs font-medium uppercase tracking-wider text-white/50">{label}</span>
  {/if}
  <Select.Root
    type="single"
    value={value}
    onValueChange={(v) => {
      if (v) {
        value = v as T;
        onChange(v as T);
      }
    }}
  >
    <Select.Trigger
      class={cn(
        'group flex h-11 w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3.5 text-left text-sm text-white transition-all',
        'hover:bg-white/[0.05] focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10'
      )}
    >
      <span class="truncate">
        {selected?.label ?? placeholder}
      </span>
      <ChevronDown class="h-4 w-4 text-white/40 transition-transform group-data-[state=open]:rotate-180" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        sideOffset={6}
        class="z-50 max-h-72 w-[var(--bits-select-anchor-width)] overflow-y-auto rounded-lg border border-white/10 bg-ink-800/95 p-1 shadow-2xl backdrop-blur-2xl"
      >
        {#each options as opt (opt.value)}
          <Select.Item
            value={opt.value}
            class="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-white/80 outline-none transition-colors data-[highlighted]:bg-white/10 data-[highlighted]:text-white data-[state=checked]:text-white"
          >
            <div class="flex flex-col">
              <span class="font-medium">{opt.label}</span>
              {#if opt.description}
                <span class="text-[11px] text-white/40">{opt.description}</span>
              {/if}
            </div>
            {#if value === opt.value}
              <Check class="h-3.5 w-3.5 text-emerald-400" />
            {/if}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Portal>
  </Select.Root>
</div>
