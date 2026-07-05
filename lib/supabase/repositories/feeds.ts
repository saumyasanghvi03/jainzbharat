import { getSupabaseServerClient } from '../server';
import type { CommunityFeed, CommunityFeedInsert, CommunityFeedUpdate } from '../types';

export async function listFeeds(options: { limit?: number; offset?: number; feedType?: string } = {}): Promise<{ data: CommunityFeed[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;

  let query = supabase.from('community_feeds').select('*', { count: 'exact' });
  if (options.feedType) query = query.eq('feed_type', options.feedType);

  const { data, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
  return { data: (data ?? []) as CommunityFeed[], total: count ?? 0 };
}

export async function getUserFeeds(profileId: string, options: { limit?: number; offset?: number } = {}): Promise<{ data: CommunityFeed[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;

  const { data, count } = await supabase
    .from('community_feeds')
    .select('*', { count: 'exact' })
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  return { data: (data ?? []) as CommunityFeed[], total: count ?? 0 };
}

export async function createFeedItem(input: CommunityFeedInsert): Promise<CommunityFeed | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('community_feeds') as any).insert(input).select().maybeSingle();
  return data as CommunityFeed | null;
}

export async function updateFeedItem(id: string, updates: CommunityFeedUpdate): Promise<CommunityFeed | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('community_feeds') as any).update(updates).eq('id', id).select().maybeSingle();
  return data as CommunityFeed | null;
}

export async function deleteFeedItem(id: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase.from('community_feeds').delete().eq('id', id);
}
