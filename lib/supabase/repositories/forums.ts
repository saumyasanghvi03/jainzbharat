import { getSupabaseServerClient } from '../server';
import type { ForumCategory, ForumCategoryInsert, ForumCategoryUpdate, ForumTopic, ForumTopicInsert, ForumTopicUpdate, ForumPost, ForumPostInsert, ForumPostUpdate, ForumLike, ForumLikeInsert } from '../types';

export async function listForumCategories(): Promise<ForumCategory[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('forum_categories').select('*').order('sort_order', { ascending: true });
  return (data ?? []) as ForumCategory[];
}

export async function getForumCategoryBySlug(slug: string): Promise<ForumCategory | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('forum_categories').select('*').eq('slug', slug).maybeSingle();
  return data as ForumCategory | null;
}

export async function createForumCategory(input: ForumCategoryInsert): Promise<ForumCategory | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('forum_categories') as any).insert(input).select().maybeSingle();
  return data as ForumCategory | null;
}

export async function updateForumCategory(slug: string, updates: ForumCategoryUpdate): Promise<ForumCategory | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('forum_categories') as any).update(updates).eq('slug', slug).select().maybeSingle();
  return data as ForumCategory | null;
}

export async function listForumTopics(categoryId: string, options: { limit?: number; offset?: number } = {}): Promise<{ data: ForumTopic[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;

  const { data, count } = await supabase
    .from('forum_topics')
    .select('*', { count: 'exact' })
    .eq('category_id', categoryId)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  return { data: (data ?? []) as ForumTopic[], total: count ?? 0 };
}

export async function getForumTopicBySlug(slug: string, categoryId: string): Promise<ForumTopic | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('forum_topics').select('*').eq('slug', slug).eq('category_id', categoryId).maybeSingle();
  return data as ForumTopic | null;
}

export async function createForumTopic(input: ForumTopicInsert): Promise<ForumTopic | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('forum_topics') as any).insert(input).select().maybeSingle();
  return data as ForumTopic | null;
}

export async function updateForumTopic(id: string, updates: ForumTopicUpdate): Promise<ForumTopic | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('forum_topics') as any).update(updates).eq('id', id).select().maybeSingle();
  return data as ForumTopic | null;
}

export async function listForumPosts(topicId: string): Promise<ForumPost[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('forum_posts').select('*').eq('topic_id', topicId).order('created_at', { ascending: true });
  return (data ?? []) as ForumPost[];
}

export async function createForumPost(input: ForumPostInsert): Promise<ForumPost | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('forum_posts') as any).insert(input).select().maybeSingle();
  return data as ForumPost | null;
}

export async function updateForumPost(id: string, updates: ForumPostUpdate): Promise<ForumPost | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('forum_posts') as any).update(updates).eq('id', id).select().maybeSingle();
  return data as ForumPost | null;
}

export async function getForumLike(postId: string, profileId: string): Promise<ForumLike | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('forum_likes').select('*').eq('post_id', postId).eq('profile_id', profileId).maybeSingle();
  return data as ForumLike | null;
}

export async function createForumLike(input: ForumLikeInsert): Promise<ForumLike | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('forum_likes') as any).insert(input).select().maybeSingle();
  return data as ForumLike | null;
}

export async function removeForumLike(postId: string, profileId: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase.from('forum_likes').delete().eq('post_id', postId).eq('profile_id', profileId);
}
