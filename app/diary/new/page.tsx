'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/card';
import { useToast } from '@/components/ui/toast';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Save, Loader2, Star, X, Plus, Send, CheckCircle2 } from 'lucide-react';
import {
  saveEntry, saveDraft, deleteDraft, saveVersion,
  JOURNAL_TYPES, MOOD_OPTIONS, PRIVACY_OPTIONS,
  type DiaryJournalType, type DiaryPrivacy,
} from '@/lib/diary';

export default function NewDiaryEntryPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [journalType, setJournalType] = useState<DiaryJournalType>('personal');
  const [privacy, setPrivacy] = useState<DiaryPrivacy>('private');
  const [gratitude, setGratitude] = useState('');
  const [goals, setGoals] = useState('');
  const [reflections, setReflections] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const autosaveTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const autoSave = useCallback(async () => {
    if (!title && !content) return;
    setAutosaveStatus('saving');
    try {
      const draft = await saveDraft({
        id: draftId ?? undefined,
        title,
        content,
        mood: mood || null,
        journal_type: journalType,
        gratitude: gratitude || null,
        goals: goals || null,
        reflections: reflections || null,
        tags,
      });
      if (!draftId) setDraftId(draft.id);
      setAutosaveStatus('saved');
    } catch { setAutosaveStatus('idle'); }
  }, [title, content, mood, journalType, tags, gratitude, goals, reflections, draftId]);

  useEffect(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(autoSave, 10000);
    return () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); };
  }, [autoSave]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  const handleSave = async () => {
    if (!title.trim()) { toast('Please enter a title', 'error'); return; }
    setSaving(true);
    try {
      const entry = await saveEntry({
        title: title.trim(),
        content,
        mood: mood || null,
        journal_type: journalType,
        privacy,
        gratitude: gratitude || null,
        goals: goals || null,
        reflections: reflections || null,
        tags,
      });

      // Save initial version
      await saveVersion(entry.id, entry.title, entry.content, 1);

      // Clear draft
      if (draftId) await deleteDraft(draftId);

      toast('Entry saved', 'success');
      router.push(`/diary/${entry.id}`);
    } catch {
      toast('Failed to save', 'error');
    }
    setSaving(false);
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

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
        <h1 className="font-heading text-2xl font-bold">New Entry</h1>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {autosaveStatus === 'saving' && <Loader2 className="size-3 animate-spin" />}
            {autosaveStatus === 'saved' && <CheckCircle2 className="size-3 text-green-400" />}
            {autosaveStatus === 'saving' ? 'Saving...' : autosaveStatus === 'saved' ? 'Saved' : ''}
          </span>
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Save
          </Button>
        </div>
      </div>

      {/* Journal Type + Privacy */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Journal Type</h2>
          <div className="flex flex-wrap gap-2">
            {JOURNAL_TYPES.map(jt => (
              <button
                key={jt.value}
                onClick={() => setJournalType(jt.value)}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  journalType === jt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {jt.icon} {jt.label}
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Privacy</h2>
          <div className="flex flex-wrap gap-2">
            {PRIVACY_OPTIONS.map(po => (
              <button
                key={po.value}
                onClick={() => setPrivacy(po.value)}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  privacy === po.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
                title={po.description}
              >
                {po.label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Title */}
      <div className="mt-4">
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="What's on your mind today?" className="h-14 text-lg font-medium" />
      </div>

      {/* Content */}
      <div className="mt-4">
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your thoughts... (Markdown supported: **bold**, *italic*, # headings, - lists)"
          rows={16}
          className="min-h-[300px] resize-y font-mono text-sm leading-relaxed"
        />
      </div>

      {/* Mood */}
      <Card className="mt-4 p-4">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">How are you feeling?</h2>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map(m => (
            <button
              key={m.value}
              onClick={() => setMood(mood === m.value ? '' : m.value)}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                mood === m.value ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              <span className={m.color}>{m.emoji}</span> {m.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Tags */}
      <Card className="mt-4 p-4">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map(t => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {t}
              <button onClick={() => setTags(prev => prev.filter(x => x !== t))}><X className="size-3" /></button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} placeholder="Add tag..." className="flex-1" />
          <Button type="button" variant="outline" size="icon" onClick={addTag} disabled={!tagInput.trim()}><Plus className="size-4" /></Button>
        </div>
      </Card>

      {/* Optional Details */}
      <button onClick={() => setShowDetails(!showDetails)} className="mt-4 text-sm text-primary hover:underline">
        {showDetails ? 'Hide' : 'Show'} gratitude, goals & reflections
      </button>

      {showDetails && (
        <div className="mt-4 space-y-4">
          <Card className="p-4">
            <label className="text-sm font-medium">Gratitude</label>
            <p className="mb-2 text-xs text-muted-foreground">What are you grateful for today?</p>
            <Textarea value={gratitude} onChange={e => setGratitude(e.target.value)} rows={3} placeholder="I'm grateful for..." />
          </Card>
          <Card className="p-4">
            <label className="text-sm font-medium">Goals</label>
            <p className="mb-2 text-xs text-muted-foreground">What do you want to achieve?</p>
            <Textarea value={goals} onChange={e => setGoals(e.target.value)} rows={3} placeholder="My goals..." />
          </Card>
          <Card className="p-4">
            <label className="text-sm font-medium">Reflections</label>
            <p className="mb-2 text-xs text-muted-foreground">What did you learn or realize?</p>
            <Textarea value={reflections} onChange={e => setReflections(e.target.value)} rows={3} placeholder="My reflections..." />
          </Card>
        </div>
      )}

      {/* Save footer */}
      <div className="mt-8 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {autosaveStatus === 'saving' && <Loader2 className="size-3 animate-spin" />}
          {autosaveStatus === 'saved' && <CheckCircle2 className="size-3 text-green-400" />}
          {autosaveStatus === 'saving' ? 'Autosaving...' : autosaveStatus === 'saved' ? 'Draft saved ✓' : 'Autosaves every 10s'}
        </span>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Entry
          </Button>
        </div>
      </div>
    </div>
  );
}
