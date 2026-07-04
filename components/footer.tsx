import Link from 'next/link';
import { moduleNavigation } from '@/lib/navigation';
import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-12 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_2fr]">
        <div>
          <p className="text-lg font-semibold">JainZBharat</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">{site.description}</p>
          <p className="mt-4 text-sm text-gold">{site.tagline}</p>
        </div>
        <nav aria-label="Platform modules" className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
          {moduleNavigation.slice(0, 12).map((item) => (
            <Link className="text-slate-400 hover:text-white" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
