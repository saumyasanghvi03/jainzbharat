import { getSupabaseServerClient } from '../server';
import type { Badge, BadgeInsert, BadgeType } from '../types';

export async function listBadges(profileId?: string): Promise<Badge[]> {
  const supabase = getSupabaseServerClient();
  let query = supabase.from('badges').select('*').order('awarded_at', { ascending: false });
  if (profileId) query = query.eq('profile_id', profileId);
  const { data } = await query;
  return (data ?? []) as Badge[];
}

export async function getBadge(profileId: string, badgeType: BadgeType): Promise<Badge | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from('badges')
    .select('*')
    .eq('profile_id', profileId)
    .eq('badge_type', badgeType)
    .maybeSingle();
  return data as Badge | null;
}

export async function awardBadge(input: BadgeInsert): Promise<Badge | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('badges') as any).insert(input).select().maybeSingle();
  return data as Badge | null;
}

export async function removeBadge(profileId: string, badgeType: BadgeType): Promise<void> {
  const supabase = getSupabaseServerClient();
  await (supabase.from('badges') as any).delete().eq('profile_id', profileId).eq('badge_type', badgeType);
}
