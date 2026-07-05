import { platformModules } from '@/lib/site';

export const navigation = [
  { href: '/', label: 'Home' },
  { href: '/declaration', label: 'Declaration' },
  { href: '/signing-wall', label: 'Signing Wall' },
  { href: '/diary', label: 'Diary' },
  { href: '/events', label: 'Events' },
  { href: '/clubs', label: 'Clubs' },
  { href: '/discussions', label: 'Discussions' },
  { href: '/chat', label: 'Chat' },
] as const;

export const moduleNavigation = platformModules.map((module) => ({
  href: `/${module.slug}`,
  label: module.title,
}));
