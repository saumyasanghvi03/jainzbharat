import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';

const sanghs = [
  { name: 'Jain Society of North America', city: 'New York, USA', committees: 12, verified: true },
  { name: 'Mumbai Jain Sangh', city: 'Mumbai, India', committees: 8, verified: true },
  { name: 'London Jain Centre', city: 'London, UK', committees: 6, verified: true },
  { name: 'Bangalore Jain Samaj', city: 'Bangalore, India', committees: 5, verified: true },
];

export const metadata = { title: 'Sangh Directory' };

export default function SanghsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Sangh Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Verified Sangh listings worldwide.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Find verified Sangh records with contact details, committees, youth wings, and events.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sanghs.map((s) => (
          <Card key={s.name}>
            <div className="flex items-center gap-2">
              <div className="font-heading text-xl font-semibold">{s.name}</div>
              {s.verified && <Badge variant="default">Verified</Badge>}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{s.city}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.committees} committees</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
