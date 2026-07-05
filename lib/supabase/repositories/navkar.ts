import { getSupabaseServerClient } from '../server';

export interface NavkarAggregate {
  country: string | null;
  city: string | null;
  total_count: number;
  unique_users: number;
}

export async function recordNavkarEntry(profileId: string | null, count: number, city: string | null, country: string | null, isAnonymous: boolean): Promise<void> {
  const supabase = getSupabaseServerClient();
  await (supabase.from('navkar_entries') as any).insert({ profile_id: profileId, count, city, country, is_anonymous: isAnonymous });
}

export async function getNavkarAggregates(options?: { country?: string; city?: string; fromDate?: string; toDate?: string }): Promise<NavkarAggregate[]> {
  const supabase = getSupabaseServerClient();
  let query = supabase.from('navkar_entries').select('country, city, count, profile_id').eq('is_anonymous', true);

  if (options?.country) query = query.eq('country', options.country);
  if (options?.city) query = query.eq('city', options.city);
  if (options?.fromDate) query = query.gte('recorded_at', options.fromDate);
  if (options?.toDate) query = query.lte('recorded_at', options.toDate);

  const { data } = await query;
  if (!data) return [];

  const aggregates = new Map<string, NavkarAggregate>();
  for (const row of data as any[]) {
    const key = `${row.country ?? 'unknown'}-${row.city ?? 'unknown'}`;
    const existing = aggregates.get(key) ?? { country: row.country, city: row.city, total_count: 0, unique_users: 0 };
    existing.total_count += row.count;
    aggregates.set(key, existing);
  }

  return Array.from(aggregates.values()).sort((a, b) => b.total_count - a.total_count);
}

export async function getGlobalNavkarStats(): Promise<{ total_count: number; unique_users: number }> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('navkar_entries').select('count, profile_id').eq('is_anonymous', true);
  const rows = (data ?? []) as any[];
  const uniqueProfiles = new Set(rows.map((r: any) => r.profile_id).filter(Boolean));
  const totalCount = rows.reduce((sum: number, r: any) => sum + r.count, 0);
  return { total_count: totalCount, unique_users: uniqueProfiles.size };
}
