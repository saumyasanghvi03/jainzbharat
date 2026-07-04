import Link from 'next/link';
import { formatJainZId } from '@/lib/jainz-id';
import { jainZProfileRoute } from '@/lib/navigation';

const signers = [
  { id: 1, name: 'Aarav Shah', country: 'India', city: 'Mumbai', profession: 'Founder', organization: 'Seva Labs' },
  { id: 2, name: 'Meera Jain', country: 'United States', city: 'New York', profession: 'Designer', organization: 'Open Values Studio' },
  { id: 3, name: 'Dev Mehta', country: 'Kenya', city: 'Nairobi', profession: 'Student', organization: 'Youth Chapter' },
];

export const metadata = { title: 'Digital Signing Wall' };

export default function SigningWallPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">Digital Signing Wall</p>
      <h1 className="mt-4 text-4xl font-semibold md:text-6xl">A permanent wall of values-led commitment.</h1>
      <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
        {['Newest', 'Oldest', 'Country', 'Profession', 'Organization', 'Map View', 'Grid View'].map((filter) => (
          <button className="rounded-full border border-white/10 px-4 py-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold" key={filter} type="button">
            {filter}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {signers.map((signer) => {
          const id = formatJainZId(signer.id, 2026);
          return (
            <Link href={jainZProfileRoute(id)} className="glass rounded-3xl p-6 transition hover:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold" key={id}>
              <p className="text-sm text-gold">{id}</p>
              <h2 className="mt-3 text-2xl font-semibold">{signer.name}</h2>
              <p className="mt-2 text-slate-400">{signer.profession} · {signer.organization}</p>
              <p className="mt-4 text-sm text-slate-500">{signer.city}, {signer.country}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
