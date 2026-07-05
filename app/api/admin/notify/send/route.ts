import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createNotification } from '@/lib/supabase/repositories/notifications';
import { getProfileByClerkId } from '@/lib/supabase/repositories/profiles';

const ADMIN_USER_ID = process.env.ADMIN_CLERK_USER_ID ?? '';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await getProfileByClerkId(session.userId);
  const isSuperAdmin = ADMIN_USER_ID ? session.userId === ADMIN_USER_ID : false;
  const isRoleAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  if (!isSuperAdmin && !isRoleAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { profileId, title, body: notifBody } = body;

  if (!profileId || !title) {
    return NextResponse.json({ error: 'Missing profileId or title' }, { status: 400 });
  }

  try {
    const notif = await createNotification({
      profile_id: profileId,
      notification_type: 'system',
      title,
      body: notifBody ?? null,
    });
    return NextResponse.json({ success: true, notification: notif });
  } catch {
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
