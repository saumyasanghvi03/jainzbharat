import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { listSanghs } from '@/lib/supabase/repositories/sanghs';
import { MapPin } from 'lucide-react';

export const metadata = { title: 'Sangh Directory' };

export default async function SanghsPage() {
  const { data: sanghs } = await listSanghs({ limit: 100 });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Sangh Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Verified Sangh listings worldwide.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Find verified Sangh records with contact details, committees, youth wings, and events.</p>

      {sanghs.length === 0 ? (
        <Card className="mt-8 text-center">
          <p className="text-muted-foreground">No Sanghs listed yet. Check back as the community grows.</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sanghs.map((s) => (
            <Card key={s.id}>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-xl font-semibold">{s.name}</h3>
                {s.verification_status === 'verified' && <Badge variant="default">Verified</Badge>}
              </div>
              {(s.city || s.country) && (
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />{[s.city, s.country].filter(Boolean).join(', ')}
                </p>
              )}
              {s.member_count > 0 && <p className="mt-1 text-sm text-muted-foreground">{s.member_count} members</p>}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
