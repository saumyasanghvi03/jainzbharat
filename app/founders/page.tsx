import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { listDirectoryEntries } from '@/lib/supabase/repositories/directories';

export const metadata = { title: 'Founder Directory' };

export default async function FoundersPage() {
  const { data: entries } = await listDirectoryEntries({ type: 'founder', limit: 100 });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Founder Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Connect with values-aligned founders.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Verified founder profiles with startup details, stage, skills, and hiring signals.</p>

      {entries.length === 0 ? (
        <Card className="mt-8 text-center">
          <p className="text-muted-foreground">No founders listed yet. Be the first to add your profile.</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((e) => (
            <Card key={e.id}>
              <h3 className="font-heading text-xl font-semibold">{e.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{e.summary}</p>
              {(e.metadata?.stage as string | undefined) && <Badge variant="accent" className="mt-3">{String(e.metadata.stage)}</Badge>}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
