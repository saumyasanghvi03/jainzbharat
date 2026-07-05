import { getSupabaseServerClient } from '../server';
import type { Achievement, AchievementInsert, AchievementType } from '../types';

export async function listAchievements(profileId?: string): Promise<Achievement[]> {
  const supabase = getSupabaseServerClient();
  let query = supabase.from('achievements').select('*').order('awarded_at', { ascending: false });
  if (profileId) query = query.eq('profile_id', profileId);
  const { data } = await query;
  return (data ?? []) as Achievement[];
}

export async function createAchievement(input: AchievementInsert): Promise<Achievement | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('achievements') as any).insert(input).select().maybeSingle();
  return data as Achievement | null;
}

export async function getAchievementsTotalPoints(profileId: string): Promise<number> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('achievements').select('points').eq('profile_id', profileId);
  const rows = (data ?? []) as Pick<Achievement, 'points'>[];
  return rows.reduce((sum, r) => sum + r.points, 0);
}
