import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/card';
import { listForumCategories } from '@/lib/supabase/repositories/forums';
import { MessageSquare, Pin } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Discussions' };

export default async function DiscussionsPage() {
  const categories = await listForumCategories();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Discussions</Badge>
      <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-6xl">Community Discussions</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Ask questions, share knowledge, and connect with the community through threaded conversations.</p>

      {categories.length === 0 ? (
        <Card className="mt-8 text-center">
          <p className="text-muted-foreground">No discussion categories yet. Check back soon!</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {categories.map(cat => (
            <Link key={cat.id} href={`/discussions/${cat.slug}`}>
              <Card className="group transition hover:border-primary/30">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10">
                    <MessageSquare className="size-6 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold group-hover:text-primary">{cat.name}</h3>
                    {cat.description && <p className="mt-0.5 text-sm text-muted-foreground">{cat.description}</p>}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Card className="mt-8 text-center">
        <p className="text-muted-foreground">Discussions will be fully interactive once community members start posting. Stay tuned!</p>
      </Card>
    </section>
  );
}
