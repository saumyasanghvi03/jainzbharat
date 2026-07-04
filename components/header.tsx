import Link from 'next/link';
import { navigation, routes } from '@/lib/navigation';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/85 backdrop-blur-xl">
      <a className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4" href="#main-content">
        Skip to content
      </a>
      <nav aria-label="Primary" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link aria-label="JainZBharat home" href={routes.home} className="text-lg font-semibold tracking-tight">
          JainZ<span className="text-gold">Bharat</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold">
              {item.label}
            </Link>
          ))}
        </div>
        <Link href={routes.dashboard} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gold focus:outline-none focus:ring-2 focus:ring-gold">
          Join open beta
        </Link>
      </nav>
    </header>
  );
}
