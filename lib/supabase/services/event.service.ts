import {
  listEvents,
  getEventBySlug,
  createEvent as createEventRepo,
} from '../repositories';
import {
  registerForEvent,
  updateRegistration,
  getRegistrationCount,
} from '../repositories/event_registrations';
import { createNotification } from '../repositories/notifications';
import { createAuditLog } from '../repositories/audit_logs';
import type { EventInsert, EventRegistrationInsert } from '../types';

export async function createEventWithNotifications(profileId: string, input: EventInsert): Promise<EventInsert | null> {
  const event = await createEventRepo({ ...input, organizer_profile_id: profileId });
  if (event) {
    await createAuditLog({
      profile_id: profileId,
      action: 'event_created',
      entity_type: 'events',
      entity_id: event.id,
      changes: { title: input.title, slug: input.slug } as any,
    });
  }
  return event;
}

export async function registerWithConfirmation(profileId: string, input: EventRegistrationInsert): Promise<EventRegistrationInsert | null> {
  const event = await getEventBySlug(input.event_id);
  if (!event) throw new Error('Event not found');

  const count = await getRegistrationCount(input.event_id);
  if (event.capacity && count >= event.capacity) {
    throw new Error('Event is at full capacity');
  }

  const registration = await registerForEvent(input);
  if (registration) {
    await createNotification({
      profile_id: profileId,
      notification_type: 'event_reminder',
      title: `Registered for ${event.title}`,
      body: `You are registered for "${event.title}".`,
      link: `/events/${event.slug}`,
    });
  }
  return registration;
}
