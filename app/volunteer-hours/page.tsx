'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/card';
import { useToast } from '@/components/ui/toast';
import { useEffect, useState, useRef } from 'react';
import { Clock, Play, Square, Plus, Trash2, Timer, Loader2, HeartHandshake } from 'lucide-react';

interface VolunteerSession {
  id: string;
  activity: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  status: 'running' | 'completed';
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function VolunteerHoursPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [sessions, setSessions] = useState<VolunteerSession[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('volunteer_sessions');
    return stored ? JSON.parse(stored) : [];
  });
  const [activity, setActivity] = useState('');
  const [description, setDescription] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualHours, setManualHours] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');
  const [showManual, setShowManual] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    localStorage.setItem('volunteer_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    const running = sessions.find(s => s.status === 'running');
    if (running && !timerRef.current) {
      timerRef.current = setInterval(() => forceUpdate(n => n + 1), 1000);
    }
    if (!running && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [sessions]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  const startTimer = () => {
    if (!activity.trim()) { toast('Enter an activity name', 'error'); return; }
    const now = new Date();
    const session: VolunteerSession = {
      id: Date.now().toString(),
      activity: activity.trim(),
      description,
      date: now.toISOString().split('T')[0],
      startTime: now.toISOString(),
      endTime: null,
      duration: 0,
      status: 'running',
    };
    setSessions(prev => [session, ...prev]);
    setActivity('');
    setDescription('');
    toast('Timer started', 'success');
  };

  const stopTimer = (id: string) => {
    const now = new Date();
    setSessions(prev => prev.map(s => {
      if (s.id !== id) return s;
      const start = new Date(s.startTime);
      const duration = (now.getTime() - start.getTime()) / 60000;
      return { ...s, endTime: now.toISOString(), duration, status: 'completed' };
    }));
    toast('Session completed', 'success');
  };

  const addManual = () => {
    if (!activity.trim()) { toast('Enter an activity name', 'error'); return; }
    const h = parseInt(manualHours) || 0;
    const m = parseInt(manualMinutes) || 0;
    if (h === 0 && m === 0) { toast('Enter at least 1 minute', 'error'); return; }
    const session: VolunteerSession = {
      id: Date.now().toString(),
      activity: activity.trim(),
      description,
      date: manualDate,
      startTime: `${manualDate}T00:00:00`,
      endTime: `${manualDate}T00:00:00`,
      duration: h * 60 + m,
      status: 'completed',
    };
    setSessions(prev => [session, ...prev]);
    setActivity('');
    setDescription('');
    toast('Hours logged', 'success');
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const runningSession = sessions.find(s => s.status === 'running');

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <HeartHandshake className="size-7 text-primary" />
            <h1 className="font-heading text-3xl font-bold">Volunteer Hours</h1>
          </div>
          <p className="mt-1 text-muted-foreground">Track your service and impact</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{formatDuration(totalMinutes)}</p>
          <p className="text-xs text-muted-foreground">Total volunteered</p>
        </div>
      </div>

      {/* New Entry */}
      <Card className="mt-6 p-6">
        <h2 className="font-heading text-lg font-semibold">
          {showManual ? 'Log Hours Manually' : runningSession ? 'Session in Progress' : 'Start a Session'}
        </h2>
        <div className="mt-4 space-y-3">
          <Input value={activity} onChange={e => setActivity(e.target.value)} placeholder="Activity name (e.g. Temple cleaning, Teaching)" />
          <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Short description (optional)" />

          {showManual ? (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Date</label>
                <Input type="date" value={manualDate} onChange={e => setManualDate(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-muted-foreground">Hours</label>
                  <Input type="number" min="0" value={manualHours} onChange={e => setManualHours(e.target.value)} placeholder="0" />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-muted-foreground">Minutes</label>
                  <Input type="number" min="0" max="59" value={manualMinutes} onChange={e => setManualMinutes(e.target.value)} placeholder="30" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addManual} className="flex-1"><Plus className="size-4" />Log Hours</Button>
                <Button variant="ghost" onClick={() => setShowManual(false)}>Cancel</Button>
              </div>
            </div>
          ) : runningSession ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-primary/10 p-4">
                <Timer className="size-5 animate-pulse text-primary" />
                <div>
                  <p className="font-medium">{runningSession.activity}</p>
                  <p className="text-xs text-muted-foreground">
                    Started: {formatTime(new Date(runningSession.startTime))} · Elapsed:{' '}
                    {formatDuration(
                      (Date.now() - new Date(runningSession.startTime).getTime()) / 60000
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="danger" onClick={() => stopTimer(runningSession.id)} className="flex-1">
                  <Square className="size-4" />Stop
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button onClick={startTimer} className="flex-1"><Play className="size-4" />Start Timer</Button>
              <Button variant="outline" onClick={() => setShowManual(true)}><Clock className="size-4" />Manual</Button>
            </div>
          )}
        </div>
      </Card>

      {/* History */}
      <div className="mt-8">
        <h2 className="mb-4 font-heading text-lg font-semibold">History</h2>
        {sessions.length === 0 ? (
          <Card className="p-8 text-center">
            <HeartHandshake className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No volunteer sessions yet. Start tracking your service hours.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {sessions.map(s => (
              <Card key={s.id} className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full ${s.status === 'running' ? 'animate-pulse bg-green-400' : 'bg-primary'}`} />
                    <span className="truncate font-medium">{s.activity}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{new Date(s.date + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {s.status === 'completed' && <span>{formatDuration(s.duration)}</span>}
                    {s.description && <span className="truncate">{s.description}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {s.status === 'running' && (
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">Live</span>
                  )}
                  <button onClick={() => deleteSession(s.id)} className="rounded-full p-1.5 text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
