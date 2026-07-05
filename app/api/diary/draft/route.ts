import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { saveDraft, updateDraft, getDrafts, deleteDraft, getProfileByClerkId } from '@/lib/supabase/repositories';

export async function GET() {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const drafts = await getDrafts(profile.id);
  return NextResponse.json({ drafts });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const body = await request.json();
  if (body.id) {
    const ok = await updateDraft(body.id, profile.id, body);
    return NextResponse.json({ success: ok });
  }
  const draft = await saveDraft({ ...body, profile_id: profile.id });
  return NextResponse.json({ draft });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Draft ID required' }, { status: 400 });

  const ok = await deleteDraft(id, profile.id);
  return NextResponse.json({ success: ok });
}
