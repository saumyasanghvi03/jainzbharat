import { getSupabaseServerClient } from '../server';
import type { Founder, FounderInsert, FounderUpdate } from '../types';

export async function listFounders(): Promise<Founder[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('founders').select('*').order('priority', { ascending: true });
  return (data ?? []) as Founder[];
}

export async function getFounderByProfile(profileId: string): Promise<Founder | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('founders').select('*').eq('profile_id', profileId).maybeSingle();
  return data as Founder | null;
}

export async function createFounder(input: FounderInsert): Promise<Founder | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('founders') as any).insert(input).select().maybeSingle();
  return data as Founder | null;
}

export async function updateFounder(profileId: string, updates: FounderUpdate): Promise<Founder | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('founders') as any).update(updates).eq('profile_id', profileId).select().maybeSingle();
  return data as Founder | null;
}
