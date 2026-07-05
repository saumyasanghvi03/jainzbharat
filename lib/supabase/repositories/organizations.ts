import { getSupabaseServerClient } from '../server';
import type { Organization, OrganizationInsert, OrganizationUpdate } from '../types';

export interface ListOrganizationsOptions {
  limit?: number;
  offset?: number;
  country?: string;
  verifiedOnly?: boolean;
  query?: string;
}

export async function listOrganizations(options: ListOrganizationsOptions = {}): Promise<{ data: Organization[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;

  let query = supabase.from('organizations').select('*', { count: 'exact' });
  if (options.verifiedOnly) query = query.eq('verification_status', 'verified');
  if (options.country) query = query.eq('country', options.country);
  if (options.query) query = query.ilike('name', `%${options.query}%`);

  const { data, count } = await query.order('name', { ascending: true }).range(offset, offset + limit - 1);
  return { data: (data ?? []) as Organization[], total: count ?? 0 };
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('organizations').select('*').eq('slug', slug).maybeSingle();
  return data as Organization | null;
}

export async function createOrganization(input: OrganizationInsert): Promise<Organization | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('organizations') as any).insert(input).select().maybeSingle();
  return data as Organization | null;
}

export async function updateOrganization(slug: string, updates: OrganizationUpdate): Promise<Organization | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('organizations') as any).update(updates).eq('slug', slug).select().maybeSingle();
  return data as Organization | null;
}
