import type { IconId } from './icons';
import type { ThemeId } from './themes';

export type CatalogBadge = {
  id: string;
  label: string;
  title: string;
  icon: IconId;
  theme: ThemeId;
  span?: 'wide' | 'tall' | 'normal';
  featured?: boolean;
};

const badges = [
  { id: 'powered-svelte', label: 'Powered by', title: 'Svelte 5', icon: 'svelte', theme: 'sunset', span: 'wide', featured: true },
  { id: 'built-react', label: 'Built with', title: 'React', icon: 'react_dark', theme: 'ocean' },
  { id: 'made-with-ts', label: 'Made with', title: 'TypeScript', icon: 'typescript', theme: 'midnight' },
  { id: 'powered-cloudflare', label: 'Deployed on', title: 'Cloudflare', icon: 'cloudflare', theme: 'ember', span: 'normal' },
  { id: 'edge-vercel', label: 'Deployed on', title: 'Vercel', icon: 'vercel_dark', theme: 'graphite' },
  { id: 'open-source', label: 'Open Source', title: 'GitHub', icon: 'github', theme: 'graphite', span: 'tall' },
  { id: 'built-rust', label: 'Built in', title: 'Rust', icon: 'rust', theme: 'ember' },
  { id: 'powered-go', label: 'Built in', title: 'Go', icon: 'go', theme: 'ocean' },
  { id: 'powered-python', label: 'Built in', title: 'Python', icon: 'python', theme: 'forest' },
  { id: 'styled-tailwind', label: 'Styled with', title: 'Tailwind', icon: 'tailwindcss', theme: 'aurora', span: 'wide' },
  { id: 'node-runtime', label: 'Runs on', title: 'Node.js', icon: 'nodejs', theme: 'forest' },
  { id: 'js-anywhere', label: 'Powered by', title: 'JavaScript', icon: 'javascript', theme: 'sunset' },
  { id: 'containerized', label: 'Containerized', title: 'Docker', icon: 'docker', theme: 'forest' },
  { id: 'storage-db', label: 'Persisted in', title: 'Database', icon: 'database', theme: 'plasma' },
  { id: 'lightning-fast', label: 'Optimized for', title: 'Edge Speed', icon: 'lightning', theme: 'aurora', featured: true }
] as const satisfies readonly CatalogBadge[];

export const allBadges: readonly CatalogBadge[] = badges;

export function getBadgeById(id: string): CatalogBadge | undefined {
  return badges.find((b) => b.id === id);
}

export type CatalogBadgeId = (typeof badges)[number]['id'];
