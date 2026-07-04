import type { ReactNode } from 'react';

export function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
      <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}
