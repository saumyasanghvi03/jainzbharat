# PRODUCT.md — JainZBharat Single Source of Truth

> **Rule for all AI agents and contributors**:
> PRODUCT.md is the source of truth. Never contradict it. If a feature, design decision, or architectural choice conflicts with this document, this document wins.

---

## Vision

A trusted global home where timeless Indian wisdom guides ethical innovation, meaningful collaboration, and lifelong service.

## Mission

Create the world's largest digital ecosystem inspired by Jain philosophy where anyone can contribute regardless of religion, nationality, language, age, profession, or background.

## What JainZBharat IS

- Open civic infrastructure for values-led contribution
- A permanent digital identity and recognition system
- A directory and collaboration platform for founders, students, professionals, volunteers, mentors, sanghs, temples, and NGOs
- A versioned declaration and signing platform
- A spiritual practice tracker (Navkar Siddhi)
- A certificate and badge verification system

## What JainZBharat is NOT

- Not a religious site or temple app
- Not a social network (no feeds, no likes, no followers)
- Not a dating app
- Not a fundraising/donation platform (Phase 1–4)
- Not a messaging app
- Not a news aggregator
- Not an e-commerce marketplace (Phase 1–4)

---

## Target Users

| Persona | Description | Primary Need |
|---------|-------------|--------------|
| **Aarav** (Founder) | 28, Mumbai, tech startup founder | Network with values-aligned founders, showcase JainZ ID on LinkedIn |
| **Mira** (Student) | 21, New York, CS student | Find mentors, track volunteer hours, earn certificates |
| **Kavya** (Professional) | 35, London, designer | Contribute skills, join community events, build reputation |
| **Rajesh** (Sangh Leader) | 55, Ahmedabad, Sangh president | Verify Sangh listing, manage committee profiles, announce events |
| **Priya** (Volunteer) | 30, Toronto, teacher | Track seva hours, discover volunteer opportunities, earn badges |
| **Dev** (Contributor) | 26, Bangalore, open-source developer | Contribute to the platform, earn contribution score |

---

## Features

### Core (Phase 1) — Must ship for MVP

| Feature | Description | Status |
|---------|-------------|--------|
| Landing Page | Hero, stats, ecosystem grid, values | ✅ Exists |
| Declaration | Versioned pledge with principles and commitments | ✅ Exists |
| Digital Signing Wall | Public signatures with JainZ IDs | ✅ Skeleton |
| JainZ ID | Permanent ID (JZB-2026-000001), QR, public profile | ✅ Skeleton |
| Authentication | Clerk: Google, GitHub, Email | ✅ Wired |
| Certificates | PDF with QR verification URL | ✅ API only |
| Badges | LinkedIn, GitHub README, embeddable | ✅ API only |
| About | Mission, values, what-JainZBharat-is | ✅ Exists |

### Secondary (Phase 2) — Directories and community

| Feature | Description | Status |
|---------|-------------|--------|
| Community Dashboard | Contribution score, badges, volunteer hours | ❌ |
| Founder Directory | Profiles with startup, stage, skills, location | ❌ |
| Student Directory | Learning paths, projects, chapters | ❌ |
| Professional Directory | Skills, industry, location | ❌ |
| Volunteer Directory | City, skills, availability, causes | ❌ |
| Mentor Directory | Expertise, availability, mentees | ❌ |
| Sangh Directory | Verified listings, committees, events | ❌ |
| Temple Directory | Maps, heritage, events, accessibility | ❌ |
| NGO Directory | Seva, education, sustainability | ❌ |
| Events / Global Calendar | RSVP, QR check-in, attendance, certificates | ❌ |
| Global Search | Postgres full-text across all directories | ❌ |

### Advanced (Phase 3) — Maps, analytics, admin

| Feature | Description | Status |
|---------|-------------|--------|
| Interactive Globe | 3D globe with signatory/founder/event layers | ❌ |
| Navkar Siddhi | Privacy-first practice tracker with heatmaps | ❌ |
| Analytics Dashboard | PostHog, Vercel Analytics, Web Vitals | ❌ |
| Admin Dashboard | Verification, moderation, reports, audit logs | ❌ |

### Future (Phase 4) — Long-term ecosystem

| Feature | Description | Status |
|---------|-------------|--------|
| JainGPT | AI assistant with RAG over Jain knowledge base | ❌ |
| JainZ Passport | Cross-platform identity verification | ❌ |
| Learning Hub | Courses, reading paths, meditation | ❌ |
| Jobs Portal | Values-aligned job board | ❌ |
| Marketplace | Ethical goods and services | ❌ |
| Mobile Apps | iOS and Android | ❌ |
| Multi-language | Hindi, Gujarati, English, + more | ❌ |

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 16 (App Router) | Server components, streaming, edge runtime |
| Language | TypeScript (strict) | Type safety, refactoring confidence |
| Styling | Tailwind CSS v4 | Utility-first, design tokens via @theme |
| Components | shadcn/ui + CVA | Accessible, composable, themeable |
| Auth | Clerk | Google, GitHub, Email, RBAC, middleware |
| Database | Supabase (PostgreSQL) | RLS, real-time, storage, edge functions |
| ORM/Client | @supabase/supabase-js | Direct client, no ORM overhead |
| Validation | Zod | Runtime + compile-time schema validation |
| PDF | @react-pdf/renderer | Certificate generation |
| QR | qrcode | Verification QR codes |
| Charts | Recharts | Analytics dashboards |
| Animation | Framer Motion | Scroll animations, page transitions |
| Icons | Lucide React | Consistent, tree-shakeable |
| Analytics | PostHog + Vercel Analytics | Privacy-respecting product analytics |
| Monitoring | Sentry | Error tracking, performance monitoring |
| Testing | Vitest + Playwright | Unit + E2E testing |
| Package Manager | pnpm | Fast, disk-efficient, strict |
| Deployment | Vercel | Zero-config, edge network, preview deploys |
| CI/CD | GitHub Actions | Lint, typecheck, test, build on every PR |

---

## Design Philosophy

1. **Dark mode first** — The platform always runs in dark mode. Light mode is not planned.
2. **Glassmorphism** — Cards use backdrop-blur with subtle borders and gold glow.
3. **Gold as accent** — `#d7b56d` is sacred. It represents Jain wisdom. Use it sparingly.
4. **Premium civic tech** — Not playful, not corporate. Feels like infrastructure.
5. **Accessibility** — WCAG 2.1 AA minimum. Skip links, focus rings, ARIA labels.
6. **Performance** — Server components by default. Client components only when interactive.
7. **Mobile-responsive** — Every page works on 320px to 2560px.

---

## Architecture Principles

1. **Database-first**: Design schema → API → Frontend. Never UI-first.
2. **API-first**: Every data operation goes through `/api/` routes. No direct DB calls from pages.
3. **Feature flags**: Unfinished features are hidden, not half-built. See `lib/feature-flags.ts`.
4. **Design tokens**: Colors, fonts, spacing defined once in `DESIGN.md` and `globals.css`. Never ad-hoc.
5. **Component-first**: Every UI pattern becomes a reusable component before being used on a page.
6. **Admin-first**: Build verification, moderation, and audit tooling early.
7. **No dead code**: If it's not used, delete it. No commented-out blocks. No placeholder pages.

---

## Community Reputation Model

Instead of followers/likes, JainZBharat uses a **Contribution Score** system:

```
Contribution Score = weighted sum of:
  - Declaration signed (+100)
  - Volunteer hours logged (+10/hour)
  - Events attended (+25/event)
  - Mentorship sessions (+50/session)
  - Open source contributions (+30/PR)
  - Courses completed (+40/course)
  - Community service (+20/activity)
  - Referrals (+15/referral)
```

Displayed on profiles, certificates, and JainZ ID cards. Never gamified — no leaderboards. Contribution is its own reward.

---

## JainZ Constitution

The Declaration is the heart of the platform. It is:

- **Permanent** — Every version is archived forever
- **Versioned** — `v1.0`, `v1.1`, `v2.0`, etc.
- **Comparable** — Users can diff versions
- **Signable** — Signing creates a permanent record with JainZ ID
- **Governance** — Future versions require community input

Constitution sections:
1. Vision
2. Mission
3. Values (12 core values)
4. Principles (6 founding principles)
5. Commitments (5 platform commitments)
6. Governance model
7. Community rules
8. Moderation policy
9. Privacy commitment
10. Open source commitment

---

## Release Plan

| Milestone | Target | Deliverable |
|-----------|--------|-------------|
| **v0.1 — Foundation** | Week 1 | Build passes, foundation docs, design system |
| **v0.2 — Core Identity** | Week 2–3 | Declaration, Signing Wall, JainZ IDs, Certificates |
| **v0.3 — Auth & Profiles** | Week 3–4 | Clerk integration, profile pages, dashboard skeleton |
| **v0.4 — Directories** | Week 5–7 | Founder, Student, Volunteer directories |
| **v0.5 — Events & Search** | Week 7–9 | Global calendar, full-text search |
| **v0.6 — Maps & Navkar** | Week 9–11 | Interactive globe, Navkar Siddhi tracker |
| **v1.0 — Public Launch** | Week 12 | Admin dashboard, security audit, Lighthouse 95+ |

---

## Feature Flags

```typescript
// lib/feature-flags.ts
export const features = {
  // Phase 1 — Core Identity
  DECLARATION: true,
  SIGNING_WALL: true,
  CERTIFICATES: true,
  JAINZ_ID: true,
  BADGES: true,

  // Phase 2 — Directories
  DASHBOARD: false,
  FOUNDER_DIRECTORY: false,
  STUDENT_DIRECTORY: false,
  PROFESSIONAL_DIRECTORY: false,
  VOLUNTEER_DIRECTORY: false,
  MENTOR_DIRECTORY: false,
  SANGH_DIRECTORY: false,
  TEMPLE_DIRECTORY: false,
  NGO_DIRECTORY: false,
  EVENTS: false,
  SEARCH: false,

  // Phase 3 — Advanced
  GLOBE: false,
  NAVKAR: false,
  ANALYTICS: false,
  ADMIN: false,

  // Phase 4 — Future
  JAINGPT: false,
  PASSPORT: false,
  LEARNING: false,
  JOBS: false,
  MARKETPLACE: false,
} as const;
```

---

## AI Agent Rules

1. **PRODUCT.md is the source of truth.** Never contradict it.
2. **DESIGN.md governs all visual decisions.** Never invent UI styles.
3. **CONTRIBUTING.md governs all code decisions.** Follow the standards.
4. **One feature per PR.** Never mix features.
5. **Build must pass before committing.** Always run `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
6. **No TODO comments.** Either implement it or don't write the code.
7. **No console.log in production code.** Use Sentry or structured logging.
8. **No `any` type.** Define proper types or use `unknown`.
9. **No placeholder pages.** Use feature flags and Coming Soon component.
10. **Prefer server components.** Use `'use client'` only when interaction is required.
