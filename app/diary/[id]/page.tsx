'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/card';
import { useToast } from '@/components/ui/toast';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Save, Loader2, ArrowLeft, Trash2, Star, CheckCircle2,
  Clock, History, Download, Printer, Share2,
} from 'lucide-react';
import {
  getEntry, saveEntry, saveVersion, getVersions, softDeleteEntry, deleteEntry,
  JOURNAL_TYPES, MOOD_OPTIONS, PRIVACY_OPTIONS,
  type LocalDiaryEntry, type LocalDiaryVersion, type DiaryJournalType, type DiaryPrivacy,
} from '@/lib/diary';

export default function DiaryEntryPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const id = params.id as string;

  const [entry, setEntry] = useState<LocalDiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [journalType, setJournalType] = useState<DiaryJournalType>('personal');
  const [privacy, setPrivacy] = useState<DiaryPrivacy>('private');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [versions, setVersions] = useState<LocalDiaryVersion[]>([]);
  const [showVersions, setShowVersions] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const autosaveTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!id || !isSignedIn) return;
    const load = async () => {
      const e = await getEntry(id);
      if (!e) { toast('Entry not found', 'error'); router.push('/diary'); return; }
      setEntry(e);
      setTitle(e.title);
      setContent(e.content);
      setMood(e.mood ?? '');
      setJournalType(e.journal_type);
      setPrivacy(e.privacy);
      setTags(e.tags);
      setLoading(false);
    };
    load();
  }, [id, isSignedIn, router, toast]);

  useEffect(() => {
    if (!id || !isSignedIn) return;
    getVersions(id).then(setVersions).catch(() => {});
  }, [id, isSignedIn]);

  const autoSave = useCallback(async () => {
    if (!editing || !entry) return;
    if (title === entry.title && content === entry.content && mood === (entry.mood ?? '')) return;
    setAutosaveStatus('saving');
    try {
      const updated = await saveEntry({
        id: entry.id,
        title: title || entry.title,
        content,
        mood: mood || null,
        journal_type: journalType,
        privacy,
        tags,
        entry_date: entry.entry_date,
        created_at: entry.created_at,
      });
      if (updated.version > (entry?.version ?? 0)) {
        await saveVersion(entry.id, title, content, updated.version);
      }
      setEntry(prev => prev ? { ...prev, ...updated } : updated);
      setAutosaveStatus('saved');
    } catch { setAutosaveStatus('idle'); }
  }, [editing, entry, title, content, mood, journalType, privacy, tags]);

  useEffect(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    if (!editing) return;
    if (!entry) return;
    autosaveTimer.current = setTimeout(autoSave, 10000);
    return () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); };
  }, [autoSave, editing, entry, title, content, mood, journalType, privacy, tags]);

  const handleSave = async () => {
    if (!entry || !title.trim()) return;
    setSaving(true);
    try {
      const updated = await saveEntry({
        id: entry.id,
        title: title.trim(),
        content,
        mood: mood || null,
        journal_type: journalType,
        privacy,
        tags,
        entry_date: entry.entry_date,
        created_at: entry.created_at,
      });
      await saveVersion(entry.id, title, content, updated.version);
      setEntry(prev => prev ? { ...prev, ...updated } : updated);
      setEditing(false);
      toast('Entry updated', 'success');
    } catch { toast('Failed to save', 'error'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!entry || !window.confirm('Delete this entry permanently?')) return;
    setDeleting(true);
    await deleteEntry(entry.id);
    toast('Entry deleted', 'success');
    router.push('/diary');
  };

  const handlePublish = async () => {
    if (!entry) return;
    const summary = window.prompt('Public summary for this highlight:', entry.title);
    if (!summary) return;
    try {
      const res = await fetch('/api/diary/publish', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id, summary, title: entry.title, date: entry.entry_date }),
      });
      if (!res.ok) throw new Error('Failed');
      setEntry(prev => prev ? { ...prev, is_highlight: true, highlight_summary: summary } : prev);
      toast('Published as highlight', 'success');
    } catch { toast('Failed to publish', 'error'); }
  };

  const handleRestoreVersion = async (ver: LocalDiaryVersion) => {
    if (!window.confirm(`Restore version from ${new Date(ver.created_at).toLocaleDateString('en-IN')}?`)) return;
    setTitle(ver.title);
    setContent(ver.content);
    setShowVersions(false);
    toast('Version restored. Save to apply.', 'success');
  };

  const handleExport = () => {
    if (!entry) return;
    const md = `# ${entry.title}\n\n**Date:** ${entry.entry_date}\n**Type:** ${journalTypeLabels[entry.journal_type] ?? entry.journal_type}\n**Mood:** ${entry.mood ?? 'N/A'}\n\n---\n\n${entry.content}\n`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entry.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!entry) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>${entry.title}</title></head><body><h1>${entry.title}</h1><p>${entry.entry_date}</p><hr>${entry.content.replace(/\n/g, '<br>')}</body></html>`);
    win.document.close();
    win.print();
  };

  const moodInfo = MOOD_OPTIONS.find(m => m.value === (entry?.mood ?? mood));
  const journalTypeLabels = Object.fromEntries(JOURNAL_TYPES.map(j => [j.value, j.label]));

  if (!isLoaded || !isSignedIn || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!entry) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => router.push('/diary')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to Diary
        </button>
        <div className="flex items-center gap-2">
          {!entry.is_highlight && (
            <button onClick={handlePublish} className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-yellow-400" title="Publish as highlight">
              <Star className="size-4" />
            </button>
          )}
          <button onClick={handleExport} className="rounded-full p-2 text-muted-foreground hover:bg-accent" title="Export">
            <Download className="size-4" />
          </button>
          <button onClick={handlePrint} className="rounded-full p-2 text-muted-foreground hover:bg-accent" title="Print">
            <Printer className="size-4" />
          </button>
          <button onClick={() => { setShowVersions(!showVersions); getVersions(id).then(setVersions); }} className="rounded-full p-2 text-muted-foreground hover:bg-accent" title="Version history">
            <History className="size-4" />
          </button>
          <button onClick={handleDelete} disabled={deleting} className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-destructive" title="Delete">
            {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          </button>
        </div>
      </div>

      {/* Meta */}
      {!editing && (
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="size-3.5" /> {new Date(entry.entry_date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{JOURNAL_TYPES.find(j => j.value === entry.journal_type)?.icon} {journalTypeLabels[entry.journal_type]}</span>
          {moodInfo && <span className={moodInfo.color}>{moodInfo.emoji} {moodInfo.label}</span>}
          {entry.is_highlight && <span className="flex items-center gap-1 text-yellow-400"><Star className="size-3.5 fill-yellow-400" /> Highlight</span>}
          <span className="text-xs">v{entry.version}</span>
          {entry.tags.map(t => <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs">{t}</span>)}
        </div>
      )}

      {/* Editing: Title */}
      {editing ? (
        <>
          <Input value={title} onChange={e => setTitle(e.target.value)} className="mb-4 h-14 text-lg font-medium" />
          <Textarea value={content} onChange={e => setContent(e.target.value)} rows={20} className="min-h-[400px] resize-y font-mono text-sm leading-relaxed" />
          <div className="mt-6 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              {autosaveStatus === 'saving' && <Loader2 className="size-3 animate-spin" />}
              {autosaveStatus === 'saved' && <CheckCircle2 className="size-3 text-green-400" />}
              {autosaveStatus === 'saving' ? 'Autosaving...' : autosaveStatus === 'saved' ? 'Saved ✓' : 'Autosaves every 10s'}
            </span>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setEditing(false); setTitle(entry.title); setContent(entry.content); }}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="font-heading text-3xl font-bold tracking-tight">{entry.title}</h1>
          <div className="prose prose-invert mt-6 max-w-none whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {entry.content}
          </div>
          <div className="mt-8">
            <Button onClick={() => setEditing(true)}>
              <Save className="size-4" /> Edit Entry
            </Button>
          </div>
        </>
      )}

      {/* Version History */}
      {showVersions && (
        <Card className="mt-6 p-4">
          <h3 className="mb-3 font-heading text-sm font-semibold">Version History</h3>
          {versions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No previous versions</p>
          ) : (
            <div className="space-y-2">
              {versions.map((v, i) => (
                <div key={v.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <span className="text-sm font-medium">v{v.version}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{new Date(v.created_at).toLocaleString('en-IN')}</span>
                    {i === 0 && <span className="ml-2 text-xs text-green-400">(current)</span>}
                  </div>
                  {i > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => handleRestoreVersion(v)}>Restore</Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
