import {
  listNotifications,
  createNotification as createNotifRepo,
  markAsRead,
  markAllAsRead,
} from '../repositories/notifications';
import type { Notification, NotificationInsert } from '../types';

export async function getNotifications(profileId: string, unreadOnly = false): Promise<{ data: Notification[]; unreadCount: number }> {
  return listNotifications(profileId, unreadOnly);
}

export async function sendNotification(input: NotificationInsert): Promise<Notification | null> {
  return createNotifRepo(input);
}

export async function dismissNotifications(ids: string[]): Promise<void> {
  await markAsRead(ids);
}

export async function dismissAll(profileId: string): Promise<void> {
  await markAllAsRead(profileId);
}
