import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { listDirectoryEntries } from '@/lib/supabase/repositories/directories';
import { MapPin } from 'lucide-react';

export const metadata = { title: 'Volunteer Directory' };

export default async function VolunteersPage() {
  const { data: entries } = await listDirectoryEntries({ type: 'volunteer', limit: 100 });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Volunteer Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Find volunteers making an impact.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Volunteer discovery by city, skills, availability, and causes.</p>

      {entries.length === 0 ? (
        <Card className="mt-8 text-center">
          <p className="text-muted-foreground">No volunteers listed yet. Be the first to add your profile.</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {entries.map((v) => (
            <Card key={v.id}>
              <h3 className="font-heading text-xl font-semibold">{v.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.summary}</p>
                {(v.location?.city as string | undefined) && (
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />{String(v.location.city)}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
