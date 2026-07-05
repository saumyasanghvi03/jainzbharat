import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/card';
import { listFeeds } from '@/lib/supabase/repositories/feeds';
import { Calendar, MessageSquare, Heart, Users, Megaphone } from 'lucide-react';

export const metadata = { title: 'Community Feed' };

const feedIcons: Record<string, typeof Megaphone> = {
  announcement: Megaphone, post: MessageSquare, event: Calendar,
  volunteer: Heart, club: Users, discussion: MessageSquare,
};

const feedLabels: Record<string, string> = {
  announcement: 'Announcement', post: 'Post', event: 'Event',
  volunteer: 'Volunteer', club: 'Club', discussion: 'Discussion',
};

export default async function FeedPage() {
  const { data: feeds } = await listFeeds({ limit: 50 });

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <Badge variant="default">Community Feed</Badge>
      <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-6xl">Community Feed</h1>
      <p className="mt-2 text-muted-foreground">Latest updates, announcements, and activities from across the platform.</p>

      {feeds.length === 0 ? (
        <Card className="mt-8 text-center">
          <p className="text-muted-foreground">No feed items yet. Activity will appear here as the community grows.</p>
        </Card>
      ) : (
        <div className="mt-8 space-y-4">
          {feeds.map(item => {
            const Icon = feedIcons[item.feed_type] ?? MessageSquare;
            return (
              <Card key={item.id}>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="size-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{feedLabels[item.feed_type] ?? item.feed_type}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="mt-1 font-heading text-base font-semibold">{item.title}</h3>
                    {item.content && <p className="mt-1 text-sm text-muted-foreground">{item.content}</p>}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-primary hover:underline">
                        Read more →
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
