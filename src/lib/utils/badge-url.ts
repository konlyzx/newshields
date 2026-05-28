import { BADGE_LIMITS } from '$lib/config/badge';

export type BadgeParams = {
  label: string;
  title: string;
  icon: string;
  theme: string;
};

export function buildBadgeUrl(origin: string, params: BadgeParams): string {
  const u = new URL('/api/badge.svg', origin);
  u.searchParams.set('label', params.label);
  u.searchParams.set('title', params.title);
  u.searchParams.set('icon', params.icon);
  u.searchParams.set('theme', params.theme);
  return u.toString();
}

export function buildBadgeMarkdown(origin: string, params: BadgeParams): string {
  const url = buildBadgeUrl(origin, params);
  return `[![${params.label} ${params.title}](${url})](${origin})`;
}

export function withDefaults(partial: Partial<BadgeParams>): BadgeParams {
  return {
    label: partial.label || BADGE_LIMITS.defaultLabel,
    title: partial.title || BADGE_LIMITS.defaultTitle,
    icon: partial.icon || BADGE_LIMITS.defaultIcon,
    theme: partial.theme || BADGE_LIMITS.defaultTheme
  };
}
