import Link from 'next/link';
import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { listSignatures } from '@/lib/supabase/repositories/signatures';
import { Users, Search, ArrowUpDown, ChevronLeft, ChevronRight, MapPin, Briefcase, Clock } from 'lucide-react';

export const metadata = { title: 'Digital Signing Wall' };
export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 24;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function buildQueryString(params: Record<string, string>): string {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) u.set(k, v); });
  const q = u.toString();
  return q ? `?${q}` : '';
}

export default async function SigningWallPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const search = typeof sp.search === 'string' ? sp.search : '';
  const country = typeof sp.country === 'string' ? sp.country : '';
  const profession = typeof sp.profession === 'string' ? sp.profession : '';
  const sortBy = (typeof sp.sortBy === 'string' && ['signed_at', 'display_name'].includes(sp.sortBy) ? sp.sortBy : 'signed_at') as 'signed_at' | 'display_name';
  const sortOrder = (typeof sp.sortOrder === 'string' && ['asc', 'desc'].includes(sp.sortOrder) ? sp.sortOrder : 'desc') as 'asc' | 'desc';

  const { data: signers, total } = await listSignatures({
    limit: ITEMS_PER_PAGE,
    offset: (page - 1) * ITEMS_PER_PAGE,
    search: search || undefined,
    country: country || undefined,
    profession: profession || undefined,
    sortBy,
    sortOrder,
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const currentParams = { search, country, profession, sortBy, sortOrder, page: String(page) };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-32 pt-24 md:px-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
        <Users className="size-4" />
        Digital Signing Wall
      </div>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-bold tracking-tight md:text-5xl">
        Permanent signatures for the <span className="text-primary">JainZBharat</span> Declaration.
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
        {total} signator{total !== 1 ? 'ies' : 'y'} and counting. Every signature creates a permanent record with a unique JainZ ID.
      </p>

      <form method="GET" action="/signing-wall" className="mt-8 rounded-3xl border border-white/10 bg-surface/50 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              name="search"
              placeholder="Search by name..."
              defaultValue={search}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <input type="hidden" name="sortBy" value={sortBy} />
            <input type="hidden" name="sortOrder" value={sortOrder} />
            {country && <input type="hidden" name="country" value={country} />}
            {profession && <input type="hidden" name="profession" value={profession} />}
            <button
              type="submit"
              name="sortBy"
              value="signed_at"
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${sortBy === 'signed_at' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              <Clock className="size-3.5" />
              Date
              {sortBy === 'signed_at' && <ArrowUpDown className="size-3" />}
            </button>
            <button
              type="submit"
              name="sortBy"
              value="display_name"
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${sortBy === 'display_name' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              <ArrowUpDown className="size-3.5" />
              Name
            </button>
            <input type="hidden" name="sortOrder" value={sortBy === 'display_name' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc'} />
          </div>
        </div>
      </form>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {signers.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <Users className="mx-auto size-12 text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">No signatures found matching your criteria.</p>
            <Link href="/signing-wall" className="mt-2 inline-block text-sm text-primary hover:underline">Clear filters</Link>
          </div>
        )}
        {signers.map((signer) => (
          <Link
            key={signer.id}
            href={`/jainz/${signer.jainz_id}`}
            className="glass-card group rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20 font-heading text-lg font-bold text-primary">
                {signer.display_name[0]}
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">{signer.jainz_id}</Badge>
            </div>
            <div className="mt-4 font-heading text-lg font-semibold group-hover:text-primary transition-colors">{signer.display_name}</div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {signer.city}, {signer.country}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="size-3" />
                {signer.profession}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {formatDate(signer.signed_at)}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link href={`/signing-wall${buildQueryString({ ...currentParams, page: String(page - 1) })}`} className="flex size-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
              <ChevronLeft className="size-4" />
            </Link>
          )}
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let p: number;
            if (totalPages <= 7) {
              p = i + 1;
            } else if (page <= 4) {
              p = i + 1;
            } else if (page >= totalPages - 3) {
              p = totalPages - 6 + i;
            } else {
              p = page - 3 + i;
            }
            return (
              <Link
                key={p}
                href={`/signing-wall${buildQueryString({ ...currentParams, page: String(p) })}`}
                className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  p === page ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {p}
              </Link>
            );
          })}
          {page < totalPages && (
            <Link href={`/signing-wall${buildQueryString({ ...currentParams, page: String(page + 1) })}`} className="flex size-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
              <ChevronRight className="size-4" />
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
