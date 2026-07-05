import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { listDiaryEntries, createDiaryEntry, getProfileByClerkId } from '@/lib/supabase/repositories';

export async function GET(request: Request) {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const options = {
    profileId: profile.id,
    limit: Number(searchParams.get('limit')) || 30,
    offset: Number(searchParams.get('offset')) || 0,
    journalType: searchParams.get('journalType') || undefined,
    mood: searchParams.get('mood') || undefined,
    tags: searchParams.get('tags')?.split(',').filter(Boolean),
    query: searchParams.get('query') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
  };

  const result = await listDiaryEntries(options);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const body = await request.json();
  const entry = await createDiaryEntry({ ...body, profile_id: profile.id });
  if (!entry) return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });

  return NextResponse.json({ entry });
}
