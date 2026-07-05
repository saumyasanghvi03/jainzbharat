# JainZBharat

**JainZBharat** (Jain + Z + Bharat) is a digital civilization platform for values, contribution, learning, service, and ethical collaboration — inspired by Jain philosophy and open to everyone.

## What is JainZ?

**JainZ** is the core identity framework of the platform:
- **Jain** — rooted in the timeless values of Jain philosophy: Ahimsa (non-violence), Satya (truth), Aparigraha (non-possessiveness), Anekantavada (multiplicity of viewpoints), and Tapasya (self-discipline).
- **Z** — the generation that inherits and reimagines these values for the digital age. The "Z" represents a fresh, infinite dimension — like a coordinate axis expanding into the future. Every signatory is issued a unique **JainZ ID** (e.g., `JZB-2026-000001`) as their digital identity on the platform.

JainZBharat = Jain values × Digital Z generation × Bharat (India) — a global home for anyone who believes in ethical living, contribution, and community.

## Features

- **Declaration Signing** — Commit to 10 principles and 17 commitments. Receive a verified JainZ ID and certificate.
- **Directories** — Founders, Students, Professionals, Volunteers, Mentors, Sanghs, Temples, NGOs — all verified.
- **Global Map** — Interactive world map showing signatories, events, temples, and volunteer activity.
- **Navkar Heatmap** — Privacy-first practice tracker with anonymous aggregate contribution to global heatmaps.
- **Events & Calendar** — RSVP, QR check-in, attendance tracking, galleries, and certificates.
- **Community Dashboard** — Contribution scores, mentorship, courses, achievements, and volunteer hours.
- **Learning Hub** — Courses, reading paths, meditation, values education, and lifelong learning.

## Quick start

```bash
corepack enable
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Auth**: Clerk (email, Google, GitHub)
- **Database**: Supabase (PostgreSQL, RLS, real-time)
- **Email**: Resend (HTML templates, zero-dependency)
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel + GitHub CI

## Production deployment

1. Create a Supabase project and run migrations in `supabase/migrations` followed by `supabase/seed/seed.sql`.
2. Create a Clerk application and enable Google, GitHub, and Email login.
3. Add all variables from `.env.example` to Vercel.
4. Deploy with Vercel using `pnpm install` and `pnpm build`.

## Security baseline

- Clerk protects dashboard, admin, and settings routes.
- Supabase migrations enable RLS for user-owned and public records.
- Middleware applies secure headers and a restrictive content security policy.
- API inputs are validated with Zod and rate limited in-process for edge abuse reduction.

## License

MIT
