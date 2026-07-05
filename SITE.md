# JainZBharat — Site Documentation

## 1. Vision

A trusted global home where timeless Indian wisdom guides ethical innovation, meaningful collaboration, and lifelong service.

## 2. Stitch Project

- **Project ID**: `8547329911524445392` (stitch.json)
- **Provider**: google-stitch

## 3. Tech Stack

Next.js 16 (App Router) + Tailwind CSS v4 + shadcn/ui + Clerk + Supabase. All pages are React components (not static HTML).

## 4. Sitemap (Existing Pages)

All pages are Next.js App Router routes under `app/`:

- `/` — Landing page
- `/about` — About / mission
- `/declaration` — Full JainZBharat Declaration v1.0
- `/sign-declaration` — Sign the declaration form
- `/signing-wall` — Public signatures (Supabase)
- `/events` — Events list
- `/map` — Global map
- `/navkar-heatmap` — Navkar Siddhi embedded
- `/global-map` — 3D globe
- `/dashboard` — User dashboard (requires auth)
- `/profile` — Profile settings (requires auth)
- `/admin` — Admin panel (requires auth)
- `/founders`, `/students`, `/professionals`, `/volunteers`, `/mentors` — Directory pages
- `/sanghs`, `/temples`, `/ngos` — Organization directories
- `/learning` — Learning hub
- `/jainz/[id]` — Public JainZ ID profiles
- `/sign-in`, `/sign-up` — Clerk auth pages
- `/api/*` — API routes (declaration/sign, jainz-id, badges, certificates, search)

## 5. Roadmap

See ROADMAP.md for the full product roadmap. Current focus: Phase 1 milestone completion (Declaration, Signing Wall, JainZ IDs, Certificates, Badges, Auth).

## 6. Design System

See DESIGN.md for all design tokens (colors, typography, spacing, shadows, glass card styles, component standards, page layout, animation, accessibility).

## 7. Design Guidelines for Stitch

When generating new page designs with Stitch:
- Use the design tokens from DESIGN.md (dark mode, orange primary, emerald secondary, amber accent)
- Glassmorphism cards with backdrop-blur
- Max width: max-w-7xl (1280px)
- Space Grotesk for headings, Inter for body
- Rounded-2xl for cards, rounded-full for buttons
- Dark background (#080b12), card surfaces (#0e121a)
