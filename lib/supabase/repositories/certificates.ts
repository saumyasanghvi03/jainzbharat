import { getSupabaseServerClient } from '../server';
import type { Certificate, CertificateInsert } from '../types';

export async function listCertificates(profileId: string): Promise<Certificate[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from('certificates')
    .select('*')
    .eq('profile_id', profileId)
    .order('issued_at', { ascending: false });
  return (data ?? []) as Certificate[];
}

export async function getCertificate(id: string): Promise<Certificate | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('certificates').select('*').eq('id', id).maybeSingle();
  return data as Certificate | null;
}

export async function createCertificate(input: CertificateInsert): Promise<Certificate | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('certificates') as any).insert(input).select().maybeSingle();
  return data as Certificate | null;
}
