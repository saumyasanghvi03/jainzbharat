import { auth, verifyToken } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getProfileByClerkId } from '@/lib/supabase/repositories/profiles';
import { hasSignedDeclaration } from '@/lib/supabase/repositories/clubs';

async function resolveUserId(request: NextRequest): Promise<string | null> {
  const { userId } = await auth();
  if (userId) return userId;
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const payload = await verifyToken(authHeader.slice(7), { secretKey: process.env.CLERK_SECRET_KEY });
      return payload.sub ?? null;
    } catch { return null; }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const userId = await resolveUserId(request);
  if (!userId) {
    return NextResponse.json({ canCreate: false, error: 'Not authenticated' });
  }

  const profile = await getProfileByClerkId(userId);
  if (!profile) {
    return NextResponse.json({ canCreate: false, error: 'No profile' });
  }

  const signed = await hasSignedDeclaration(profile.id);
  return NextResponse.json({ canCreate: signed });
}
