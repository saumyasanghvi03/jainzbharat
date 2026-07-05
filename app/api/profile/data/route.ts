import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getProfileByClerkId } from '@/lib/supabase/repositories/profiles';

export async function GET() {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await getProfileByClerkId(session.userId);
  return NextResponse.json({ profile });
}
