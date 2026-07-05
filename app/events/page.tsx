import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';

const events = [
  { title: 'Global Jain Youth Summit', date: 'Aug 15, 2026', location: 'Mumbai, India', type: 'Conference', capacity: 500 },
  { title: 'Ahimsa Hackathon', date: 'Sep 5, 2026', location: 'Bangalore, India', type: 'Hackathon', capacity: 200 },
  { title: 'Meditation Retreat', date: 'Oct 10, 2026', location: 'Rishikesh, India', type: 'Retreat', capacity: 100 },
  { title: 'Founder Meetup', date: 'Nov 20, 2026', location: 'San Francisco, USA', type: 'Networking', capacity: 150 },
];

export const metadata = { title: 'Global Calendar' };

export default function EventsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Global Calendar</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Discover events and gatherings worldwide.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">RSVP, check in with QR codes, earn attendance certificates, and connect with the community.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {events.map((e) => (
          <Card key={e.title} className="relative">
            <div className="absolute -top-2.5 right-4">
              <span className="rounded-full border border-primary/30 bg-background px-3 py-1 text-xs font-semibold text-primary">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="accent">{e.type}</Badge>
              <span className="text-xs text-muted-foreground">{e.capacity} seats</span>
            </div>
            <div className="mt-3 font-heading text-xl font-semibold">{e.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{e.date} · {e.location}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
