import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { listDirectoryEntries } from '@/lib/supabase/repositories/directories';

export const metadata = { title: 'Student Directory' };

export default async function StudentsPage() {
  const { data: entries } = await listDirectoryEntries({ type: 'student', limit: 100 });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Student Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Connect with fellow students worldwide.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Learning paths, projects, chapters, scholarships, and mentorship opportunities.</p>

      {entries.length === 0 ? (
        <Card className="mt-8 text-center">
          <p className="text-muted-foreground">No students listed yet. Be the first to add your profile.</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {entries.map((s) => (
            <Card key={s.id}>
              <h3 className="font-heading text-xl font-semibold">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.summary}</p>
              {(s.location?.city as string | undefined) && <p className="mt-1 text-sm text-muted-foreground">{String(s.location.city)}</p>}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
