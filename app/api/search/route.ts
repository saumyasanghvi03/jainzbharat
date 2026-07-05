import { NextResponse } from 'next/server';
import { searchPlatform } from '@/lib/search';
export function GET(request: Request) { const query = new URL(request.url).searchParams.get('q') ?? ''; return NextResponse.json({ query, results: searchPlatform(query) }); }
