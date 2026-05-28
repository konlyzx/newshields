export type GradientStop = {
  offset: number;
  color: string;
  opacity?: number;
};

export type BadgeTheme = {
  id: string;
  name: string;
  description: string;
  surface: {
    from: string;
    to: string;
  };
  border: string;
  glow: string;
  text: {
    label: string;
    title: string;
  };
  accent: string;
  swatch: string;
};

const themes = [
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Iridescent violet to cyan, the signature look.',
    surface: { from: '#1A0B2E', to: '#0B132B' },
    border: '#7B61FF',
    glow: '#8B5CF6',
    text: { label: '#C4B5FD', title: '#FFFFFF' },
    accent: '#22D3EE',
    swatch: 'linear-gradient(135deg, #7B61FF 0%, #22D3EE 100%)'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm magenta fading into burning amber.',
    surface: { from: '#2A0A1A', to: '#1A0606' },
    border: '#F472B6',
    glow: '#EC4899',
    text: { label: '#FBCFE8', title: '#FFFFFF' },
    accent: '#FB923C',
    swatch: 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)'
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Deep emerald with soft electric mint.',
    surface: { from: '#04201A', to: '#01100B' },
    border: '#34D399',
    glow: '#10B981',
    text: { label: '#A7F3D0', title: '#FFFFFF' },
    accent: '#22C55E',
    swatch: 'linear-gradient(135deg, #10B981 0%, #84CC16 100%)'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Calm cobalt blues, terminal precision.',
    surface: { from: '#0A1428', to: '#020617' },
    border: '#60A5FA',
    glow: '#3B82F6',
    text: { label: '#BFDBFE', title: '#FFFFFF' },
    accent: '#38BDF8',
    swatch: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)'
  },
  {
    id: 'graphite',
    name: 'Graphite',
    description: 'Pure monochrome glass, a minimalist staple.',
    surface: { from: '#161618', to: '#070707' },
    border: '#52525B',
    glow: '#A1A1AA',
    text: { label: '#D4D4D8', title: '#FFFFFF' },
    accent: '#FAFAFA',
    swatch: 'linear-gradient(135deg, #27272A 0%, #A1A1AA 100%)'
  },
  {
    id: 'plasma',
    name: 'Plasma',
    description: 'Hot pink fused with electric violet.',
    surface: { from: '#1E0A2E', to: '#0F0420' },
    border: '#D946EF',
    glow: '#A855F7',
    text: { label: '#F0ABFC', title: '#FFFFFF' },
    accent: '#F472B6',
    swatch: 'linear-gradient(135deg, #D946EF 0%, #A855F7 100%)'
  },
  {
    id: 'ember',
    name: 'Ember',
    description: 'Smoldering crimson with deep ruby shadow.',
    surface: { from: '#2A0606', to: '#100202' },
    border: '#EF4444',
    glow: '#DC2626',
    text: { label: '#FECACA', title: '#FFFFFF' },
    accent: '#F87171',
    swatch: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Aquatic teals with phosphorescent foam.',
    surface: { from: '#04212A', to: '#021014' },
    border: '#14B8A6',
    glow: '#06B6D4',
    text: { label: '#99F6E4', title: '#FFFFFF' },
    accent: '#67E8F9',
    swatch: 'linear-gradient(135deg, #0EA5E9 0%, #14B8A6 100%)'
  }
] as const satisfies readonly BadgeTheme[];

export const allThemes: readonly BadgeTheme[] = themes;

export const themesById: Record<string, BadgeTheme> = Object.fromEntries(
  themes.map((t) => [t.id, t])
);

export function getTheme(id: string | null | undefined): BadgeTheme {
  if (!id) return themesById.aurora;
  return themesById[id] ?? themesById.aurora;
}

export type ThemeId = (typeof themes)[number]['id'];
