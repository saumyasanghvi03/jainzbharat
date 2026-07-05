import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getDiaryStats, getProfileByClerkId } from '@/lib/supabase/repositories';

export async function GET() {
  const session = await auth();
  if (!session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfileByClerkId(session.userId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const stats = await getDiaryStats(profile.id);
  const total = stats.reduce((sum, s) => sum + s.count, 0);
  const streak = calculateStreak(stats);
  const currentStreak = calculateCurrentStreak(stats);

  return NextResponse.json({ stats, total, streak, currentStreak });
}

function calculateStreak(stats: { date: string; count: number }[]): number {
  if (stats.length === 0) return 0;
  const dates = stats.map(s => s.date).sort().reverse();
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function calculateCurrentStreak(stats: { date: string; count: number }[]): number {
  if (stats.length === 0) return 0;
  const dates = stats.map(s => s.date).sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  if (dates[0] !== today && dates[0] !== getYesterday()) return 0;
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
