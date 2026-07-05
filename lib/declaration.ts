import { z } from 'zod';

export interface DeclarationSection {
  title: string;
  content?: string;
  items?: string[];
}

export interface DeclarationVersion {
  version: string;
  publishedAt: string;
  status: string;
  preamble: string;
  vision: string;
  mission: string;
  principles: { title: string; description: string }[];
  commitments: string[];
  rejections: string[];
  innovationCharter: string[];
  bharatCharter: string[];
  communityCharter: string[];
  contributionAreas: string[];
  digitalEthics: string[];
  pledge: string[];
  closing: string;
  signatoryCommitment: string;
  tagline: string;
}

export const declarationVersions: DeclarationVersion[] = [
  {
    version: 'v1.0',
    publishedAt: '2026-07-04T00:00:00.000Z',
    status: 'current',
    preamble:
      'We stand at a defining moment in human history.\n\nNever before has humanity possessed such extraordinary knowledge, technology, and opportunity. Yet never before have we faced such profound challenges—division, environmental degradation, misinformation, loneliness, unchecked technological power, and the erosion of trust.\n\nProgress without wisdom is fragile.\nInnovation without ethics is dangerous.\nProsperity without compassion is incomplete.\n\nThe future cannot be built on technology alone.\nIt must be built on character.\n\nJainZBharat was founded on a simple belief:\nAncient wisdom and modern innovation belong together.\n\nInspired by the timeless principles of Jain philosophy and the civilizational heritage of Bharat, JainZBharat seeks to build ethical leaders, responsible innovators, compassionate communities, and a better future for all.\n\nWe believe these values are universal.\nThey belong to no single religion.\nThey belong to humanity.\n\nJainZBharat welcomes every individual—regardless of religion, nationality, ethnicity, language, profession, gender, or background—who wishes to live with integrity, compassion, discipline, and purpose.\n\nThis Declaration is a voluntary commitment.\nIt is not a legal contract.\nIt is not a religious requirement.\nIt is a personal promise to strive toward becoming a better human being.',
    vision:
      'To create a world where humanity advances through wisdom, compassion, ethical leadership, responsible technology, and lifelong learning.\n\nTo build a Bharat that leads through values.\nTo inspire a generation that contributes more than it consumes.\nTo preserve timeless wisdom while embracing scientific progress.\nTo create communities where character is valued more than status.\nTo ensure innovation always serves humanity.',
    mission:
      'Build ethical communities.\nEncourage lifelong learning.\nPreserve cultural and philosophical wisdom.\nPromote responsible innovation.\nSupport founders, students, professionals, volunteers, researchers, educators, and changemakers.\nEncourage service before recognition.\nInspire collaboration across cultures and communities.\nCreate technology that improves lives.\nBuild institutions that outlast individuals.',
    principles: [
      { title: 'Ahimsa (Compassion)', description: 'We choose compassion over violence. We seek to reduce harm wherever possible. We respect every form of life. Kindness is strength. Compassion is leadership.' },
      { title: 'Satya (Truth)', description: 'We pursue truth with honesty. We reject misinformation. We communicate respectfully. We admit mistakes. We value evidence and integrity.' },
      { title: 'Aparigraha (Responsible Living)', description: 'We seek balance rather than excess. We consume thoughtfully. We create more than we consume. We value purpose over possession.' },
      { title: 'Anekantavada (Respect for Perspectives)', description: 'We recognize that no individual possesses complete understanding. We welcome respectful disagreement. We remain intellectually humble. We learn continuously.' },
      { title: 'Tapasya (Discipline)', description: 'Character grows through discipline. Success requires consistency. Growth requires patience. We master ourselves before seeking to influence others.' },
      { title: 'Seva (Service)', description: 'Leadership begins with service. Our success is measured by lives improved. Communities grow through contribution.' },
      { title: 'Lifelong Learning', description: 'Knowledge never ends. Every individual can teach. Every individual can learn. Curiosity is a lifelong responsibility.' },
      { title: 'Responsible Innovation', description: 'Technology must empower humanity. Artificial Intelligence should augment human potential. Innovation must respect ethics, privacy, transparency, and accountability. We build responsibly.' },
      { title: 'Environmental Responsibility', description: 'The Earth is shared by all living beings. We recognize our responsibility to protect nature. We support sustainability. We reduce waste. We respect future generations.' },
      { title: 'Human Dignity', description: 'Every individual deserves respect. Every culture deserves dignity. Every community deserves opportunity. Human worth is never measured by wealth, status, caste, race, gender, religion, or nationality.' },
    ],
    commitments: [
      'Speak truthfully.',
      'Act responsibly.',
      'Respect every individual.',
      'Learn continuously.',
      'Mentor generously.',
      'Volunteer regularly.',
      'Build ethical technology.',
      'Protect nature.',
      'Support education.',
      'Encourage entrepreneurship.',
      'Promote financial literacy.',
      'Preserve cultural heritage.',
      'Strengthen communities.',
      'Practice humility.',
      'Celebrate diversity.',
      'Resolve conflicts peacefully.',
      'Build institutions for future generations.',
    ],
    rejections: [
      'Violence.',
      'Hatred.',
      'Corruption.',
      'Dishonesty.',
      'Discrimination.',
      'Exploitation.',
      'Extremism.',
      'Greed.',
      'Addiction.',
      'Harassment.',
      'Bullying.',
      'Misinformation.',
      'Technology without ethics.',
      'Power without accountability.',
      'Success without integrity.',
    ],
    innovationCharter: [
      'Improve lives.',
      'Reduce suffering.',
      'Increase opportunity.',
      'Promote accessibility.',
      'Respect privacy.',
      'Protect freedom.',
      'Encourage transparency.',
      'Strengthen communities.',
      'Preserve human dignity.',
      'Serve humanity before profit.',
    ],
    bharatCharter: [
      'Knowledge.',
      'Innovation.',
      'Education.',
      'Entrepreneurship.',
      'Ethical leadership.',
      'Scientific research.',
      'Technology.',
      'Culture.',
      'Compassion.',
      'Service.',
    ],
    communityCharter: [
      'Mutual respect.',
      'Constructive dialogue.',
      'Open collaboration.',
      'Transparency.',
      'Volunteerism.',
      'Mentorship.',
      'Open knowledge.',
      'Merit.',
      'Inclusivity.',
      'Shared responsibility.',
    ],
    contributionAreas: [
      'Teaching.',
      'Mentoring.',
      'Open-source development.',
      'Research.',
      'Innovation.',
      'Volunteer work.',
      'Community service.',
      'Environmental initiatives.',
      'Educational outreach.',
      'Professional guidance.',
      'Youth empowerment.',
      'Social entrepreneurship.',
    ],
    digitalEthics: [
      'Respect privacy.',
      'Protect personal data.',
      'Avoid harassment.',
      'Verify information before sharing.',
      'Use AI responsibly.',
      'Promote respectful dialogue.',
      'Encourage healthy online communities.',
    ],
    pledge: [
      'I choose character over comfort.',
      'I choose integrity over convenience.',
      'I choose service over ego.',
      'I choose discipline over distraction.',
      'I choose learning over ignorance.',
      'I choose compassion over hatred.',
      'I choose responsibility over entitlement.',
      'I choose contribution over consumption.',
      'I choose wisdom over arrogance.',
      'I choose dialogue over division.',
      'I choose innovation guided by ethics.',
      'I will strive to improve myself before attempting to improve others.',
      'I will use my knowledge to uplift people.',
      'I will respect every individual.',
      'I will welcome different perspectives.',
      'I will protect the dignity of all living beings.',
      'I will contribute to my community.',
      'I will strengthen my nation through my actions.',
      'I will work toward a better world through compassion, knowledge, and service.',
      'I understand that this declaration is a voluntary personal commitment.',
      'I will do my best to uphold these values every day.',
    ],
    closing:
      'The future belongs not merely to those who build faster.\nIt belongs to those who build wisely.\n\nMay compassion guide our decisions.\nMay truth guide our words.\nMay discipline guide our actions.\nMay service guide our leadership.\nMay innovation serve humanity.\nMay Bharat inspire the world through knowledge, ethics, and compassion.\n\nTogether, we build not only technology—\nWe build character.\nWe build communities.\nWe build trust.\nWe build humanity.',
    signatoryCommitment:
      'By signing this Declaration, I voluntarily affirm that I have read and understood its principles. I recognize that it is a statement of shared values, not a legal contract or a requirement of membership. I choose to support these ideals through my own actions and continuous personal growth, while respecting the dignity, freedom, and diversity of every individual.',
    tagline: 'Made in India | Inspired by Jain Wisdom | Open to Everyone | Built for Humanity',
  },
];

export const signatureSchema = z.object({
  country: z.string().trim().min(2).max(80),
  city: z.string().trim().min(1).max(80),
  profession: z.string().trim().min(2).max(100),
  organization: z.string().trim().max(120).optional(),
  declarationVersion: z.string().default('v1.0'),
});

export type SignatureInput = z.infer<typeof signatureSchema>;
