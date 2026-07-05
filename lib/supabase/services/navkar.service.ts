import {
  recordNavkarEntry,
  getGlobalNavkarStats,
} from '../repositories';
import { createNavkarSession } from '../repositories/navkar_sessions';
import { awardBadge } from '../repositories/badges';
import { createAchievement } from '../repositories/achievements';
import { getSupabaseAdminClient } from '../admin';

export interface NavkarResult {
  entryCreated: boolean;
  sessionCreated: boolean;
  badgeAwarded: boolean;
  milestoneReached: boolean;
}

export async function performNavkar(
  profileId: string | null,
  count: number,
  city: string | null,
  country: string | null,
  isAnonymous: boolean
): Promise<NavkarResult> {
  let badgeAwarded = false;
  let milestoneReached = false;

  await recordNavkarEntry(profileId, count, city, country, isAnonymous);

  if (profileId && !isAnonymous) {
    const session = await createNavkarSession({
      profile_id: profileId,
      count,
    });
    if (!session) throw new Error('Failed to create navkar session');

    const admin = getSupabaseAdminClient();
    const { data: profile } = await admin
      .from('profiles')
      .select('navkar_count')
      .eq('id', profileId)
      .single();

    const totalCount = (profile as { navkar_count: number } | null)?.navkar_count ?? 0;
    const newTotal = totalCount + count;

    await (admin.from('profiles') as any).update({ navkar_count: newTotal }).eq('id', profileId);

    if (newTotal >= 1000) {
      const badge = await awardBadge({
        profile_id: profileId,
        badge_type: 'navkar_champion',
        name: 'Navkar Champion',
        description: 'Completed 1,000 Navkar recitations',
      });
      badgeAwarded = !!badge;
    }

    if (newTotal >= 100) {
      const achievement = await createAchievement({
        profile_id: profileId,
        achievement_type: 'milestone',
        name: '100 Navkar Milestone',
        description: 'Reached 100 total Navkar recitations',
        points: 10,
      });
      milestoneReached = !!achievement;
    }
  }

  return { entryCreated: true, sessionCreated: true, badgeAwarded, milestoneReached };
}
