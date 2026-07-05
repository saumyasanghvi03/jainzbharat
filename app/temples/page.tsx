import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';

const temples = [
  { name: 'Shree Mahavir Swami Jain Temple', city: 'Mumbai, India', heritage: '18th Century' },
  { name: 'Jain Temple, Ranakpur', city: 'Ranakpur, India', heritage: '15th Century' },
  { name: 'Stanley Jain Temple', city: 'Leicester, UK', heritage: 'Modern' },
  { name: 'Jain Center of Southern California', city: 'Los Angeles, USA', heritage: '20th Century' },
];

export const metadata = { title: 'Temple Directory' };

export default function TemplesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Temple Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Discover Jain temples worldwide.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Temple profiles with maps, heritage notes, events, and accessibility information.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {temples.map((t) => (
          <Card key={t.name}>
            <div className="font-heading text-xl font-semibold">{t.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{t.city}</div>
            <Badge variant="accent" className="mt-3">{t.heritage}</Badge>
          </Card>
        ))}
      </div>
    </section>
  );
}
