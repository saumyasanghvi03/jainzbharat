import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getDiaryEntry, updateDiaryEntry, softDeleteDiaryEntry, getProfileByClerkId } from '@/lib/supabase/repositories';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const { id } = await params;
  const entry = await getDiaryEntry(id, profile.id);
  if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ entry });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const { id } = await params;
  const body = await request.json();
  const entry = await updateDiaryEntry(id, profile.id, body);
  if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ entry });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const { id } = await params;
  const ok = await softDeleteDiaryEntry(id, profile.id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ success: true });
}
