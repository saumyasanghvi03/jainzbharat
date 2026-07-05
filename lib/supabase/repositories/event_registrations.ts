import { getSupabaseServerClient } from '../server';
import type { EventRegistration, EventRegistrationInsert, EventRegistrationUpdate, RegistrationStatus } from '../types';

export async function listEventRegistrations(eventId: string): Promise<EventRegistration[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('event_registrations').select('*').eq('event_id', eventId);
  return (data ?? []) as EventRegistration[];
}

export async function getEventRegistration(eventId: string, profileId: string): Promise<EventRegistration | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', eventId)
    .eq('profile_id', profileId)
    .maybeSingle();
  return data as EventRegistration | null;
}

export async function registerForEvent(input: EventRegistrationInsert): Promise<EventRegistration | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('event_registrations') as any).insert(input).select().maybeSingle();
  return data as EventRegistration | null;
}

export async function updateRegistration(id: string, updates: EventRegistrationUpdate): Promise<EventRegistration | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('event_registrations') as any).update(updates).eq('id', id).select().maybeSingle();
  return data as EventRegistration | null;
}

export async function getRegistrationCount(eventId: string, status?: RegistrationStatus): Promise<number> {
  const supabase = getSupabaseServerClient();
  let query = supabase.from('event_registrations').select('*', { count: 'exact', head: true }).eq('event_id', eventId);
  if (status) query = query.eq('status', status);
  const { count } = await query;
  return count ?? 0;
}
