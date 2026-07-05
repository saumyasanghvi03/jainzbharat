import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { listDiaryEntries, getProfileByClerkId } from '@/lib/supabase/repositories';

export async function GET(request: Request) {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const format = new URL(request.url).searchParams.get('format') || 'json';
  const { data } = await listDiaryEntries({ profileId: profile.id, limit: 10000 });

  if (format === 'csv') {
    const headers = 'title,entry_date,journal_type,mood,tags,privacy,is_highlight\n';
    const rows = data.map(e =>
      `"${(e.title ?? '').replace(/"/g, '""')}","${e.entry_date}","${e.journal_type}","${e.mood ?? ''}","${e.tags.join(';')}","${e.privacy}","${e.is_highlight}"`
    ).join('\n');
    return new NextResponse(headers + rows, {
      headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="diary-export.csv"' },
    });
  }

  return NextResponse.json({ entries: data });
}
