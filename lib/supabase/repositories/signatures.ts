import { getSupabaseServerClient } from '../server';
import type { DeclarationSignature } from '../types';

export interface CreateSignatureInput {
  profile_id: string;
  declaration_version: string;
  country: string;
  city: string;
  profession: string;
  organization?: string;
}

export async function createSignature(input: CreateSignatureInput): Promise<DeclarationSignature | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('declaration_signatures') as any).insert(input).select().maybeSingle();
  return data as DeclarationSignature | null;
}

export async function getSignatureByProfileAndVersion(profileId: string, version: string): Promise<DeclarationSignature | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('declaration_signatures').select('*').eq('profile_id', profileId).eq('declaration_version', version).maybeSingle();
  return data as DeclarationSignature | null;
}

export interface SignatureWithProfile {
  id: string;
  profile_id: string;
  declaration_version: string;
  country: string;
  city: string;
  profession: string;
  organization: string | null;
  signed_at: string;
  display_name: string;
  jainz_id: string;
}

export async function listSignatures(options?: {
  limit?: number;
  offset?: number;
  search?: string;
  country?: string;
  profession?: string;
  sortBy?: 'signed_at' | 'display_name';
  sortOrder?: 'asc' | 'desc';
}): Promise<{ data: SignatureWithProfile[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options?.limit ?? 30;
  const offset = options?.offset ?? 0;

  let query = supabase.from('declaration_signatures').select('*, profiles:profile_id(display_name, jainz_id)', { count: 'exact' });

  if (options?.search) query = query.ilike('profiles.display_name', `%${options.search}%`);
  if (options?.country) query = query.eq('country', options.country);
  if (options?.profession) query = query.eq('profession', options.profession);

  const sortCol = options?.sortBy === 'display_name' ? 'profiles.display_name' : 'signed_at';
  const { data, count } = await query.order(sortCol, { ascending: options?.sortOrder === 'asc', referencedTable: sortCol.startsWith('profiles.') ? 'profiles' : undefined }).range(offset, offset + limit - 1);

  const mapped: SignatureWithProfile[] = ((data ?? []) as any[]).map((row: any) => ({
    id: row.id,
    profile_id: row.profile_id,
    declaration_version: row.declaration_version,
    country: row.country,
    city: row.city,
    profession: row.profession,
    organization: row.organization,
    signed_at: row.signed_at,
    display_name: row.profiles?.display_name ?? 'Unknown',
    jainz_id: row.profiles?.jainz_id ?? '',
  }));

  return { data: mapped, total: count ?? 0 };
}
