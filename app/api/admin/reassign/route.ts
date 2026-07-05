import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { getProfileByClerkId } from '@/lib/supabase/repositories/profiles';
import { createNotification } from '@/lib/supabase/repositories/notifications';

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
  const { targetProfileId, newJainzId, message } = body;

  if (!targetProfileId || !newJainzId) {
    return NextResponse.json({ error: 'Missing targetProfileId or newJainzId' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdminClient();

    const { data: target } = await (supabase.from('profiles') as any).select('id, jainz_id, display_name').eq('id', targetProfileId).maybeSingle();
    if (!target) {
      return NextResponse.json({ error: 'Target profile not found' }, { status: 404 });
    }

    const oldId = target.jainz_id;

    const { data: existing } = await (supabase.from('profiles') as any).select('id').eq('jainz_id', newJainzId).maybeSingle();
    if (existing) {
      await (supabase.from('profiles') as any).update({ jainz_id: oldId }).eq('id', existing.id);
      await createNotification({
        profile_id: existing.id,
        notification_type: 'system',
        title: 'JainZ ID Reassigned',
        body: `Your JainZ ID has changed from ${newJainzId} to ${oldId} due to admin reassignment.`,
      });
    }

    const { error: updateErr } = await (supabase.from('profiles') as any).update({ jainz_id: newJainzId }).eq('id', targetProfileId);
    if (updateErr) {
      return NextResponse.json({ error: 'Failed to reassign ID' }, { status: 500 });
    }

    await createNotification({
      profile_id: targetProfileId,
      notification_type: 'system',
      title: 'JainZ ID Updated',
      body: message ?? `Your JainZ ID has been updated from ${oldId} to ${newJainzId}.`,
    });

    const notifyBody = body.notifyOthers ?? [];
    if (Array.isArray(notifyBody)) {
      for (const pid of notifyBody) {
        if (pid !== targetProfileId) {
          await createNotification({
            profile_id: pid,
            notification_type: 'system',
            title: 'Platform Update',
            body: message ?? 'JainZ IDs have been reorganized by the admin. Your JainZ ID remains unchanged.',
          });
        }
      }
    }

    return NextResponse.json({ success: true, oldId, newJainzId, profile: target.display_name });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
