export const BADGE_DIMENSIONS = {
  width: 360,
  height: 92,
  padding: 22,
  iconSize: 36,
  borderRadius: 18
} as const;

export const COMPACT_BADGE_DIMENSIONS = {
  width: 180,
  height: 56,
  padding: 12,
  iconSize: 20,
  borderRadius: 10
} as const;

export const BADGE_LIMITS = {
  labelMaxLength: 28,
  titleMaxLength: 36,
  defaultLabel: 'Powered by',
  defaultTitle: 'New Shields',
  defaultIcon: 'svelte',
  defaultTheme: 'aurora'
} as const;
