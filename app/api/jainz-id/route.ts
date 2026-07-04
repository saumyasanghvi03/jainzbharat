import { NextResponse } from 'next/server';
import { formatJainZId } from '@/lib/jainz-id';
export async function GET() { return NextResponse.json({ example: formatJainZId(1, 2026), generation: 'PostgreSQL sequence in db/migrations guarantees uniqueness under concurrency.' }); }
