# Deployment Guide

## Prerequisites

- Node.js 22+
- pnpm (enable via `corepack enable`)
- A Vercel account
- A Clerk application
- A Supabase project
- A Resend API key (for email)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in all values. See `.env.example` for detailed descriptions of each variable.

## Supabase

### 1. Create a project

Create a Supabase project at https://supabase.com.

### 2. Run migrations

Open the SQL Editor in the Supabase Dashboard and run in order:

1. `supabase/migrations/202607040001_initial_schema.sql`
2. `supabase/migrations/202607040002_storage.sql`
3. `supabase/migrations/202607040003_full_extensions.sql`

### 3. Seed data

Run `supabase/seed/seed.sql` in the SQL Editor.

### 4. Storage buckets

Migration #2 creates these public buckets:
- `avatars` — Profile images (2MB, JPEG/PNG/WebP)
- `certificates` — Certificate PDFs (5MB, PDF/PNG)
- `events` — Event galleries (10MB, JPEG/PNG/WebP)
- `sanghs` — Sangh images (5MB, JPEG/PNG/WebP)
- `projects` — Project images (10MB, JPEG/PNG/WebP)

### 5. Row Level Security

All tables have RLS enabled with policies defined in migrations. Key policies:
- Profiles: public read, self-write
- Signatures: public read, authenticated insert
- Directories: verified entries readable, admin write
- Audit logs: admin-only read, service-insert
- Storage: public read, user-own write

## Clerk

### 1. Create an application

Create an application at https://dashboard.clerk.com.

### 2. Configure providers

Under User & Authentication > Social Login, enable:
- Google
- GitHub

### 3. Configure URLs

- Sign-in URL: `/sign-in`
- Sign-up URL: `/sign-up`
- After sign-in: `/dashboard`
- After sign-up: `/dashboard`

### 4. Environment variables

Add these to Vercel:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### 5. Webhooks (optional)

For real-time data sync, configure a webhook pointing to:
`https://your-domain.com/api/webhooks/clerk`

## Resend

### 1. Create an API key

Create a key at https://resend.com/api-keys.

### 2. Verify domain

Add and verify your sending domain in Resend DNS settings.

### 3. Environment variable

Set `RESEND_API_KEY` in Vercel.

## Vercel

### 1. Import repository

Connect your GitHub repository to Vercel.

### 2. Configure project

- Framework preset: Next.js
- Build command: `pnpm build`
- Install command: `pnpm install`
- Root directory: `./jainzbharat-main` (if using monorepo)

### 3. Environment variables

Add ALL variables from `.env.example` to Vercel Project Settings > Environment Variables.

### 4. Deploy

Deploy from the Vercel dashboard or via `vercel --prod`.

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Yes | Canonical app URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `RESEND_API_KEY` | No (email disabled) | Resend API key |
| `NEXT_PUBLIC_POSTHOG_KEY` | No (analytics disabled) | PostHog project key |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog host URL |
| `NEXT_PUBLIC_SENTRY_DSN` | No (monitoring disabled) | Sentry DSN |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | No (maps disabled) | Mapbox access token |
| `STRIPE_SECRET_KEY` | No (payments disabled) | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook secret |

## Post-Deployment Checklist

- [ ] Clerk login works (Google, GitHub, Email)
- [ ] Declaration page loads
- [ ] Sign declaration flow completes end-to-end
- [ ] Signing wall displays signatures
- [ ] JainZ ID generation creates unique IDs
- [ ] Certificate API returns QR code
- [ ] Badge API returns embed codes
- [ ] Profile page loads for authenticated users
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] Dark mode renders correctly
- [ ] SEO metadata present on all pages
- [ ] Sentry error reporting active
- [ ] Rate limiting protects API routes
