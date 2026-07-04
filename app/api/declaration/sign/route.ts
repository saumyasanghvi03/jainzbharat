import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { signatureSchema } from '@/lib/declaration';
import { rateLimit } from '@/lib/security';

export async function POST(request: Request) {
  const { userId } = await auth();
  const key = userId ?? request.headers.get('x-forwarded-for') ?? 'anonymous';
  const limited = rateLimit(`sign:${key}`, 10);
  if (!limited.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  const parsed = signatureSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid signature', issues: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json({ accepted: true, signature: { ...parsed.data, userId, timestamp: new Date().toISOString() } }, { status: 201 });
}
