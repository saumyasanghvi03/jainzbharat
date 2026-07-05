import { getSupabaseServerClient } from '../server';
import type { Club, ClubInsert, ClubUpdate, KalyanmitraGroup, KalyanmitraGroupInsert, KalyanmitraGroupUpdate } from '../types';

export interface ListClubsOptions {
  limit?: number;
  offset?: number;
  verifiedOnly?: boolean;
  query?: string;
}

export async function hasSignedDeclaration(profileId: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  const { count } = await supabase.from('declaration_signatures').select('*', { count: 'exact', head: true }).eq('profile_id', profileId);
  return (count ?? 0) > 0;
}

export async function listClubs(options: ListClubsOptions = {}): Promise<{ data: Club[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;

  let query = supabase.from('clubs').select('*', { count: 'exact' });
  if (options.verifiedOnly) query = query.eq('verification_status', 'verified');
  if (options.query) query = query.ilike('name', `%${options.query}%`);

  const { data, count } = await query.order('member_count', { ascending: false }).range(offset, offset + limit - 1);
  return { data: (data ?? []) as Club[], total: count ?? 0 };
}

export async function getClubBySlug(slug: string): Promise<Club | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('clubs').select('*').eq('slug', slug).maybeSingle();
  return data as Club | null;
}

export async function createClub(input: ClubInsert): Promise<Club | null> {
  const canCreate = await hasSignedDeclaration(input.founder_id!);
  if (!canCreate) return null;
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('clubs') as any).insert(input).select().maybeSingle();
  return data as Club | null;
}

export async function updateClub(slug: string, updates: ClubUpdate): Promise<Club | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('clubs') as any).update(updates).eq('slug', slug).select().maybeSingle();
  return data as Club | null;
}

export async function listKalyanmitraGroups(options: ListClubsOptions = {}): Promise<{ data: KalyanmitraGroup[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;

  let query = supabase.from('kalyanmitra_groups').select('*', { count: 'exact' });
  if (options.verifiedOnly) query = query.eq('verification_status', 'verified');
  if (options.query) query = query.ilike('name', `%${options.query}%`);

  const { data, count } = await query.order('member_count', { ascending: false }).range(offset, offset + limit - 1);
  return { data: (data ?? []) as KalyanmitraGroup[], total: count ?? 0 };
}

export async function getKalyanmitraGroupBySlug(slug: string): Promise<KalyanmitraGroup | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('kalyanmitra_groups').select('*').eq('slug', slug).maybeSingle();
  return data as KalyanmitraGroup | null;
}

export async function createKalyanmitraGroup(input: KalyanmitraGroupInsert): Promise<KalyanmitraGroup | null> {
  const canCreate = await hasSignedDeclaration(input.founder_id!);
  if (!canCreate) return null;
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('kalyanmitra_groups') as any).insert(input).select().maybeSingle();
  return data as KalyanmitraGroup | null;
}

export async function updateKalyanmitraGroup(slug: string, updates: KalyanmitraGroupUpdate): Promise<KalyanmitraGroup | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('kalyanmitra_groups') as any).update(updates).eq('slug', slug).select().maybeSingle();
  return data as KalyanmitraGroup | null;
}
