'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/card';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Star, CalendarDays } from 'lucide-react';
import { getAllEntries, JOURNAL_TYPES, MOOD_OPTIONS, type LocalDiaryEntry } from '@/lib/diary';

function groupByMonth(entries: LocalDiaryEntry[]) {
  const groups: Record<string, LocalDiaryEntry[]> = {};
  for (const e of entries) {
    const month = e.entry_date.slice(0, 7);
    if (!groups[month]) groups[month] = [];
    groups[month].push(e);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

export default function DiaryTimelinePage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [entries, setEntries] = useState<LocalDiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isSignedIn) return;
    getAllEntries({ limit: 10000 }).then(({ entries }) => {
      setEntries(entries.sort((a, b) => b.entry_date.localeCompare(a.entry_date)));
      setLoading(false);
    });
  }, [isSignedIn]);

  const moodMap = Object.fromEntries(MOOD_OPTIONS.map(m => [m.value, m]));
  const jtLabels = Object.fromEntries(JOURNAL_TYPES.map(j => [j.value, { label: j.label, icon: j.icon }]));

  if (!isLoaded || !isSignedIn || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const months = groupByMonth(entries);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button onClick={() => router.push('/diary')} className="mb-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to Diary
          </button>
          <div className="flex items-center gap-3">
            <CalendarDays className="size-6 text-primary" />
            <h1 className="font-heading text-2xl font-bold">Timeline</h1>
          </div>
        </div>
        <Link href="/diary/new">
          <Button>New Entry</Button>
        </Link>
      </div>

      {entries.length === 0 ? (
        <Card className="p-12 text-center">
          <Clock className="mx-auto size-12 text-muted-foreground" />
          <h3 className="mt-4 font-heading text-lg font-semibold">No entries yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Start writing to see your timeline.</p>
          <Link href="/diary/new"><Button className="mt-4">Write Your First Entry</Button></Link>
        </Card>
      ) : (
        <div className="relative space-y-8">
          {months.map(([month, monthEntries]) => {
            const [y, m] = month.split('-');
            const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
            return (
              <div key={month}>
                <div className="sticky top-20 z-10 mb-4 flex items-center gap-3 bg-background/80 py-2 backdrop-blur-sm">
                  <div className="size-2 rounded-full bg-primary" />
                  <h2 className="font-heading text-lg font-semibold">{label}</h2>
                  <span className="text-xs text-muted-foreground">{monthEntries.length} entries</span>
                </div>
                <div className="ml-5 space-y-3 border-l border-border pl-6">
                  {monthEntries.map(entry => {
                    const mood = moodMap[entry.mood ?? ''] ?? null;
                    const jt = jtLabels[entry.journal_type] ?? null;
                    return (
                      <Link key={entry.id} href={`/diary/${entry.id}`}>
                        <Card className="relative p-4 transition hover:border-primary/40">
                          <div className="absolute -left-[29px] top-6 size-3 rounded-full border-2 border-primary bg-background" />
                          <div className="flex items-start gap-3">
                            {mood && <span className="mt-0.5">{mood.emoji}</span>}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="truncate font-medium">{entry.title}</h3>
                                {entry.is_highlight && <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />}
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span>{new Date(entry.entry_date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                {jt && <span>{jt.icon} {jt.label}</span>}
                                {entry.tags.slice(0, 2).map(t => <span key={t} className="rounded-full bg-muted px-2 py-0.5">{t}</span>)}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
