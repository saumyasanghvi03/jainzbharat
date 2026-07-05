import { getSupabaseServerClient } from '../server';
import type { Sangh, SanghInsert, SanghUpdate } from '../types';

export interface ListSanghsOptions {
  limit?: number;
  offset?: number;
  country?: string;
  city?: string;
  query?: string;
}

export async function listSanghs(options: ListSanghsOptions = {}): Promise<{ data: Sangh[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;

  let query = supabase.from('sanghs').select('*', { count: 'exact' });
  if (options.country) query = query.eq('country', options.country);
  if (options.city) query = query.eq('city', options.city);
  if (options.query) query = query.ilike('name', `%${options.query}%`);

  const { data, count } = await query.order('member_count', { ascending: false }).range(offset, offset + limit - 1);
  return { data: (data ?? []) as Sangh[], total: count ?? 0 };
}

export async function getSanghBySlug(slug: string): Promise<Sangh | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('sanghs').select('*').eq('slug', slug).maybeSingle();
  return data as Sangh | null;
}

export async function createSangh(input: SanghInsert): Promise<Sangh | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('sanghs') as any).insert(input).select().maybeSingle();
  return data as Sangh | null;
}

export async function updateSangh(slug: string, updates: SanghUpdate): Promise<Sangh | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('sanghs') as any).update(updates).eq('slug', slug).select().maybeSingle();
  return data as Sangh | null;
}
