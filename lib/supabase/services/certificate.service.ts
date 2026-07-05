import { createCertificate, listCertificates } from '../repositories/certificates';
import { createNotification } from '../repositories/notifications';
import { createAuditLog } from '../repositories/audit_logs';
import QRCode from 'qrcode';
import type { Certificate, CertificateInsert } from '../types';

export interface IssueCertificateInput {
  profileId: string;
  title: string;
  description?: string;
  verificationUrl?: string;
}

export async function issueCertificate(input: IssueCertificateInput): Promise<Certificate | null> {
  const qrCode = input.verificationUrl ? await QRCode.toDataURL(input.verificationUrl) : null;

  const cert = await createCertificate({
    profile_id: input.profileId,
    title: input.title,
    description: input.description ?? null,
    metadata: {
      verificationUrl: input.verificationUrl,
      qrCode,
    },
  });

  if (cert) {
    await createNotification({
      profile_id: input.profileId,
      notification_type: 'certificate_issued',
      title: 'Certificate Issued',
      body: `Your certificate "${input.title}" has been issued.`,
      link: `/certificates/${cert.id}`,
    });

    await createAuditLog({
      profile_id: input.profileId,
      action: 'certificate_issued',
      entity_type: 'certificates',
      entity_id: cert.id,
      changes: { title: input.title } as any,
    });
  }

  return cert;
}

export async function getUserCertificates(profileId: string): Promise<Certificate[]> {
  return listCertificates(profileId);
}
