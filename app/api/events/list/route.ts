import { NextResponse } from 'next/server';
import { listEventSubmissions } from '@/lib/supabase/repositories/event_submissions';

export async function GET() {
  try {
    const { data } = await listEventSubmissions({ limit: 100 });
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch events', data: [] }, { status: 500 });
  }
}
