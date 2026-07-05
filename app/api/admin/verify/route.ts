import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getProfileByClerkId } from '@/lib/supabase/repositories/profiles';
import { updateClub, updateKalyanmitraGroup } from '@/lib/supabase/repositories/clubs';
import { updateOrganization } from '@/lib/supabase/repositories/organizations';
import { updateEventSubmission } from '@/lib/supabase/repositories/event_submissions';

const ADMIN_USER_ID = process.env.ADMIN_CLERK_USER_ID ?? '';

async function isAdmin(clerkUserId: string): Promise<boolean> {
  if (ADMIN_USER_ID && clerkUserId === ADMIN_USER_ID) return true;
  const profile = await getProfileByClerkId(clerkUserId);
  return profile?.role === 'admin' || profile?.role === 'super_admin';
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = await isAdmin(session.userId);
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { entity, slug, action, updates } = body;

  if (!entity || !slug || !action) {
    return NextResponse.json({ error: 'Missing entity, slug, or action' }, { status: 400 });
  }

  const status = action === 'verify' ? 'verified' : action === 'reject' ? 'rejected' : undefined;
  if (!status) {
    return NextResponse.json({ error: 'Invalid action. Use verify or reject.' }, { status: 400 });
  }

  try {
    switch (entity) {
      case 'club':
        await updateClub(slug, { verification_status: status as any, ...updates });
        break;
      case 'kalyanmitra':
        await updateKalyanmitraGroup(slug, { verification_status: status as any, ...updates });
        break;
      case 'organization':
        await updateOrganization(slug, { verification_status: status as any, ...updates });
        break;
      case 'event':
        await updateEventSubmission(slug, { status: action === 'verify' ? 'approved' : 'cancelled' as any, ...updates });
        break;
      default:
        return NextResponse.json({ error: 'Unknown entity type' }, { status: 400 });
    }
    return NextResponse.json({ success: true, entity, slug, status });
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
