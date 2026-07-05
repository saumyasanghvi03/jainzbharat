import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getProfileByClerkId } from '@/lib/supabase/repositories/profiles';
import { createClub, createKalyanmitraGroup } from '@/lib/supabase/repositories/clubs';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found. Please complete your profile first.' }, { status: 400 });
  }

  const body = await request.json();
  const { type, name, description, mission, city, country, category } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

  if (type === 'kalyanmitra') {
    const group = await createKalyanmitraGroup({
      name: name.trim(),
      slug,
      description: description || null,
      category: category || 'community_service',
      city: city || null,
      country: country || null,
      founder_id: profile.id,
      member_count: 1,
    });
    if (!group) {
      return NextResponse.json({ error: 'You must sign the Founding Declaration before creating a group.' }, { status: 403 });
    }
    return NextResponse.json({ data: group });
  }

  const club = await createClub({
    name: name.trim(),
    slug,
    description: description || null,
    mission: mission || null,
    founder_id: profile.id,
    member_count: 1,
    privacy: 'public',
  } as any);
  if (!club) {
    return NextResponse.json({ error: 'You must sign the Founding Declaration before creating a club.' }, { status: 403 });
  }
  return NextResponse.json({ data: club });
}
