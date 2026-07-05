import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { listTemples } from '@/lib/supabase/repositories/temples';
import { MapPin, Shield } from 'lucide-react';

export const metadata = { title: 'Temple Directory' };

export default async function TemplesPage() {
  const { data: temples } = await listTemples({ limit: 100 });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Temple Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Discover Jain temples worldwide.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Temple profiles with maps, heritage notes, events, and accessibility information.</p>

      {temples.length === 0 ? (
        <Card className="mt-8 text-center">
          <p className="text-muted-foreground">No temples listed yet. Check back as the community grows.</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {temples.map((t) => (
            <Card key={t.id}>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-xl font-semibold">{t.name}</h3>
                    {t.verification_status === 'verified' && <Shield className="size-4 shrink-0 text-primary" />}
                  </div>
                  {(t.city || t.country) && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" />{[t.city, t.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>
              {t.deities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.deities.map((d) => <Badge key={d} variant="secondary">{d}</Badge>)}
                </div>
              )}
              {t.traditions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {t.traditions.map((tr) => <Badge key={tr} variant="outline">{tr}</Badge>)}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
