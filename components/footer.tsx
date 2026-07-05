import Link from 'next/link';
import { moduleNavigation } from '@/lib/navigation';
import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-16 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_2fr]">
        <div>
          <p className="font-heading text-lg font-semibold">JainZ<span className="text-primary">Bharat</span></p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{site.description}</p>
          <p className="mt-4 text-sm text-primary">{site.tagline.split('·').map(t => t.trim()).join(' · ')}</p>
        </div>
        <nav aria-label="Platform modules" className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
          {moduleNavigation.slice(0, 12).map((item) => (
            <Link className="text-muted-foreground transition hover:text-foreground" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
