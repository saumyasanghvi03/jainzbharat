import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { publishHighlight, unpublishHighlight, getProfileByClerkId } from '@/lib/supabase/repositories';

export async function PUT(request: Request) {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const { id, summary } = await request.json();
  if (!id) return NextResponse.json({ error: 'Entry ID required' }, { status: 400 });

  const entry = await publishHighlight(id, profile.id, summary ?? '');
  if (!entry) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });

  return NextResponse.json({ entry });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Entry ID required' }, { status: 400 });

  const entry = await unpublishHighlight(id, profile.id);
  if (!entry) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });

  return NextResponse.json({ entry });
}
