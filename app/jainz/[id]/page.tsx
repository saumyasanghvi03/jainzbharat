import { notFound } from 'next/navigation';
import { parseJainZId } from '@/lib/jainz-id';
import { getProfileByJainzId } from '@/lib/supabase/repositories/profiles';
import { getSignatureByProfileAndVersion } from '@/lib/supabase/repositories/signatures';
import { Badge } from '@/components/ui/badge';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `JainZ ID ${id}`, description: `Public profile for JainZ ID ${id} on ${site.name}.` };
}

export default async function JainZProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = parseJainZId(id);
  if (!parsed) notFound();

  const profile = await getProfileByJainzId(id);
  if (!profile) notFound();

  const signature = await getSignatureByProfileAndVersion(profile.id, 'v1.0');
  const verificationUrl = `${site.domain}/jainz/${id}`;

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <div className="glass-card rounded-[2rem] p-8 md:p-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Badge variant="default">Verified JainZ ID</Badge>
          <span className="font-mono text-sm text-primary">{id}</span>
        </div>

        <h1 className="mt-6 font-heading text-4xl font-semibold md:text-6xl">{profile.display_name}</h1>

        <div className="mt-6 flex flex-wrap gap-2">
          {profile.profession && <Badge variant="secondary">{profile.profession}</Badge>}
          {profile.country && <Badge variant="accent">{profile.country}</Badge>}
          {signature && <Badge variant="default">Declaration Signed</Badge>}
        </div>

        {profile.bio && <p className="mt-6 max-w-2xl leading-7 text-muted-foreground">{profile.bio}</p>}

        <dl className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-xl bg-muted p-4">
            <dt className="text-xs text-muted-foreground">Year</dt>
            <dd className="mt-1 font-heading text-2xl font-semibold">{parsed.year}</dd>
          </div>
          <div className="rounded-xl bg-muted p-4">
            <dt className="text-xs text-muted-foreground">Sequence</dt>
            <dd className="mt-1 font-heading text-2xl font-semibold">{String(parsed.sequence).padStart(6, '0')}</dd>
          </div>
          <div className="rounded-xl bg-muted p-4">
            <dt className="text-xs text-muted-foreground">Contribution Score</dt>
            <dd className="mt-1 font-heading text-2xl font-semibold text-primary">{profile.contribution_score}</dd>
          </div>
          <div className="rounded-xl bg-muted p-4">
            <dt className="text-xs text-muted-foreground">Volunteer Hours</dt>
            <dd className="mt-1 font-heading text-2xl font-semibold text-secondary">{profile.volunteer_hours}</dd>
          </div>
        </dl>

        {signature && (
          <div className="mt-8 rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Declaration signed on</p>
            <p className="mt-1 font-mono text-sm">{new Date(signature.signed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="mt-1 text-xs text-muted-foreground">Version: {signature.declaration_version} · Location: {signature.city}, {signature.country} · Profession: {signature.profession}</p>
          </div>
        )}

        <div className="mt-8 rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Verification URL</p>
          <p className="mt-1 font-mono text-sm text-primary">{verificationUrl}</p>
        </div>
      </div>
    </section>
  );
}
