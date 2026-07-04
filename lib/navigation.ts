import type { Route } from 'next';
import { platformModules } from '@/lib/site';

export type NavigationItem = Readonly<{
  href: Route;
  label: string;
}>;

export const routes = {
  home: '/' as Route,
  about: '/about' as Route,
  declaration: '/declaration' as Route,
  signingWall: '/signing-wall' as Route,
  dashboard: '/dashboard' as Route,
  events: '/events' as Route,
  map: '/map' as Route,
} as const;

export function jainZProfileRoute(id: string): Route {
  return `/jainz/${id}` as Route;
}

export const navigation = [
  { href: routes.home, label: 'Home' },
  { href: routes.about, label: 'About' },
  { href: routes.declaration, label: 'Declaration' },
  { href: routes.signingWall, label: 'Signing Wall' },
  { href: routes.events, label: 'Events' },
  { href: routes.map, label: 'Map' },
] as const satisfies readonly NavigationItem[];

export const moduleNavigation = platformModules.map((module) => ({
  href: module.href,
  label: module.title,
})) satisfies NavigationItem[];
