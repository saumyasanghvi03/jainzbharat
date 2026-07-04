export const site = {
  name: 'JainZBharat',
  domain: process.env.NEXT_PUBLIC_APP_URL ?? 'https://jainzbharat.vercel.app',
  tagline: 'Made in India 🇮🇳 · Inspired by Jain Wisdom 🕊 · Open to Everyone 🌍 · Built for Humanity ❤️',
  description:
    'A digital civilization platform for values, contribution, learning, service, and ethical collaboration inspired by Jain philosophy and open to everyone.',
  mission:
    'Create the world’s largest digital ecosystem inspired by Jain philosophy where anyone can contribute regardless of religion, nationality, language, age, profession, or background.',
  values: [
    'Ahimsa',
    'Satya',
    'Aparigraha',
    'Anekantavada',
    'Tapasya',
    'Seva',
    'Integrity',
    'Innovation',
    'Learning',
    'Compassion',
    'Respect',
    'Responsibility',
  ],
} as const;

export const platformModules = [
  { slug: 'dashboard', title: 'Community Dashboard', description: 'Contribution score, mentorship, courses, certificates, achievements, badges, and volunteer hours.' },
  { slug: 'founders', title: 'Founder Directory', description: 'Verified founder profiles with startup, stage, skills, hiring, mentoring, investor, and advisor signals.' },
  { slug: 'students', title: 'Student Directory', description: 'Student profiles for learning paths, projects, chapters, scholarships, and mentorship.' },
  { slug: 'professionals', title: 'Professional Directory', description: 'Professionals organized by skills, industry, location, projects, and service interests.' },
  { slug: 'volunteers', title: 'Volunteer Directory', description: 'Volunteer discovery by city, skills, availability, causes, events, and verified service hours.' },
  { slug: 'mentors', title: 'Mentor Directory', description: 'Mentor profiles for students, professionals, founders, youth chapters, and community builders.' },
  { slug: 'sanghs', title: 'Sangh Directory', description: 'Verified Sangh records with contact details, committees, youth wings, events, and claim workflows.' },
  { slug: 'temples', title: 'Temple Directory', description: 'Temple profiles with maps, heritage notes, events, contacts, accessibility, and verification.' },
  { slug: 'ngos', title: 'NGO Directory', description: 'NGO discovery for seva, education, sustainability, animal welfare, and community projects.' },
  { slug: 'events', title: 'Global Calendar', description: 'Events, RSVP, QR check-in, attendance, galleries, certificates, and calendar filters.' },
  { slug: 'learning', title: 'Learning Hub', description: 'Courses, reading paths, resources, meditation, values education, and lifelong learning.' },
  { slug: 'navkar', title: 'Navkar Tracker', description: 'Privacy-first practice tracker with anonymous aggregate contribution to global heatmaps.' },
  { slug: 'map', title: 'Interactive World Map', description: 'Layered global map for signatories, founders, students, mentors, events, temples, and volunteer work.' },
  { slug: 'admin', title: 'Admin Dashboard', description: 'Verification, moderation, reports, users, analytics, audit logs, and role-based controls.' },
];
