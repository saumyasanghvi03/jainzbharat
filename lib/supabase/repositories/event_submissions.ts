import { getSupabaseServerClient } from '../server';
import type { EventSubmission, EventSubmissionInsert, EventSubmissionUpdate } from '../types';

export interface ListEventSubmissionsOptions {
  limit?: number;
  offset?: number;
  status?: string;
  organizerId?: string;
}

export async function listEventSubmissions(options: ListEventSubmissionsOptions = {}): Promise<{ data: EventSubmission[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;

  let query = supabase.from('event_submissions').select('*', { count: 'exact' });
  if (options.status) query = query.eq('status', options.status);
  if (options.organizerId) query = query.eq('organizer_id', options.organizerId);

  const { data, count } = await query.order('starts_at', { ascending: true }).range(offset, offset + limit - 1);
  return { data: (data ?? []) as EventSubmission[], total: count ?? 0 };
}

export async function getEventSubmissionBySlug(slug: string): Promise<EventSubmission | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('event_submissions').select('*').eq('slug', slug).maybeSingle();
  return data as EventSubmission | null;
}

export async function createEventSubmission(input: EventSubmissionInsert): Promise<EventSubmission | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('event_submissions') as any).insert(input).select().maybeSingle();
  return data as EventSubmission | null;
}

export async function updateEventSubmission(slug: string, updates: EventSubmissionUpdate): Promise<EventSubmission | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('event_submissions') as any).update(updates).eq('slug', slug).select().maybeSingle();
  return data as EventSubmission | null;
}
