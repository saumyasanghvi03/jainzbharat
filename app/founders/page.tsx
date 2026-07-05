import Link from 'next/link';
import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';

const founders = [
  { name: 'Aarav Shah', startup: 'EcoTech Solutions', stage: 'Series A', location: 'Mumbai, India', skills: ['AI/ML', 'Sustainability', 'Leadership'] },
  { name: 'Neha Gupta', startup: 'HealthBridge', stage: 'Seed', location: 'Bangalore, India', skills: ['HealthTech', 'Product', 'Strategy'] },
  { name: 'Vikram Patel', startup: 'EduLearn', stage: 'Pre-seed', location: 'San Francisco, USA', skills: ['EdTech', 'Full-stack', 'Growth'] },
  { name: 'Ananya Reddy', startup: 'GreenEnergy', stage: 'Series B', location: 'London, UK', skills: ['CleanTech', 'Finance', 'Operations'] },
];

export const metadata = { title: 'Founder Directory' };

export default function FoundersPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Founder Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Connect with values-aligned founders.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Verified founder profiles with startup details, stage, skills, and hiring signals.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {founders.map((f) => (
          <Card key={f.name}>
            <div className="font-heading text-xl font-semibold">{f.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{f.startup} · {f.stage}</div>
            <div className="mt-1 text-sm text-muted-foreground">{f.location}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {f.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
