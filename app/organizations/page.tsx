import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/card';
import { listOrganizations } from '@/lib/supabase/repositories/organizations';
import { Globe, MapPin, Building2 } from 'lucide-react';

export const metadata = { title: 'Organizations' };

const typeLabels: Record<string, string> = {
  sangh: 'Sangh', temple: 'Temple', trust: 'Trust', ngo: 'NGO',
  startup: 'Startup', institution: 'Institution', university: 'University',
};

export default async function OrganizationsPage() {
  const { data: orgs } = await listOrganizations({ verifiedOnly: false, limit: 50 });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Organizations</Badge>
      <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-6xl">Organizations Directory</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Registered sanghs, temples, trusts, NGOs, startups, and institutions on JainZBharat.</p>

      {orgs.length === 0 ? (
        <Card className="mt-8 text-center">
          <p className="text-muted-foreground">No organizations registered yet.</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orgs.map(org => (
            <Card key={org.id}>
              <div className="flex items-start gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Building2 className="size-6 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-heading text-lg font-semibold">{org.name}</h3>
                    {org.verification_status === 'verified' && <Badge variant="accent">Verified</Badge>}
                  </div>
                  {org.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{org.description}</p>}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {(org.city || org.country) && <span className="flex items-center gap-1"><MapPin className="size-3.5" />{[org.city, org.country].filter(Boolean).join(', ')}</span>}
                {org.website && <span className="flex items-center gap-1"><Globe className="size-3.5" />{new URL(org.website).hostname}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
