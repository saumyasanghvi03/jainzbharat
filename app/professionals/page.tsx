import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { listDirectoryEntries } from '@/lib/supabase/repositories/directories';

export const metadata = { title: 'Professional Directory' };

export default async function ProfessionalsPage() {
  const { data: entries } = await listDirectoryEntries({ type: 'professional', limit: 100 });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Professional Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Discover skilled professionals.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Professionals organized by skills, industry, location, and service interests.</p>

      {entries.length === 0 ? (
        <Card className="mt-8 text-center">
          <p className="text-muted-foreground">No professionals listed yet. Be the first to add your profile.</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {entries.map((p) => (
            <Card key={p.id}>
              <h3 className="font-heading text-xl font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
