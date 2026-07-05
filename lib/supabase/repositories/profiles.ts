import { getSupabaseAdminClient } from '../admin';
import type { Profile } from '../types';

export async function getProfileByClerkId(clerkUserId: string): Promise<Profile | null> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase.from('profiles').select('*').eq('clerk_user_id', clerkUserId).maybeSingle();
  return data as Profile | null;
}

export async function getProfileByJainzId(jainzId: string): Promise<Profile | null> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase.from('profiles').select('*').eq('jainz_id', jainzId).maybeSingle();
  return data as Profile | null;
}

export async function createProfile(clerkUserId: string, displayName: string): Promise<Profile | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from('profiles').insert({ clerk_user_id: clerkUserId, display_name: displayName, role: 'member' } as any).select().maybeSingle();
  if (error) {
    console.error('createProfile error:', JSON.stringify(error, null, 2));
    return null;
  }
  if (!data) {
    console.error('createProfile: no data returned, insert may have failed silently');
    return null;
  }
  return data as Profile | null;
}

export async function updateProfile(clerkUserId: string, updates: Record<string, unknown>): Promise<Profile | null> {
  const supabase = getSupabaseAdminClient();
  const { data } = await (supabase.from('profiles') as any).update({ updated_at: new Date().toISOString(), ...updates }).eq('clerk_user_id', clerkUserId).select().maybeSingle();
  return data as Profile | null;
}

export async function searchProfiles(query: string): Promise<Profile[]> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase.from('profiles').select('*').textSearch('profiles_search_idx', query, { type: 'websearch' } as any).limit(20);
  return (data ?? []) as Profile[];
}

export async function getProfilesByRole(role: Profile['role']): Promise<Profile[]> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase.from('profiles').select('*').eq('role', role).limit(50);
  return (data ?? []) as Profile[];
}
