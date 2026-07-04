import Link from 'next/link';
import { Card } from '@/components/card';
import { Section } from '@/components/section';
import { platformModules, site } from '@/lib/site';

const stats = [
  ['12', 'Core values'],
  ['25+', 'Production modules'],
  ['195+', 'Countries ready'],
  ['100%', 'Open to everyone'],
];

export default function Home() {
  return (
    <div className="grid-bg">
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="glass rounded-[2rem] p-8 shadow-glow md:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">{site.tagline}</p>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-tight md:text-7xl">
            The open digital civilization platform for values, contribution, and community.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{site.mission}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-full bg-white px-5 py-3 font-semibold text-black hover:bg-gold focus:outline-none focus:ring-2 focus:ring-gold" href="/declaration">
              Read Declaration
            </Link>
            <Link className="rounded-full border border-white/15 px-5 py-3 font-semibold hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold" href="/signing-wall">
              View Signing Wall
            </Link>
          </div>
        </div>
      </section>

      <Section eyebrow="Global movement" title="Built like infrastructure for contribution, learning, and service.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <Card key={label}>
              <div className="text-4xl font-semibold">{value}</div>
              <div className="mt-2 text-slate-400">{label}</div>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Ecosystem" title="Every module is designed as a real product surface, not a placeholder.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {platformModules.map((module) => (
            <Link key={module.slug} href={`/${module.slug}`} className="rounded-3xl border border-white/10 bg-white/[.035] p-6 transition hover:border-gold/60 hover:bg-white/[.06] focus:outline-none focus:ring-2 focus:ring-gold">
              <h3 className="text-xl font-semibold">{module.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{module.description}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Values" title="A product culture guided by compassion, truth, restraint, many viewpoints, discipline, service, and responsible innovation.">
        <div className="flex flex-wrap gap-3">
          {site.values.map((value) => (
            <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-gold" key={value}>{value}</span>
          ))}
        </div>
      </Section>
    </div>
  );
}
