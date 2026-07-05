import { getSupabaseServerClient } from '../server';
import type { Temple, TempleInsert, TempleUpdate } from '../types';

export interface ListTemplesOptions {
  limit?: number;
  offset?: number;
  country?: string;
  city?: string;
  query?: string;
}

export async function listTemples(options: ListTemplesOptions = {}): Promise<{ data: Temple[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;

  let query = supabase.from('temples').select('*', { count: 'exact' });
  if (options.country) query = query.eq('country', options.country);
  if (options.city) query = query.eq('city', options.city);
  if (options.query) query = query.ilike('name', `%${options.query}%`);

  const { data, count } = await query.order('name', { ascending: true }).range(offset, offset + limit - 1);
  return { data: (data ?? []) as Temple[], total: count ?? 0 };
}

export async function getTempleBySlug(slug: string): Promise<Temple | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('temples').select('*').eq('slug', slug).maybeSingle();
  return data as Temple | null;
}

export async function createTemple(input: TempleInsert): Promise<Temple | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('temples') as any).insert(input).select().maybeSingle();
  return data as Temple | null;
}

export async function updateTemple(slug: string, updates: TempleUpdate): Promise<Temple | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('temples') as any).update(updates).eq('slug', slug).select().maybeSingle();
  return data as Temple | null;
}
