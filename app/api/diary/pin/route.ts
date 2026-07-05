import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getPinHash, checkPin, getProfileByClerkId, updateProfile } from '@/lib/supabase/repositories';

export async function PUT(request: Request) {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const { pin } = await request.json();
  if (!pin || pin.length < 4 || pin.length > 10) {
    return NextResponse.json({ error: 'PIN must be 4-10 characters' }, { status: 400 });
  }

  const hash = getPinHash(pin);
  const existingLinks = (profile.links ?? {}) as Record<string, unknown>;
  await updateProfile(session.userId, { links: { ...existingLinks, diary_pin: hash } } as any);

  return NextResponse.json({ success: true });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const { pin } = await request.json();
  if (!pin) return NextResponse.json({ error: 'PIN required' }, { status: 400 });

  const existingHash = ((profile.links ?? {}) as Record<string, unknown>).diary_pin as string | undefined;
  if (!existingHash) return NextResponse.json({ error: 'No PIN set' }, { status: 400 });

  const valid = checkPin(pin, existingHash);
  if (!valid) return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request) {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const existingLinks = (profile.links ?? {}) as Record<string, unknown>;
  const { diary_pin: _, ...rest } = existingLinks;
  await updateProfile(session.userId, { links: rest } as any);

  return NextResponse.json({ success: true });
}
