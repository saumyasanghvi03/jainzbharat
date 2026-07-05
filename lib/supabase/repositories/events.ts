import { getSupabaseServerClient } from '../server';
import type { Event } from '../types';

export interface ListEventsOptions {
  limit?: number;
  offset?: number;
  fromDate?: string;
  toDate?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function listEvents(options: ListEventsOptions = {}): Promise<{ data: Event[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;

  let query = supabase.from('events').select('*', { count: 'exact' });

  if (options.fromDate) query = query.gte('starts_at', options.fromDate);
  if (options.toDate) query = query.lte('ends_at', options.toDate);

  const { data, count } = await query.order('starts_at', { ascending: options?.sortOrder === 'asc' }).range(offset, offset + limit - 1);

  return { data: (data ?? []) as Event[], total: count ?? 0 };
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('events').select('*').eq('slug', slug).maybeSingle();
  return data as Event | null;
}

export async function createEvent(event: Record<string, unknown>): Promise<Event | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('events') as any).insert(event).select().maybeSingle();
  return data as Event | null;
}
