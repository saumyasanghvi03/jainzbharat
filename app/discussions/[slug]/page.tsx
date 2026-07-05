import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/card';
import { getForumCategoryBySlug, listForumTopics } from '@/lib/supabase/repositories/forums';
import { MessageSquare, Eye, ThumbsUp, Pin } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Category' };

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getForumCategoryBySlug(slug);
  if (!category) notFound();

  const { data: topics } = await listForumTopics(category.id);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">{category.name}</Badge>
      <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-6xl">{category.name}</h1>
      {category.description && <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>}

      {topics.length === 0 ? (
        <Card className="mt-8 text-center">
          <p className="text-muted-foreground">No topics yet. Be the first to start a discussion!</p>
        </Card>
      ) : (
        <div className="mt-8 space-y-3">
          {topics.map(topic => (
            <Link key={topic.id} href={`/discussions/${slug}/${topic.slug}`}>
              <Card className="group transition hover:border-primary/30">
                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-1 size-5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-heading text-base font-semibold group-hover:text-primary">{topic.title}</h3>
                      {topic.pinned && <Badge variant="accent"><Pin className="mr-1 size-3" />Pinned</Badge>}
                      {topic.solved && <Badge variant="default">Solved</Badge>}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MessageSquare className="size-3.5" />{topic.reply_count}</span>
                      <span className="flex items-center gap-1"><Eye className="size-3.5" />{topic.view_count}</span>
                      {topic.tags.length > 0 && topic.tags.map(t => <Badge key={t} variant="outline">{t}</Badge>)}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
