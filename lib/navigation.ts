import { platformModules } from '@/lib/site';

export const navigation = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/declaration', label: 'Declaration' },
  { href: '/signing-wall', label: 'Signing Wall' },
  { href: '/events', label: 'Events' },
  { href: '/map', label: 'Map' },
] as const;

export const moduleNavigation = platformModules.map((module) => ({
  href: `/${module.slug}`,
  label: module.title,
}));
