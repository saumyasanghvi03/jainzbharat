import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { listDirectoryEntries } from '@/lib/supabase/repositories/directories';

export const metadata = { title: 'Mentor Directory' };

export default async function MentorsPage() {
  const { data: entries } = await listDirectoryEntries({ type: 'mentor', limit: 100 });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Mentor Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Learn from experienced mentors.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Mentor profiles for students, professionals, founders, and community builders.</p>

      {entries.length === 0 ? (
        <Card className="mt-8 text-center">
          <p className="text-muted-foreground">No mentors listed yet. Be the first to add your profile.</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {entries.map((m) => (
            <Card key={m.id}>
              <h3 className="font-heading text-xl font-semibold">{m.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.summary}</p>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
