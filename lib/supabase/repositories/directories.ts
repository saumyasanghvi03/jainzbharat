import { getSupabaseServerClient } from '../server';
import type { DirectoryEntry, DirectoryType } from '../types';

export interface ListDirectoriesOptions {
  type?: DirectoryType;
  limit?: number;
  offset?: number;
  query?: string;
  country?: string;
  sortBy?: 'created_at' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export async function listDirectoryEntries(options: ListDirectoriesOptions = {}): Promise<{ data: DirectoryEntry[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;
  const sortBy = options.sortBy ?? 'created_at';
  const sortOrder = options.sortOrder ?? 'desc';

  let query = supabase.from('directory_entries').select('*', { count: 'exact' }).eq('verification_status', 'verified');

  if (options.type) query = query.eq('directory_type', options.type);
  if (options.country) query = query.filter('location->>country', 'eq', options.country);
  if (options.query) query = query.textSearch('directory_search_idx', options.query, { type: 'websearch' } as any);

  const { data, count } = await query.order(sortBy, { ascending: sortOrder === 'asc' }).range(offset, offset + limit - 1);

  return { data: (data ?? []) as DirectoryEntry[], total: count ?? 0 };
}

export async function getDirectoryEntryBySlug(slug: string): Promise<DirectoryEntry | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('directory_entries').select('*').eq('slug', slug).maybeSingle();
  return data as DirectoryEntry | null;
}

export async function createDirectoryEntry(entry: Record<string, unknown>): Promise<DirectoryEntry | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('directory_entries') as any).insert(entry).select().maybeSingle();
  return data as DirectoryEntry | null;
}

export async function updateDirectoryEntry(slug: string, updates: Record<string, unknown>): Promise<DirectoryEntry | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('directory_entries') as any).update({ updated_at: new Date().toISOString(), ...updates }).eq('slug', slug).select().maybeSingle();
  return data as DirectoryEntry | null;
}
