import { z } from 'zod';

export const declarationVersions = [
  {
    version: 'v1.0',
    publishedAt: '2026-07-04T00:00:00.000Z',
    status: 'current',
    vision:
      'A trusted global home where timeless Indian wisdom guides ethical innovation, meaningful collaboration, and lifelong service.',
    mission:
      'Preserve enduring values while enabling modern collaboration for founders, students, professionals, volunteers, institutions, and communities.',
    principles: [
      'Compassion without exclusion',
      'Truth with humility',
      'Responsible innovation',
      'Service before status',
      'Lifelong learning',
      'Respect for many viewpoints',
    ],
    commitments: [
      'Keep the platform open to everyone',
      'Archive every declaration version permanently',
      'Protect privacy, safety, and dignity',
      'Use transparent governance and audit trails',
      'Reward contribution, mentorship, learning, and service',
    ],
  },
] as const;

export const signatureSchema = z.object({
  name: z.string().trim().min(2).max(120),
  country: z.string().trim().min(2).max(80),
  city: z.string().trim().min(1).max(80),
  profession: z.string().trim().min(2).max(100),
  organization: z.string().trim().max(120).optional(),
  declarationVersion: z.string().default('v1.0'),
});

export type SignatureInput = z.infer<typeof signatureSchema>;
