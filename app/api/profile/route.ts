import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getProfileEditCooldown, updateProfileWithCooldown } from '@/lib/supabase/repositories/profiles';

export async function PUT(request: Request) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const allowedFields = ['display_name', 'bio', 'country', 'city', 'profession', 'company', 'languages', 'skills', 'links'];
  const updates: Record<string, unknown> = {};

  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { data, error } = await updateProfileWithCooldown(session.userId, updates);
  if (error) {
    return NextResponse.json({ error }, { status: 429 });
  }

  return NextResponse.json({ profile: data });
}

export async function GET() {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cooldown = await getProfileEditCooldown(session.userId);
  return NextResponse.json(cooldown);
}
