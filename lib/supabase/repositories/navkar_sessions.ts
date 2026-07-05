import { getSupabaseServerClient } from '../server';
import type { NavkarSession, NavkarSessionInsert } from '../types';

export interface NavkarSessionAggregate {
  total_count: number;
  total_sessions: number;
  total_duration_seconds: number | null;
}

export async function listNavkarSessions(profileId: string, limit = 50, offset = 0): Promise<NavkarSession[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from('navkar_sessions')
    .select('*')
    .eq('profile_id', profileId)
    .order('recorded_at', { ascending: false })
    .range(offset, offset + limit - 1);
  return (data ?? []) as NavkarSession[];
}

export async function createNavkarSession(input: NavkarSessionInsert): Promise<NavkarSession | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('navkar_sessions') as any).insert(input).select().maybeSingle();
  return data as NavkarSession | null;
}

export async function getNavkarSessionAggregates(profileId: string): Promise<NavkarSessionAggregate> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('navkar_sessions').select('count, duration_seconds').eq('profile_id', profileId);
  const rows = (data ?? []) as Pick<NavkarSession, 'count' | 'duration_seconds'>[];
  const totalCount = rows.reduce((sum, r) => sum + r.count, 0);
  const durations = rows.filter(r => r.duration_seconds != null).map(r => r.duration_seconds!);
  const totalDuration = durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) : null;
  return { total_count: totalCount, total_sessions: rows.length, total_duration_seconds: totalDuration };
}
