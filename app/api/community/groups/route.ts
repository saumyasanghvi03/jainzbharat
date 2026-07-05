import { NextRequest, NextResponse } from 'next/server';
import { listClubs, listKalyanmitraGroups } from '@/lib/supabase/repositories/clubs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    if (type === 'kalyanmitra') {
      const { data } = await listKalyanmitraGroups({ verifiedOnly: false, limit: 100 });
      return NextResponse.json({ data });
    }
    const { data } = await listClubs({ verifiedOnly: false, limit: 100 });
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch groups', data: [] }, { status: 500 });
  }
}
