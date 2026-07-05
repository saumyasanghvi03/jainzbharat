import { site } from '@/lib/site';
export function GET() { const body = `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>JainZBharat</title><link>${site.domain}</link><description>${site.description}</description></channel></rss>`; return new Response(body, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } }); }
