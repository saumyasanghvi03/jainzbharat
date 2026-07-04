import { notFound } from 'next/navigation';
import { parseJainZId } from '@/lib/jainz-id';

export default async function JainZProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = parseJainZId(id);

  if (!parsed) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <div className="glass rounded-[2rem] p-8">
        <p className="font-mono text-gold">{id}</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-6xl">Public JainZ ID Profile</h1>
        <p className="mt-4 leading-7 text-slate-300">Permanent identity record with declaration version, contribution score, certificates, badges, volunteer hours, and Navkar count.</p>
        <dl className="mt-8 grid gap-4 md:grid-cols-3">
          <div><dt className="text-slate-400">Year</dt><dd className="text-2xl">{parsed.year}</dd></div>
          <div><dt className="text-slate-400">Sequence</dt><dd className="text-2xl">{parsed.sequence}</dd></div>
          <div><dt className="text-slate-400">Declaration</dt><dd className="text-2xl">v1.0</dd></div>
        </dl>
      </div>
    </section>
  );
}
