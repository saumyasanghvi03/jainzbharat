import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { getProfileByClerkId } from '@/lib/supabase/repositories/profiles';

const ADMIN_USER_ID = process.env.ADMIN_CLERK_USER_ID ?? '';

export async function POST() {
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

  try {
    const supabase = getSupabaseAdminClient();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (profile.jainz_id === 'JZB-2026-000001') {
      return NextResponse.json({ message: 'You already have JainZ ID 001', jainz_id: profile.jainz_id });
    }

    const { data: existing } = await supabase.from('profiles').select('id').eq('jainz_id', 'JZB-2026-000001').maybeSingle();
    if (existing) {
      return NextResponse.json({ error: 'JainZ ID 001 is already assigned to another profile' }, { status: 409 });
    }

    const { data: updated, error } = await (supabase.from('profiles') as any).update({ jainz_id: 'JZB-2026-000001' }).eq('id', profile.id).select().maybeSingle();

    if (error || !updated) {
      return NextResponse.json({ error: 'Failed to assign JainZ ID 001' }, { status: 500 });
    }

    return NextResponse.json({ message: 'JainZ ID 001 assigned successfully', jainz_id: updated.jainz_id });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
