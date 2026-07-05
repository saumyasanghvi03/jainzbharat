import { NextResponse } from 'next/server';
import { listOrganizations } from '@/lib/supabase/repositories/organizations';

export async function GET() {
  try {
    const { data } = await listOrganizations({ verifiedOnly: false, limit: 100 });
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch organizations', data: [] }, { status: 500 });
  }
}
