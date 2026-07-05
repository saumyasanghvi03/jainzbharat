import { getSupabaseServerClient } from '../server';
import type { Notification, NotificationInsert, NotificationType } from '../types';

export async function listNotifications(profileId: string, unreadOnly = false, limit = 50, offset = 0): Promise<{ data: Notification[]; unreadCount: number }> {
  const supabase = getSupabaseServerClient();

  let query = supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('profile_id', profileId);

  if (unreadOnly) query = query.eq('read', false);

  const { data, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', profileId)
    .eq('read', false);

  return { data: (data ?? []) as Notification[], unreadCount: unreadCount ?? 0 };
}

export async function createNotification(input: NotificationInsert): Promise<Notification | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('notifications') as any).insert(input).select().maybeSingle();
  return data as Notification | null;
}

export async function markAsRead(ids: string[]): Promise<void> {
  const supabase = getSupabaseServerClient();
  await (supabase.from('notifications') as any).update({ read: true }).in('id', ids);
}

export async function markAllAsRead(profileId: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  await (supabase.from('notifications') as any).update({ read: true }).eq('profile_id', profileId).eq('read', false);
}
