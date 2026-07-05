import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getProfileByClerkId } from '@/lib/supabase/repositories/profiles';

const ADMIN_USER_ID = process.env.ADMIN_CLERK_USER_ID ?? '';

export async function GET() {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ isAdmin: false, error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await getProfileByClerkId(session.userId);
  const isSuperAdmin = ADMIN_USER_ID ? session.userId === ADMIN_USER_ID : false;
  const isRoleAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  const isAdmin = isSuperAdmin || isRoleAdmin;

  return NextResponse.json({
    isAdmin,
    profile: profile ? { role: profile.role, display_name: profile.display_name } : null,
  });
}
