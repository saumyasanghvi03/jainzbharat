import { getSupabaseServerClient } from '../server';
import { createHash, randomBytes } from 'crypto';
import type { DiaryEntry, DiaryEntryInsert, DiaryEntryUpdate, DiaryDraftInsert, DiaryDraftUpdate } from '../types';

export interface ListDiaryOptions {
  limit?: number;
  offset?: number;
  profileId: string;
  journalType?: string;
  mood?: string;
  tags?: string[];
  query?: string;
  startDate?: string;
  endDate?: string;
  includeDeleted?: boolean;
}

export async function listDiaryEntries(options: ListDiaryOptions): Promise<{ data: DiaryEntry[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;

  let query = supabase.from('diary_entries').select('*', { count: 'exact' }).eq('profile_id', options.profileId);

  if (!options.includeDeleted) query = query.is('deleted_at', null);
  if (options.journalType) query = query.eq('journal_type', options.journalType);
  if (options.mood) query = query.eq('mood', options.mood);
  if (options.tags && options.tags.length > 0) query = query.contains('tags', options.tags);
  if (options.query) query = query.ilike('title', `%${options.query}%`);
  if (options.startDate) query = query.gte('entry_date', options.startDate);
  if (options.endDate) query = query.lte('entry_date', options.endDate);

  const { data, count } = await query.order('entry_date', { ascending: false }).range(offset, offset + limit - 1);
  return { data: (data ?? []) as DiaryEntry[], total: count ?? 0 };
}

export async function getDiaryEntry(id: string, profileId: string): Promise<DiaryEntry | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('diary_entries').select('*').eq('id', id).eq('profile_id', profileId).is('deleted_at', null).maybeSingle();
  return data as DiaryEntry | null;
}

export async function createDiaryEntry(input: DiaryEntryInsert): Promise<DiaryEntry | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('diary_entries') as any).insert(input).select().maybeSingle();
  return data as DiaryEntry | null;
}

export async function updateDiaryEntry(id: string, profileId: string, updates: DiaryEntryUpdate): Promise<DiaryEntry | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('diary_entries') as any).update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).eq('profile_id', profileId).select().maybeSingle();
  return data as DiaryEntry | null;
}

export async function softDeleteDiaryEntry(id: string, profileId: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  const { error } = await (supabase.from('diary_entries') as any).update({ deleted_at: new Date().toISOString() }).eq('id', id).eq('profile_id', profileId);
  return !error;
}

export async function getDiaryStats(profileId: string): Promise<{ date: string; count: number }[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('diary_entries').select('entry_date').eq('profile_id', profileId).is('deleted_at', null);
  if (!data) return [];
  const counts: Record<string, number> = {};
  for (const row of data) {
    const d = (row as any).entry_date;
    counts[d] = (counts[d] ?? 0) + 1;
  }
  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}

export async function getHighlights(profileId: string): Promise<DiaryEntry[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('diary_entries').select('*').eq('profile_id', profileId).eq('is_highlight', true).not('published_at', 'is', null).is('deleted_at', null).order('published_at', { ascending: false }).limit(50);
  return (data ?? []) as DiaryEntry[];
}

export async function publishHighlight(id: string, profileId: string, summary: string): Promise<DiaryEntry | null> {
  return updateDiaryEntry(id, profileId, { is_highlight: true, highlight_summary: summary, published_at: new Date().toISOString() });
}

export async function unpublishHighlight(id: string, profileId: string): Promise<DiaryEntry | null> {
  return updateDiaryEntry(id, profileId, { is_highlight: false, highlight_summary: null, published_at: null });
}

// Drafts
export async function saveDraft(input: DiaryDraftInsert): Promise<{ id: string } | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('diary_drafts') as any).insert(input).select('id').maybeSingle();
  return data as { id: string } | null;
}

export async function updateDraft(id: string, profileId: string, updates: DiaryDraftUpdate): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  const { error } = await (supabase.from('diary_drafts') as any).update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).eq('profile_id', profileId);
  return !error;
}

export async function getDrafts(profileId: string): Promise<{ id: string; title: string | null; updated_at: string }[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('diary_drafts').select('id, title, updated_at').eq('profile_id', profileId).order('updated_at', { ascending: false }).limit(10);
  return (data ?? []) as { id: string; title: string | null; updated_at: string }[];
}

export async function deleteDraft(id: string, profileId: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from('diary_drafts').delete().eq('id', id).eq('profile_id', profileId);
  return !error;
}

// PIN management
function hashPin(pin: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(salt + pin).digest('hex');
  return `${salt}:${hash}`;
}

function verifyPinHash(pin: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const computed = createHash('sha256').update(salt + pin).digest('hex');
  return computed === hash;
}

export function getPinHash(pin: string): string {
  return hashPin(pin);
}

export function checkPin(pin: string, storedHash: string): boolean {
  return verifyPinHash(pin, storedHash);
}
