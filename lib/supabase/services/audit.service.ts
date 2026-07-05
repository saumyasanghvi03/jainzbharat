import { listAuditLogs, createAuditLog as createLog } from '../repositories/audit_logs';
import type { AuditLog, AuditLogInsert } from '../types';

export async function logAction(input: AuditLogInsert): Promise<AuditLog | null> {
  return createLog(input);
}

export async function queryAuditLogs(options: {
  limit?: number;
  offset?: number;
  profileId?: string;
  action?: string;
  entityType?: string;
}): Promise<{ data: AuditLog[]; total: number }> {
  return listAuditLogs(options);
}
