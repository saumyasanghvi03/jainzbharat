import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';

const mentors = [
  { name: 'Dr. Rakesh Jain', expertise: 'AI Research', availability: 'Weekly', mentees: 5 },
  { name: 'Sara Mehta', expertise: 'Product Strategy', availability: 'Bi-weekly', mentees: 3 },
  { name: 'Prof. Amit Shah', expertise: 'Entrepreneurship', availability: 'Monthly', mentees: 8 },
];

export const metadata = { title: 'Mentor Directory' };

export default function MentorsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Mentor Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Learn from experienced mentors.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Mentor profiles for students, professionals, founders, and community builders.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {mentors.map((m) => (
          <Card key={m.name}>
            <div className="font-heading text-xl font-semibold">{m.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{m.expertise}</div>
            <div className="mt-2 text-sm"><span className="text-primary">{m.availability}</span> · {m.mentees} mentees</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
