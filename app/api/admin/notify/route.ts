import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminProfiles } from '@/lib/supabase/repositories/profiles';

const ADMIN_USER_ID = process.env.ADMIN_CLERK_USER_ID ?? '';

export async function GET() {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = ADMIN_USER_ID ? session.userId === ADMIN_USER_ID : false;
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const profiles = await getAdminProfiles();
    return NextResponse.json({ profiles });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
