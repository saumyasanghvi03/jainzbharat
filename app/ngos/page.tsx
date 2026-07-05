import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';

const ngos = [
  { name: 'Jain International Aid', focus: 'Humanitarian', location: 'Global' },
  { name: 'Ahimsa Foundation', focus: 'Animal Welfare', location: 'India' },
  { name: 'Shiksha Seva', focus: 'Education', location: 'Rural India' },
  { name: 'Eco Dharma', focus: 'Sustainability', location: 'Global' },
];

export const metadata = { title: 'NGO Directory' };

export default function NgosPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">NGO Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Discover NGOs making a difference.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">NGO discovery for seva, education, sustainability, animal welfare, and community projects.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {ngos.map((n) => (
          <Card key={n.name}>
            <div className="font-heading text-xl font-semibold">{n.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{n.location}</div>
            <Badge variant="secondary" className="mt-3">{n.focus}</Badge>
          </Card>
        ))}
      </div>
    </section>
  );
}
