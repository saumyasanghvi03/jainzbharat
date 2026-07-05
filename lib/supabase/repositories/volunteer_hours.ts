import { getSupabaseServerClient } from '../server';
import type { VolunteerHour, VolunteerHourInsert, VolunteerHourUpdate } from '../types';

export interface VolunteerHoursSummary {
  total_hours: number;
  verified_hours: number;
  pending_hours: number;
}

export async function listVolunteerHours(profileId: string, limit = 50, offset = 0): Promise<VolunteerHour[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from('volunteer_hours')
    .select('*')
    .eq('profile_id', profileId)
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1);
  return (data ?? []) as VolunteerHour[];
}

export async function getVolunteerHoursSummary(profileId: string): Promise<VolunteerHoursSummary> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('volunteer_hours').select('hours, verified').eq('profile_id', profileId);
  const rows = (data ?? []) as Pick<VolunteerHour, 'hours' | 'verified'>[];
  const total = rows.reduce((sum, r) => sum + r.hours, 0);
  const verified = rows.filter(r => r.verified).reduce((sum, r) => sum + r.hours, 0);
  return { total_hours: total, verified_hours: verified, pending_hours: total - verified };
}

export async function createVolunteerHour(input: VolunteerHourInsert): Promise<VolunteerHour | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('volunteer_hours') as any).insert(input).select().maybeSingle();
  return data as VolunteerHour | null;
}

export async function updateVolunteerHour(id: string, updates: VolunteerHourUpdate): Promise<VolunteerHour | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('volunteer_hours') as any).update(updates).eq('id', id).select().maybeSingle();
  return data as VolunteerHour | null;
}
