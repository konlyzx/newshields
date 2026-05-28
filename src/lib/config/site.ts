export const site = {
  name: 'New Shields',
  shortName: 'shields',
  description:
    'A premium catalog and generator of glowing, glassmorphic tech shields for modern READMEs and portfolios.',
  url: 'https://newshields.vercel.app',
  ogImage: '/og.png',
  links: {
    github: 'https://github.com/konlyzx/newshields',
    twitter: 'https://twitter.com/newshields'
  },
  author: 'New Shields Contributors'
} as const;

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Create', href: '/create' },
  { label: 'API', href: '/docs' }
] as const;

export type SiteConfig = typeof site;
