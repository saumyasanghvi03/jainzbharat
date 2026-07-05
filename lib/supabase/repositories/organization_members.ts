import { getSupabaseServerClient } from '../server';
import type { OrganizationMember, OrganizationMemberInsert, OrganizationMemberUpdate } from '../types';

export async function listOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('organization_members').select('*').eq('organization_id', organizationId).order('joined_at', { ascending: true });
  return (data ?? []) as OrganizationMember[];
}

export async function getOrganizationMember(organizationId: string, profileId: string): Promise<OrganizationMember | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('organization_members').select('*').eq('organization_id', organizationId).eq('profile_id', profileId).maybeSingle();
  return data as OrganizationMember | null;
}

export async function joinOrganization(input: OrganizationMemberInsert): Promise<OrganizationMember | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('organization_members') as any).insert(input).select().maybeSingle();
  return data as OrganizationMember | null;
}

export async function updateOrganizationMembership(organizationId: string, profileId: string, updates: OrganizationMemberUpdate): Promise<OrganizationMember | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('organization_members') as any).update(updates).eq('organization_id', organizationId).eq('profile_id', profileId).select().maybeSingle();
  return data as OrganizationMember | null;
}

export async function removeOrganizationMember(organizationId: string, profileId: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase.from('organization_members').delete().eq('organization_id', organizationId).eq('profile_id', profileId);
}
