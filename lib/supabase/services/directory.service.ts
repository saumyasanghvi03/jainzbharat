import {
  listDirectoryEntries,
  getDirectoryEntryBySlug,
  createDirectoryEntry,
  updateDirectoryEntry,
} from '../repositories';
import { createAuditLog } from '../repositories/audit_logs';
import type { DirectoryType, DirectoryEntryInsert, DirectoryEntryUpdate } from '../types';

export interface DirectorySearchResult {
  data: DirectoryEntryInsert[];
  total: number;
}

export async function submitDirectoryEntry(profileId: string, input: DirectoryEntryInsert): Promise<DirectoryEntryInsert | null> {
  const entry = await createDirectoryEntry({ ...input, owner_profile_id: profileId, verification_status: 'pending' });
  if (entry) {
    await createAuditLog({
      profile_id: profileId,
      action: 'directory_entry_created',
      entity_type: 'directory_entries',
      entity_id: entry.id,
      changes: { directory_type: input.directory_type, name: input.name } as any,
    });
  }
  return entry;
}

export async function verifyDirectoryEntry(slug: string, profileId: string): Promise<DirectoryEntryInsert | null> {
  const entry = await updateDirectoryEntry(slug, { verification_status: 'verified' });
  if (entry) {
    await createAuditLog({
      profile_id: profileId,
      action: 'directory_entry_verified',
      entity_type: 'directory_entries',
      entity_id: entry.id,
      changes: { slug } as any,
    });
  }
  return entry;
}
