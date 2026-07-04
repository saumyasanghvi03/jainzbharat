import { site } from '@/lib/site';
export function GET() { return Response.json({ '@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: site.domain, description: site.description }); }
