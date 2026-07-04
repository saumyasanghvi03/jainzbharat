import { Section } from '@/components/section';
import { declarationVersions } from '@/lib/declaration';

export const metadata = { title: 'Declaration' };

export default function DeclarationPage() {
  const current = declarationVersions[0];

  return (
    <>
      <Section eyebrow="Declaration" title="A permanent, versioned pledge for ethical collaboration and open service.">
        <article className="glass rounded-[2rem] p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gold px-3 py-1 text-sm font-semibold text-black">Current {current.version}</span>
            <time className="text-slate-400" dateTime={current.publishedAt}>Archived July 4, 2026</time>
          </div>
          <p className="mt-6 text-lg leading-8 text-slate-200">{current.vision}</p>
          <p className="mt-4 leading-7 text-slate-300">{current.mission}</p>
          <h2 className="mt-8 text-2xl font-semibold">Principles</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {current.principles.map((principle) => <li className="rounded-2xl bg-white/5 p-4" key={principle}>{principle}</li>)}
          </ul>
          <h2 className="mt-8 text-2xl font-semibold">Commitments</h2>
          <ul className="mt-4 space-y-3">
            {current.commitments.map((commitment) => <li className="border-l-2 border-gold pl-4" key={commitment}>{commitment}</li>)}
          </ul>
          <h2 className="mt-8 text-2xl font-semibold">Pledge</h2>
          <p className="mt-3 leading-7 text-slate-300">I commit to practice compassion, truth, restraint, learning, and service while helping build an open platform that protects dignity and welcomes everyone.</p>
        </article>
      </Section>
      <Section eyebrow="Version history" title="Every declaration version remains permanently archived and comparable.">
        <div className="space-y-3">
          {declarationVersions.map((version) => (
            <div className="glass rounded-2xl p-5" key={version.version}>
              <b>{version.version}</b>
              <span className="ml-3 text-slate-400">{version.status}</span>
              <p className="mt-2 text-slate-300">{version.vision}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
