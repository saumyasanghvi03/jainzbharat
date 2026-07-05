import type { LocalDiaryEntry, LocalDiaryDraft, LocalDiaryVersion, DiaryHeatmapDay } from './types';

const DB_NAME = 'jainz-diary';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('entries')) {
        const store = db.createObjectStore('entries', { keyPath: 'id' });
        store.createIndex('entry_date', 'entry_date', { unique: false });
        store.createIndex('journal_type', 'journal_type', { unique: false });
        store.createIndex('mood', 'mood', { unique: false });
        store.createIndex('deleted_at', 'deleted_at', { unique: false });
        store.createIndex('is_highlight', 'is_highlight', { unique: false });
      }
      if (!db.objectStoreNames.contains('drafts')) {
        db.createObjectStore('drafts', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('versions')) {
        const store = db.createObjectStore('versions', { keyPath: 'id' });
        store.createIndex('entry_id', 'entry_id', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ──────────────────────────────────────────────
// ENTRIES
// ──────────────────────────────────────────────

export async function getAllEntries(options: {
  limit?: number;
  offset?: number;
  journalType?: string;
  mood?: string;
  tag?: string;
  query?: string;
  startDate?: string;
  endDate?: string;
  includeDeleted?: boolean;
} = {}): Promise<{ entries: LocalDiaryEntry[]; total: number }> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('entries', 'readonly');
    const store = tx.objectStore('entries');
    const request = store.getAll();
    request.onsuccess = () => {
      let all = (request.result as LocalDiaryEntry[])
        .filter(e => options.includeDeleted || !e.deleted_at)
        .sort((a, b) => b.entry_date.localeCompare(a.entry_date));

      if (options.journalType) all = all.filter(e => e.journal_type === options.journalType);
      if (options.mood) all = all.filter(e => e.mood === options.mood);
      if (options.tag) all = all.filter(e => e.tags.includes(options.tag!));
      if (options.query) {
        const q = options.query.toLowerCase();
        all = all.filter(e => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q));
      }
      if (options.startDate) all = all.filter(e => e.entry_date >= options.startDate!);
      if (options.endDate) all = all.filter(e => e.entry_date <= options.endDate!);

      const total = all.length;
      const offset = options.offset ?? 0;
      const limit = options.limit ?? 30;
      const entries = all.slice(offset, offset + limit);
      db.close();
      resolve({ entries, total });
    };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

export async function getEntry(id: string): Promise<LocalDiaryEntry | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('entries', 'readonly');
    const store = tx.objectStore('entries');
    const request = store.get(id);
    request.onsuccess = () => { db.close(); resolve((request.result as LocalDiaryEntry) ?? null); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

export async function saveEntry(entry: Partial<LocalDiaryEntry> & { title: string }): Promise<LocalDiaryEntry> {
  const now = new Date().toISOString();
  const existing = entry.id ? await getEntry(entry.id) : null;
  const full: LocalDiaryEntry = {
    id: entry.id ?? generateId(),
    title: entry.title,
    content: entry.content ?? '',
    mood: entry.mood ?? null,
    gratitude: entry.gratitude ?? null,
    goals: entry.goals ?? null,
    reflections: entry.reflections ?? null,
    journal_type: entry.journal_type ?? 'personal',
    privacy: entry.privacy ?? 'private',
    is_highlight: entry.is_highlight ?? false,
    highlight_summary: entry.highlight_summary ?? null,
    highlight_media: entry.highlight_media ?? [],
    tags: entry.tags ?? [],
    entry_date: entry.entry_date ?? now.split('T')[0],
    created_at: existing?.created_at ?? now,
    updated_at: now,
    deleted_at: entry.deleted_at ?? null,
    version: (existing?.version ?? 0) + 1,
  };

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('entries', 'readwrite');
    const store = tx.objectStore('entries');
    const request = store.put(full);
    request.onsuccess = () => { db.close(); resolve(full); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('entries', 'readwrite');
    const store = tx.objectStore('entries');
    const request = store.delete(id);
    request.onsuccess = () => { db.close(); resolve(); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

export async function softDeleteEntry(id: string): Promise<void> {
  const entry = await getEntry(id);
  if (!entry) return;
  await saveEntry({ ...entry, deleted_at: new Date().toISOString() });
}

// ──────────────────────────────────────────────
// DRAFTS
// ──────────────────────────────────────────────

export async function saveDraft(draft: Partial<LocalDiaryDraft> & { title?: string | null }): Promise<LocalDiaryDraft> {
  const now = new Date().toISOString();
  const full: LocalDiaryDraft = {
    id: draft.id ?? generateId(),
    title: draft.title ?? null,
    content: draft.content ?? null,
    mood: draft.mood ?? null,
    gratitude: draft.gratitude ?? null,
    goals: draft.goals ?? null,
    reflections: draft.reflections ?? null,
    journal_type: draft.journal_type ?? null,
    tags: draft.tags ?? [],
    created_at: now,
    updated_at: now,
  };

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('drafts', 'readwrite');
    const store = tx.objectStore('drafts');
    const request = store.put(full);
    request.onsuccess = () => { db.close(); resolve(full); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

export async function getDrafts(): Promise<LocalDiaryDraft[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('drafts', 'readonly');
    const store = tx.objectStore('drafts');
    const request = store.getAll();
    request.onsuccess = () => {
      db.close();
      const drafts = (request.result as LocalDiaryDraft[]).sort((a, b) => b.updated_at.localeCompare(a.updated_at));
      resolve(drafts);
    };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

export async function deleteDraft(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('drafts', 'readwrite');
    const store = tx.objectStore('drafts');
    const request = store.delete(id);
    request.onsuccess = () => { db.close(); resolve(); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

// ──────────────────────────────────────────────
// VERSIONS
// ──────────────────────────────────────────────

export async function saveVersion(entryId: string, title: string, content: string, version: number): Promise<void> {
  const ver: LocalDiaryVersion = {
    id: generateId(),
    entry_id: entryId,
    title,
    content,
    version,
    created_at: new Date().toISOString(),
  };
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('versions', 'readwrite');
    const store = tx.objectStore('versions');
    const request = store.put(ver);
    request.onsuccess = () => { db.close(); resolve(); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

export async function getVersions(entryId: string): Promise<LocalDiaryVersion[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('versions', 'readonly');
    const store = tx.objectStore('versions');
    const index = store.index('entry_id');
    const request = index.getAll(entryId);
    request.onsuccess = () => {
      db.close();
      resolve((request.result as LocalDiaryVersion[]).sort((a, b) => b.version - a.version));
    };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

// ──────────────────────────────────────────────
// STATS & HEATMAP
// ──────────────────────────────────────────────

export async function getHeatmapData(): Promise<DiaryHeatmapDay[]> {
  const { entries } = await getAllEntries({ limit: 10000 });
  const countMap = new Map<string, number>();
  for (const e of entries) {
    countMap.set(e.entry_date, (countMap.get(e.entry_date) ?? 0) + 1);
  }
  const today = new Date();
  const start = new Date(today);
  start.setFullYear(today.getFullYear() - 1);

  const result: DiaryHeatmapDay[] = [];
  const current = new Date(start);
  while (current <= today) {
    const key = current.toISOString().split('T')[0];
    const count = countMap.get(key) ?? 0;
    const intensity = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 6 ? 3 : 4;
    result.push({ date: key, count, intensity } as DiaryHeatmapDay);
    current.setDate(current.getDate() + 1);
  }
  return result;
}

export async function getStats() {
  const { entries } = await getAllEntries({ limit: 10000 });
  const total = entries.length;
  const byType = new Map<string, number>();
  const byMood = new Map<string, number>();
  const dates = new Set<string>();

  for (const e of entries) {
    byType.set(e.journal_type, (byType.get(e.journal_type) ?? 0) + 1);
    if (e.mood) byMood.set(e.mood, (byMood.get(e.mood) ?? 0) + 1);
    dates.add(e.entry_date);
  }

  const sortedDates = Array.from(dates).sort().reverse();
  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = (prev.getTime() - curr.getTime()) / 86400000;
      if (diff === 1) currentStreak++;
      else break;
    }
  }

  let bestStreak = 0;
  let streak = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) { streak = 1; continue; }
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) streak++;
    else { bestStreak = Math.max(bestStreak, streak); streak = 1; }
  }
  bestStreak = Math.max(bestStreak, streak);

  const highlights = entries.filter(e => e.is_highlight).length;

  return { total, currentStreak, bestStreak, highlights, byType: Object.fromEntries(byType), byMood: Object.fromEntries(byMood) };
}

// ──────────────────────────────────────────────
// EXPORT
// ──────────────────────────────────────────────

export async function exportEntries(format: 'json' | 'csv' | 'markdown'): Promise<string> {
  const { entries } = await getAllEntries({ limit: 10000, includeDeleted: false });
  const sorted = entries.sort((a, b) => b.entry_date.localeCompare(a.entry_date));

  switch (format) {
    case 'json':
      return JSON.stringify(sorted, null, 2);
    case 'csv': {
      const headers = 'title,entry_date,journal_type,mood,tags,privacy,is_highlight';
      const rows = sorted.map(e =>
        `"${e.title.replace(/"/g, '""')}","${e.entry_date}","${e.journal_type}","${e.mood ?? ''}","${e.tags.join(';')}","${e.privacy}","${e.is_highlight}"`
      );
      return [headers, ...rows].join('\n');
    }
    case 'markdown': {
      let md = '# JainZ Diary Export\n\n';
      for (const e of sorted) {
        md += `## ${e.title}\n`;
        md += `- **Date:** ${e.entry_date}\n`;
        md += `- **Type:** ${e.journal_type}\n`;
        md += `- **Mood:** ${e.mood ?? 'N/A'}\n`;
        md += `- **Tags:** ${e.tags.join(', ') || 'None'}\n\n`;
        md += `${e.content}\n\n---\n\n`;
      }
      return md;
    }
  }
}

// ──────────────────────────────────────────────
// SEARCH
// ──────────────────────────────────────────────

export async function searchEntries(query: string): Promise<LocalDiaryEntry[]> {
  const { entries } = await getAllEntries({ query, limit: 50, includeDeleted: false });
  return entries;
}
