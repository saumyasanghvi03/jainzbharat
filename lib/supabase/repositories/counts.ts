import { getSupabaseAdminClient } from '../admin';

export interface LiveCounts {
  totalProfiles: number;
  totalSignatures: number;
  totalCountries: number;
  totalEvents: number;
  totalClubs: number;
  totalOrganizations: number;
}

export async function getLiveCounts(): Promise<LiveCounts> {
  const supabase = getSupabaseAdminClient();

  const [profilesRes, signaturesRes, countriesRes, eventsRes, clubsRes, orgsRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('declaration_signatures').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('country', { count: 'exact', head: true }).not('country', 'is', null),
    supabase.from('events').select('id', { count: 'exact', head: true }),
    supabase.from('clubs').select('id', { count: 'exact', head: true }),
    supabase.from('organizations').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalProfiles: profilesRes.count ?? 0,
    totalSignatures: signaturesRes.count ?? 0,
    totalCountries: countriesRes.count ?? 0,
    totalEvents: eventsRes.count ?? 0,
    totalClubs: clubsRes.count ?? 0,
    totalOrganizations: orgsRes.count ?? 0,
  };
}
