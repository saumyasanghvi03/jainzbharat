import { getSupabaseServerClient } from '../server';
import type { AuditLog, AuditLogInsert } from '../types';

export interface ListAuditLogsOptions {
  limit?: number;
  offset?: number;
  profileId?: string;
  action?: string;
  entityType?: string;
  fromDate?: string;
  toDate?: string;
}

export async function listAuditLogs(options: ListAuditLogsOptions = {}): Promise<{ data: AuditLog[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 50;
  const offset = options.offset ?? 0;

  let query = supabase.from('audit_logs').select('*', { count: 'exact' });
  if (options.profileId) query = query.eq('profile_id', options.profileId);
  if (options.action) query = query.eq('action', options.action);
  if (options.entityType) query = query.eq('entity_type', options.entityType);
  if (options.fromDate) query = query.gte('created_at', options.fromDate);
  if (options.toDate) query = query.lte('created_at', options.toDate);

  const { data, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
  return { data: (data ?? []) as AuditLog[], total: count ?? 0 };
}

export async function createAuditLog(input: AuditLogInsert): Promise<AuditLog | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('audit_logs') as any).insert(input).select().maybeSingle();
  return data as AuditLog | null;
}
