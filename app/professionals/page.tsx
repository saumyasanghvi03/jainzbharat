import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';

const professionals = [
  { name: 'Anika Patel', role: 'Product Manager', company: 'Google', skills: ['Product', 'Strategy', 'AI'] },
  { name: 'Vivek Sharma', role: 'Software Engineer', company: 'Microsoft', skills: ['Full-stack', 'Cloud', 'DevOps'] },
  { name: 'Neha Gupta', role: 'Design Lead', company: 'Apple', skills: ['UI/UX', 'Design Systems', 'Research'] },
];

export const metadata = { title: 'Professional Directory' };

export default function ProfessionalsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Professional Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Discover skilled professionals.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Professionals organized by skills, industry, location, and service interests.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {professionals.map((p) => (
          <Card key={p.name}>
            <div className="font-heading text-xl font-semibold">{p.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{p.role} at {p.company}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
