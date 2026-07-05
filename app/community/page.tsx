import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Heart, Building2, MessageSquare, MessageCircle, Rss, Shield } from 'lucide-react';

export const metadata = { title: 'Community' };

const modules = [
  { href: '/clubs', icon: Users, title: 'Clubs & Kalyanmitra', desc: 'Join or create community clubs and Kalyanmitra seva groups.', color: 'text-blue-400' },
  { href: '/organizations', icon: Building2, title: 'Organizations', desc: 'Directory of sanghs, temples, trusts, NGOs, and institutions.', color: 'text-green-400' },
  { href: '/discussions', icon: MessageSquare, title: 'Discussions', desc: 'Forum for conversations, Q&A, and knowledge sharing.', color: 'text-purple-400' },
  { href: '/chat', icon: MessageCircle, title: 'Chat', desc: 'Real-time messaging with community members.', color: 'text-orange-400' },
  { href: '/feed', icon: Rss, title: 'Feed', desc: 'Latest updates and activities across the platform.', color: 'text-yellow-400' },
  { href: '/events', icon: Shield, title: 'Events', desc: 'Global calendar of events, RSVP, and check-ins.', color: 'text-red-400' },
];

export default function CommunityPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Community Platform</Badge>
      <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-6xl">Community Platform</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Connect, collaborate, and contribute through clubs, discussions, events, and more.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map(m => {
          const Icon = m.icon;
          return (
            <Link key={m.href} href={m.href}>
              <Card className="group transition hover:border-primary/30">
                <Icon className={`size-10 ${m.color} group-hover:scale-110 transition-transform`} />
                <h3 className="mt-4 font-heading text-lg font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                <div className="mt-4">
                  <Button variant="ghost" size="sm" className="group-hover:text-primary">Explore →</Button>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="mt-8 border-primary/20 bg-primary/5 p-8 text-center">
        <Heart className="mx-auto size-8 text-primary" />
        <h2 className="mt-3 font-heading text-xl font-semibold">Welcome to JainZBharat Community</h2>
        <p className="mt-2 text-muted-foreground">This is your space to connect, learn, serve, and grow together. Every club, discussion, and event brings us closer to our shared vision.</p>
      </Card>
    </section>
  );
}
