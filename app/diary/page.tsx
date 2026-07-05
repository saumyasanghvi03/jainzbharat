'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/card';
import { useToast } from '@/components/ui/toast';
import { useEffect, useState, useCallback } from 'react';
import {
  Plus, Search, Lock, Unlock, BookOpen, Settings,
  Heart, Brain, Moon, Sun, Sparkles,
  TrendingUp, Flame, FileText, Trash2, Star,
  Clock, Loader2, PenLine, CalendarDays,
} from 'lucide-react';
import {
  getAllEntries, getHeatmapData, getStats, softDeleteEntry,
  type LocalDiaryEntry, type DiaryHeatmapDay, JOURNAL_TYPES, MOOD_OPTIONS,
} from '@/lib/diary';

export default function DiaryPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [entries, setEntries] = useState<LocalDiaryEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [heatmap, setHeatmap] = useState<DiaryHeatmapDay[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [highlightsCount, setHighlightsCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pinLocked, setPinLocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showSetPin, setShowSetPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [savingPin, setSavingPin] = useState(false);
  const [filteredByDate, setFilteredByDate] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [entriesData, heatmapData, statsData] = await Promise.all([
      getAllEntries({ query, journalType: typeFilter || undefined, offset: page * 30 }),
      getHeatmapData(),
      getStats(),
    ]);
    setEntries(entriesData.entries);
    setTotal(entriesData.total);
    setHeatmap(heatmapData);
    setTotalEntries(statsData.total);
    setCurrentStreak(statsData.currentStreak);
    setBestStreak(statsData.bestStreak);
    setHighlightsCount(statsData.highlights);
    setLoading(false);
  }, [query, typeFilter, page]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isSignedIn || !isLoaded) return;
    const hasPin = localStorage.getItem('jainz_diary_pin');
    if (!hasPin) setPinLocked(false);
    else loadData();
  }, [isSignedIn, isLoaded, loadData]);

  useEffect(() => {
    if (!pinLocked) loadData();
  }, [pinLocked, loadData]);

  const handlePinUnlock = () => {
    const storedPin = localStorage.getItem('jainz_diary_pin');
    if (pinInput === storedPin) {
      setPinLocked(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Incorrect PIN');
    }
  };

  const handleSetPin = () => {
    if (newPin.length < 4) { setPinError('PIN must be at least 4 characters'); return; }
    if (newPin !== confirmPin) { setPinError('PINs do not match'); return; }
    localStorage.setItem('jainz_diary_pin', newPin);
    setShowSetPin(false);
    setNewPin('');
    setConfirmPin('');
    setPinLocked(false);
    toast('Diary PIN set', 'success');
  };

  const handleRemovePin = () => {
    localStorage.removeItem('jainz_diary_pin');
    setPinLocked(false);
    setShowSetPin(false);
    toast('PIN removed', 'success');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this entry?')) return;
    await softDeleteEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));
    toast('Entry deleted', 'success');
    loadData();
  };

  const handlePublish = async (id: string, title: string) => {
    const summary = window.prompt('Enter a public summary for this highlight:', title);
    if (!summary) return;
    try {
      const res = await fetch('/api/diary/publish', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, summary, title, date: entries.find(e => e.id === id)?.entry_date }),
      });
      if (!res.ok) throw new Error('Failed');
      setEntries(prev => prev.map(e => e.id === id ? { ...e, is_highlight: true, highlight_summary: summary } : e));
      toast('Published as highlight', 'success');
    } catch { toast('Failed to publish. Try again.', 'error'); }
  };

  const handleDateClick = (date: string) => {
    setFilteredByDate(filteredByDate === date ? null : date);
  };

  const filteredEntries = filteredByDate
    ? entries.filter(e => e.entry_date === filteredByDate)
    : entries;

  const formatDate = (d: string) => {
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const moodMap = Object.fromEntries(MOOD_OPTIONS.map(m => [m.value, m]));

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // PIN Lock screen
  if (!showSetPin && pinLocked) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-sm items-center justify-center px-4">
        <Card className="w-full p-8 text-center">
          <Lock className="mx-auto size-12 text-primary" />
          <h1 className="mt-4 font-heading text-2xl font-bold">Diary Locked</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your diary is protected with a PIN</p>
          <div className="mt-6 space-y-4">
            <Input type="password" value={pinInput} onChange={e => setPinInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handlePinUnlock()} placeholder="Enter PIN" maxLength={10} className="text-center text-lg tracking-widest" />
            {pinError && <p className="text-sm text-destructive">{pinError}</p>}
            <Button className="w-full" onClick={handlePinUnlock}>
              <Unlock className="size-4" />
              Unlock
            </Button>
            <button onClick={() => { setShowSetPin(true); setPinError(''); }} className="text-xs text-muted-foreground hover:text-foreground underline">
              Change or remove PIN
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Set PIN
  if (showSetPin) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-sm items-center justify-center px-4">
        <Card className="w-full p-8">
          <Lock className="mx-auto size-12 text-primary" />
          <h1 className="mt-4 text-center font-heading text-2xl font-bold">
            {localStorage.getItem('jainz_diary_pin') ? 'Change PIN' : 'Set Diary PIN'}
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Protect your diary with a security PIN (stored only on your device)
          </p>
          <div className="mt-6 space-y-4">
            <Input type="password" value={newPin} onChange={e => setNewPin(e.target.value)} placeholder="New PIN (4-10 chars)" maxLength={10} />
            <Input type="password" value={confirmPin} onChange={e => { setConfirmPin(e.target.value); setPinError(''); }} placeholder="Confirm PIN" maxLength={10} />
            {pinError && <p className="text-sm text-destructive">{pinError}</p>}
            <Button className="w-full" onClick={handleSetPin} disabled={savingPin}>
              {localStorage.getItem('jainz_diary_pin') ? 'Change PIN' : 'Set PIN'}
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setShowSetPin(false)}>Back</Button>
              {localStorage.getItem('jainz_diary_pin') && (
                <Button variant="danger" className="flex-1" onClick={handleRemovePin}>Remove PIN</Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <BookOpen className="size-7 text-primary" />
            <h1 className="font-heading text-3xl font-bold tracking-tight">JainZ Diary</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            <Lock className="mr-1 inline size-3" />
            Your diary stays on your device. You own your data.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSetPin(true)} className="rounded-full p-2 text-muted-foreground hover:bg-accent" title="PIN Settings">
            <Settings className="size-4" />
          </button>
          <Link href="/diary/new">
            <Button>
              <Plus className="size-4" />
              New Entry
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="p-4 text-center">
          <FileText className="mx-auto size-5 text-primary" />
          <p className="mt-1 text-2xl font-bold">{totalEntries}</p>
          <p className="text-xs text-muted-foreground">Entries</p>
        </Card>
        <Card className="p-4 text-center">
          <Flame className="mx-auto size-5 text-orange-400" />
          <p className="mt-1 text-2xl font-bold">{currentStreak}</p>
          <p className="text-xs text-muted-foreground">Current Streak</p>
        </Card>
        <Card className="p-4 text-center">
          <TrendingUp className="mx-auto size-5 text-green-400" />
          <p className="mt-1 text-2xl font-bold">{bestStreak}</p>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </Card>
        <Card className="p-4 text-center">
          <Star className="mx-auto size-5 text-yellow-400" />
          <p className="mt-1 text-2xl font-bold">{highlightsCount}</p>
          <p className="text-xs text-muted-foreground">Highlights</p>
        </Card>
      </div>

      {/* Heatmap */}
      <Card className="mt-6 overflow-x-auto p-4 md:p-6">
        <h2 className="font-heading text-lg font-semibold">Activity</h2>
        <p className="text-sm text-muted-foreground">Your journaling over the past year</p>
        <GitHubHeatmap data={heatmap} onDateClick={handleDateClick} selectedDate={filteredByDate} />
      </Card>

      {/* Search & Filters */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { setPage(0); loadData(); } }} placeholder="Search your diary..." className="pl-10" />
        </div>
        <select
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value); setPage(0); }}
          className="h-12 rounded-xl border border-input bg-transparent px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="" className="bg-card">All Types</option>
          {JOURNAL_TYPES.map(jt => (
            <option key={jt.value} value={jt.value} className="bg-card">{jt.icon} {jt.label}</option>
          ))}
        </select>
        <Link href="/diary/timeline">
          <Button variant="outline">
            <CalendarDays className="size-4" />
            Timeline
          </Button>
        </Link>
      </div>

      {/* Filter notice */}
      {filteredByDate && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Showing entries for <strong>{formatDate(filteredByDate)}</strong></span>
          <button onClick={() => setFilteredByDate(null)} className="text-primary hover:underline">Clear</button>
        </div>
      )}

      {/* Entries */}
      <div className="mt-6 space-y-3">
        {loading && entries.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredEntries.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="mx-auto size-12 text-muted-foreground" />
            <h3 className="mt-4 font-heading text-lg font-semibold">
              {query || typeFilter ? 'No matching entries' : 'Your diary is empty'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {query || typeFilter
                ? 'Try a different search or filter'
                : 'Today is a great day to write your first reflection.'}
            </p>
            {!query && !typeFilter && (
              <Link href="/diary/new">
                <Button className="mt-4">
                  <PenLine className="size-4" />
                  Write Your First Entry
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <>
            {filteredEntries.map(entry => {
              const moodInfo = moodMap[entry.mood ?? ''] ?? null;
              const jtInfo = JOURNAL_TYPES.find(j => j.value === entry.journal_type);
              return (
                <Link key={entry.id} href={`/diary/${entry.id}`}>
                  <Card className="group flex items-start justify-between gap-4 p-5 transition hover:border-primary/40">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {moodInfo && <span className={moodInfo.color}>{moodInfo.emoji}</span>}
                        <h3 className="truncate font-medium">{entry.title}</h3>
                        {entry.is_highlight && <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        <span>{formatDate(entry.entry_date)}</span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                          {jtInfo?.icon} {jtInfo?.label ?? entry.journal_type}
                        </span>
                        {entry.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="rounded-full bg-muted px-2 py-0.5">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
                      <button onClick={e => { e.preventDefault(); handlePublish(entry.id, entry.title); }} className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-yellow-400" title="Publish as highlight">
                        <Star className="size-4" />
                      </button>
                      <button onClick={e => { e.preventDefault(); handleDelete(entry.id); }} className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive" title="Delete">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </Card>
                </Link>
              );
            })}
            {entries.length < total && (
              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={() => { setPage(p => p + 1); }}>
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function GitHubHeatmap({ data, onDateClick, selectedDate }: {
  data: DiaryHeatmapDay[];
  onDateClick: (date: string) => void;
  selectedDate: string | null;
}) {
  const today = new Date();
  const weeks: DiaryHeatmapDay[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const monthLabels: { index: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    if (week.length > 0) {
      const month = new Date(week[0].date + 'T00:00:00').getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ index: wi, label: new Date(week[0].date + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short' }) });
        lastMonth = month;
      }
    }
  });

  const intensityColors = [
    'bg-muted/20',
    'bg-primary/20',
    'bg-primary/40',
    'bg-primary/65',
    'bg-primary',
  ];

  const formatDateLabel = (d: string) => {
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="mt-4">
      {weeks.length > 0 && (
        <div className="relative">
          {/* Month labels */}
          <div className="mb-1 flex text-xs text-muted-foreground" style={{ paddingLeft: '0' }}>
            {monthLabels.map(({ index, label }) => (
              <div key={index} style={{ marginLeft: `${index * 14}px` }}>{label}</div>
            ))}
          </div>
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map(day => (
                  <button
                    key={day.date}
                    onClick={() => onDateClick(day.date)}
                    className={`size-[13px] rounded-sm ${intensityColors[day.intensity]} transition hover:scale-125 hover:ring-1 hover:ring-primary ${selectedDate === day.date ? 'ring-2 ring-primary' : ''}`}
                    title={`${formatDateLabel(day.date)} — ${day.count} ${day.count === 1 ? 'entry' : 'entries'}`}
                    aria-label={`${formatDateLabel(day.date)}: ${day.count} entries`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <span>Less</span>
            {intensityColors.map((c, i) => (
              <div key={i} className={`size-[13px] rounded-sm ${c}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      )}
    </div>
  );
}
