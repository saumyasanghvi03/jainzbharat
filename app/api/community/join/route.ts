import { auth, verifyToken } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getProfileByClerkId } from '@/lib/supabase/repositories/profiles';
import { getClubBySlug, getKalyanmitraGroupBySlug } from '@/lib/supabase/repositories/clubs';
import { joinClub, joinKalyanmitraGroup } from '@/lib/supabase/repositories/club_members';

async function resolveUserId(request: NextRequest): Promise<string | null> {
  const { userId } = await auth();
  if (userId) return userId;
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const payload = await verifyToken(authHeader.slice(7), { secretKey: process.env.CLERK_SECRET_KEY });
      return payload.sub ?? null;
    } catch { return null; }
  }
  return null;
}

export async function POST(request: NextRequest) {
  const userId = await resolveUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await getProfileByClerkId(userId);
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 400 });
  }

  const body = await request.json();
  const { id, type } = body;

  if (!id || !type) {
    return NextResponse.json({ error: 'Missing id or type' }, { status: 400 });
  }

  try {
    if (type === 'kalyanmitra') {
      const group = await getKalyanmitraGroupBySlug(id);
      if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 });
      await joinKalyanmitraGroup({
        group_id: group.id,
        profile_id: profile.id,
        role: 'member',
        status: 'pending',
      });
    } else {
      const club = await getClubBySlug(id);
      if (!club) return NextResponse.json({ error: 'Club not found' }, { status: 404 });
      await joinClub({
        club_id: club.id,
        profile_id: profile.id,
        role: 'member',
        status: 'pending',
      });
    }
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to join';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
