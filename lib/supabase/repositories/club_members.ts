import { getSupabaseServerClient } from '../server';
import type { ClubMember, ClubMemberInsert, ClubMemberUpdate, KalyanmitraMember, KalyanmitraMemberInsert, KalyanmitraMemberUpdate } from '../types';

export async function listClubMembers(clubId: string): Promise<ClubMember[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('club_members').select('*').eq('club_id', clubId).order('joined_at', { ascending: true });
  return (data ?? []) as ClubMember[];
}

export async function getClubMember(clubId: string, profileId: string): Promise<ClubMember | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('club_members').select('*').eq('club_id', clubId).eq('profile_id', profileId).maybeSingle();
  return data as ClubMember | null;
}

export async function joinClub(input: ClubMemberInsert): Promise<ClubMember | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('club_members') as any).insert(input).select().maybeSingle();
  return data as ClubMember | null;
}

export async function updateClubMembership(clubId: string, profileId: string, updates: ClubMemberUpdate): Promise<ClubMember | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('club_members') as any).update(updates).eq('club_id', clubId).eq('profile_id', profileId).select().maybeSingle();
  return data as ClubMember | null;
}

export async function removeClubMember(clubId: string, profileId: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase.from('club_members').delete().eq('club_id', clubId).eq('profile_id', profileId);
}

export async function listKalyanmitraMembers(groupId: string): Promise<KalyanmitraMember[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('kalyanmitra_members').select('*').eq('group_id', groupId).order('joined_at', { ascending: true });
  return (data ?? []) as KalyanmitraMember[];
}

export async function getKalyanmitraMember(groupId: string, profileId: string): Promise<KalyanmitraMember | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('kalyanmitra_members').select('*').eq('group_id', groupId).eq('profile_id', profileId).maybeSingle();
  return data as KalyanmitraMember | null;
}

export async function joinKalyanmitraGroup(input: KalyanmitraMemberInsert): Promise<KalyanmitraMember | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('kalyanmitra_members') as any).insert(input).select().maybeSingle();
  return data as KalyanmitraMember | null;
}

export async function updateKalyanmitraMembership(groupId: string, profileId: string, updates: KalyanmitraMemberUpdate): Promise<KalyanmitraMember | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('kalyanmitra_members') as any).update(updates).eq('group_id', groupId).eq('profile_id', profileId).select().maybeSingle();
  return data as KalyanmitraMember | null;
}

export async function removeKalyanmitraMember(groupId: string, profileId: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase.from('kalyanmitra_members').delete().eq('group_id', groupId).eq('profile_id', profileId);
}
