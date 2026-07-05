'use client';

import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowUp, Printer, Copy, Check, Clock } from 'lucide-react';

interface LegalPageProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  version: string;
  children: React.ReactNode;
}

function TableOfContents({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );
    const headings = document.querySelectorAll('h2[id], h3[id]');
    headings.forEach((h) => observerRef.current?.observe(h));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <nav className="sticky top-28 hidden lg:block">
      <h3 className="mb-3 text-sm font-semibold text-foreground">On this page</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {children}
      </ul>
    </nav>
  );
}

function TocLink({ href, children, depth = 0 }: { href: string; children: React.ReactNode; depth?: number }) {
  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id);
        }
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );
    const el = document.querySelector(href);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [href]);

  return (
    <li>
      <a
        href={href}
        className={`block rounded-lg px-3 py-1.5 transition hover:text-foreground ${activeId === href.slice(1) ? 'bg-primary/10 text-primary font-medium' : ''}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {children}
      </a>
    </li>
  );
}

function SectionLink({ id, title }: { id: string; title: string }) {
  return (
    <a href={`#${id}`} className="text-primary hover:underline">
      {title}
    </a>
  );
}

export function LegalPage({ title, subtitle, lastUpdated, version, children }: LegalPageProps) {
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => window.print();

  const headings: { id: string; title: string; depth: number }[] = [];
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const hs = contentRef.current.querySelectorAll('h2[id], h3[id]');
    hs.forEach((h) => {
      headings.push({ id: h.id, title: h.textContent ?? '', depth: h.tagName === 'H3' ? 1 : 0 });
    });
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="lg:grid lg:grid-cols-[1fr_3fr_1fr] lg:gap-8">
        <aside className="hidden lg:block">
          <TableOfContents>
            {headings.map((h) => (
              <TocLink key={h.id} href={`#${h.id}`} depth={h.depth}>
                {h.title}
              </TocLink>
            ))}
          </TableOfContents>
        </aside>

        <article ref={contentRef} className="min-w-0">
          <div className="mb-8">
            <Badge variant="default">Legal</Badge>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="size-4" /> Last updated: {lastUpdated}</span>
              <Badge variant="outline">v{version}</Badge>
            </div>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search in this page..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            {children}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-6">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              {copied ? <Check className="mr-1.5 size-4" /> : <Copy className="mr-1.5 size-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-1.5 size-4" /> Print
            </Button>
            <span className="ml-auto text-xs text-muted-foreground">Version {version} · {lastUpdated}</span>
          </div>
        </article>

        <aside className="hidden lg:block" />
      </div>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-40 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:bg-primary/90"
          aria-label="Back to top"
        >
          <ArrowUp className="size-5" />
        </button>
      )}
    </section>
  );
}
