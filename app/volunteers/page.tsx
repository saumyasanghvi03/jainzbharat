import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';

const volunteers = [
  { name: 'Sneha Reddy', city: 'Bangalore', skills: ['Teaching', 'Event Management'], hours: 120 },
  { name: 'Amit Kumar', city: 'Mumbai', skills: ['Tech', 'Mentoring'], hours: 85 },
  { name: 'Pooja Jain', city: 'Delhi', skills: ['Healthcare', 'Counseling'], hours: 200 },
];

export const metadata = { title: 'Volunteer Directory' };

export default function VolunteersPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Volunteer Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Find volunteers making an impact.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Volunteer discovery by city, skills, availability, and causes.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {volunteers.map((v) => (
          <Card key={v.name}>
            <div className="font-heading text-xl font-semibold">{v.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{v.city}</div>
            <div className="mt-1 text-sm text-primary">{v.hours}+ hours volunteered</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {v.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
