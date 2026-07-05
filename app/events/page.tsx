import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { listEventSubmissions } from '@/lib/supabase/repositories/event_submissions';
import { CalendarDays, MapPin, Users } from 'lucide-react';

export const metadata = { title: 'Global Calendar' };

export default async function EventsPage() {
  const { data: events } = await listEventSubmissions({ status: 'published', limit: 50 });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Global Calendar</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Discover events and gatherings worldwide.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">RSVP, check in with QR codes, earn attendance certificates, and connect with the community.</p>

      {events.length === 0 ? (
        <Card className="mt-8 text-center">
          <CalendarDays className="mx-auto size-12 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">No upcoming events right now. Check back soon or submit your own event!</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {events.map((e) => (
            <Card key={e.id} className="relative">
              <div className="flex items-center justify-between">
                <Badge variant="accent">{e.category}</Badge>
                {e.capacity && <span className="text-xs text-muted-foreground"><Users className="mr-1 inline size-3.5" />{e.capacity} seats</span>}
              </div>
              <div className="mt-3 font-heading text-xl font-semibold">{e.title}</div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CalendarDays className="size-3.5" />{new Date(e.starts_at).toLocaleDateString()}</span>
                {e.venue && <span className="flex items-center gap-1"><MapPin className="size-3.5" />{e.venue}</span>}
              </div>
              {e.registration_link && (
                <a href={e.registration_link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                  Register →
                </a>
              )}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
