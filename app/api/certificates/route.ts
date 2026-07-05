import QRCode from 'qrcode';
import { NextResponse } from 'next/server';
import { parseJainZId } from '@/lib/jainz-id';
import { site } from '@/lib/site';
export async function GET(request: Request) { const url = new URL(request.url); const id = url.searchParams.get('jainzId') ?? 'JZB-2026-000001'; if (!parseJainZId(id)) return NextResponse.json({ error: 'Invalid JainZ ID' }, { status: 400 }); const verificationUrl = `${site.domain}/jainz/${id}`; const qrCode = await QRCode.toDataURL(verificationUrl); return NextResponse.json({ name: url.searchParams.get('name') ?? 'JainZBharat Member', jainzId: id, declarationVersion: 'v1.0', verificationUrl, qrCode }); }
