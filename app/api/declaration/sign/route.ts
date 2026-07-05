import { auth, clerkClient, verifyToken } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { signatureSchema } from '@/lib/declaration';
import { rateLimit } from '@/lib/security';
import { getProfileByClerkId, createProfile } from '@/lib/supabase/repositories/profiles';
import { createSignature, getSignatureByProfileAndVersion, type CreateSignatureInput } from '@/lib/supabase/repositories/signatures';

async function resolveUserId(request: Request): Promise<string | null> {
  const { userId } = await auth();
  if (userId) return userId;
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const payload = await verifyToken(authHeader.slice(7), { secretKey: process.env.CLERK_SECRET_KEY });
      return payload.sub ?? null;
    } catch {
      return null;
    }
  }
  return null;
}

export async function POST(request: Request) {
  const userId = await resolveUserId(request);
  const key = userId ?? request.headers.get('x-forwarded-for') ?? 'anonymous';
  const limited = rateLimit(`sign:${key}`, 10);
  if (!limited.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  const parsed = signatureSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid signature', issues: parsed.error.flatten() }, { status: 400 });

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required to sign the declaration' }, { status: 401 });
  }

  let profile = await getProfileByClerkId(userId);

  if (!profile) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const displayName = user.fullName ?? user.username ?? user.emailAddresses[0]?.emailAddress ?? 'Member';
    try {
      profile = await createProfile(userId, displayName);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      console.error('createProfile threw:', msg);
      return NextResponse.json({ error: `Failed to create profile: ${msg}` }, { status: 500 });
    }
    if (!profile) {
      return NextResponse.json({ error: 'Failed to create profile (null returned)' }, { status: 500 });
    }
  }

  const existingSignature = await getSignatureByProfileAndVersion(profile.id, parsed.data.declarationVersion);
  if (existingSignature) {
    return NextResponse.json({
      accepted: true,
      alreadySigned: true,
      signature: {
        id: existingSignature.id,
        jainz_id: profile.jainz_id,
        declaration_version: existingSignature.declaration_version,
        signed_at: existingSignature.signed_at,
      },
    });
  }

  const signatureInput: CreateSignatureInput = {
    profile_id: profile.id,
    declaration_version: parsed.data.declarationVersion,
    country: parsed.data.country,
    city: parsed.data.city,
    profession: parsed.data.profession,
    organization: parsed.data.organization,
  };

  const signature = await createSignature(signatureInput);

  if (!signature) {
    return NextResponse.json({ error: 'Failed to create signature' }, { status: 500 });
  }

  return NextResponse.json({
    accepted: true,
    alreadySigned: false,
    signature: {
      id: signature.id,
      jainz_id: profile.jainz_id,
      display_name: profile.display_name,
      declaration_version: signature.declaration_version,
      signed_at: signature.signed_at,
    },
  }, { status: 201 });
}
