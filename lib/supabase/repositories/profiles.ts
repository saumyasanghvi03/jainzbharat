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

export async function getProfileEditCooldown(clerkUserId: string): Promise<{ canEdit: boolean; remainingDays: number; nextEditAt: string | null }> {
  const supabase = getSupabaseAdminClient();
  const { data } = await (supabase.from('profiles') as any).select('profile_edited_at').eq('clerk_user_id', clerkUserId).maybeSingle();
  if (!data?.profile_edited_at) {
    return { canEdit: true, remainingDays: 0, nextEditAt: null };
  }
  const lastEdit = new Date(data.profile_edited_at);
  const nextAllowed = new Date(lastEdit.getTime() + 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  if (now >= nextAllowed) {
    return { canEdit: true, remainingDays: 0, nextEditAt: null };
  }
  const remainingMs = nextAllowed.getTime() - now.getTime();
  const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
  return { canEdit: false, remainingDays, nextEditAt: nextAllowed.toISOString() };
}

export async function updateProfileWithCooldown(clerkUserId: string, updates: Record<string, unknown>): Promise<{ data: Profile | null; error: string | null }> {
  const { canEdit, remainingDays, nextEditAt } = await getProfileEditCooldown(clerkUserId);
  if (!canEdit) {
    return { data: null, error: `Profile can be edited again in ${remainingDays} day(s). Next edit available at ${nextEditAt}.` };
  }
  const now = new Date().toISOString();
  const data = await updateProfile(clerkUserId, { ...updates, profile_edited_at: now });
  return { data, error: data ? null : 'Failed to update profile' };
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

export async function getAdminProfiles(): Promise<Pick<Profile, 'id' | 'display_name' | 'jainz_id' | 'role'>[]> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase.from('profiles').select('id, display_name, jainz_id, role').order('created_at', { ascending: true }).limit(200);
  return (data ?? []) as Pick<Profile, 'id' | 'display_name' | 'jainz_id' | 'role'>[];
}
