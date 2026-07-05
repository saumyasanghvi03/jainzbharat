import {
  getProfileByClerkId,
  getProfileByJainzId,
  createProfile as createProfileRepo,
  updateProfile as updateProfileRepo,
  searchProfiles,
} from '../repositories';
import { createAuditLog } from '../repositories/audit_logs';
import { getSupabaseAdminClient } from '../admin';
import type { Profile } from '../types';

export async function getOrCreateProfile(clerkUserId: string, displayName: string): Promise<Profile> {
  let profile = await getProfileByClerkId(clerkUserId);
  if (!profile) {
    profile = await createProfileRepo(clerkUserId, displayName);
    if (!profile) throw new Error('Failed to create profile');
  }
  return profile;
}

export async function updateProfileWithAudit(clerkUserId: string, updates: Record<string, unknown>): Promise<Profile | null> {
  const profile = await updateProfileRepo(clerkUserId, updates);
  if (profile) {
    await createAuditLog({
      profile_id: profile.id,
      action: 'profile_updated',
      entity_type: 'profiles',
      entity_id: profile.id,
      changes: updates,
    });
  }
  return profile;
}

export async function searchProfilesWithBadges(query: string): Promise<(Profile & { badges: string[] })[]> {
  const profiles = await searchProfiles(query);
  const admin = getSupabaseAdminClient();
  const { data: badges } = await admin
    .from('badges')
    .select('profile_id, badge_type')
    .in('profile_id', profiles.map(p => p.id));

  const badgeMap = new Map<string, string[]>();
  for (const b of (badges ?? []) as { profile_id: string; badge_type: string }[]) {
    const list = badgeMap.get(b.profile_id) ?? [];
    list.push(b.badge_type);
    badgeMap.set(b.profile_id, list);
  }

  return profiles.map(p => ({ ...p, badges: badgeMap.get(p.id) ?? [] }));
}

export async function getProfileRanking(limit = 100): Promise<Profile[]> {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('contribution_score', { ascending: false })
    .limit(limit);
  return (data ?? []) as Profile[];
}
