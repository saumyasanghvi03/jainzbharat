import Link from 'next/link';
import { formatJainZId } from '@/lib/jainz-id';

const signers = [
  { name: 'Aarav Shah', country: 'India', city: 'Mumbai', profession: 'Founder', sequence: 1 },
  { name: 'Mira Mehta', country: 'United States', city: 'New York', profession: 'Designer', sequence: 2 },
  { name: 'Kavya Jain', country: 'United Kingdom', city: 'London', profession: 'Student', sequence: 3 },
];

export const metadata = { title: 'Digital Signing Wall' };

export default function SigningWallPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Digital Signing Wall</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">Permanent signatures for the JainZBharat Declaration.</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {signers.map((signer) => {
          const id = formatJainZId(signer.sequence, 2026);
          return (
            <Link href={`/jainz/${id}`} className="glass rounded-3xl p-6 transition hover:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold" key={id}>
              <div className="text-xl font-semibold">{signer.name}</div>
              <div className="mt-2 text-slate-400">{signer.profession} · {signer.city}, {signer.country}</div>
              <div className="mt-4 font-mono text-sm text-gold">{id}</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
