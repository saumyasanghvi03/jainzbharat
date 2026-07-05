import {
  listBadges,
  awardBadge as awardBadgeRepo,
  removeBadge,
} from '../repositories/badges';
import { createNotification } from '../repositories/notifications';
import { createAchievement } from '../repositories/achievements';
import type { Badge, BadgeInsert, BadgeType } from '../types';

export async function awardBadgeWithNotification(input: BadgeInsert): Promise<Badge | null> {
  const badge = await awardBadgeRepo(input);
  if (badge) {
    await createNotification({
      profile_id: input.profile_id,
      notification_type: 'badge_earned',
      title: `Badge Earned: ${input.name}`,
      body: input.description ?? `You earned the "${input.name}" badge.`,
      link: `/badges`,
    });

    await createAchievement({
      profile_id: input.profile_id,
      achievement_type: 'badge',
      name: input.name,
      description: input.description ?? undefined,
      points: 25,
    });
  }
  return badge;
}

export async function getUserBadges(profileId: string): Promise<Badge[]> {
  return listBadges(profileId);
}

export async function hasBadge(profileId: string, badgeType: BadgeType): Promise<boolean> {
  const badges = await listBadges(profileId);
  return badges.some(b => b.badge_type === badgeType);
}
