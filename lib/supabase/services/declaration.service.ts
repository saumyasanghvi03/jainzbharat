import {
  createSignature as createSignatureRepo,
  getSignatureByProfileAndVersion,
} from '../repositories';
import { awardBadge } from '../repositories/badges';
import { createNotification } from '../repositories/notifications';
import { createAuditLog } from '../repositories/audit_logs';
import type { CreateSignatureInput } from '../repositories';
import type { DeclarationSignature } from '../types';

export interface SignDeclarationResult {
  signature: DeclarationSignature;
  alreadySigned: boolean;
  badgeAwarded: boolean;
}

export async function signDeclaration(input: CreateSignatureInput): Promise<SignDeclarationResult> {
  const existing = await getSignatureByProfileAndVersion(input.profile_id, input.declaration_version);
  if (existing) {
    return { signature: existing, alreadySigned: true, badgeAwarded: false };
  }

  const signature = await createSignatureRepo(input);
  if (!signature) throw new Error('Failed to create signature');

  const badge = await awardBadge({
    profile_id: input.profile_id,
    badge_type: 'declaration_signer',
    name: 'Declaration Signatory',
    description: 'Signed the JainZBharat Founding Declaration',
  });

  await createNotification({
    profile_id: input.profile_id,
    notification_type: 'signature_confirmed',
    title: 'Declaration Signed',
    body: `You have signed the JainZBharat Founding Declaration (${input.declaration_version}).`,
    link: `/signing-wall`,
  });

  await createAuditLog({
    profile_id: input.profile_id,
    action: 'declaration_signed',
    entity_type: 'declaration_signatures',
    entity_id: signature.id,
    changes: { declaration_version: input.declaration_version } as any,
  });

  return { signature, alreadySigned: false, badgeAwarded: !!badge };
}
