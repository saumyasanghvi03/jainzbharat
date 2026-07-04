# Deployment Guide

## Vercel

- Framework preset: Next.js
- Install command: `pnpm install`
- Build command: `pnpm build`
- Node.js: LTS 22+

## Supabase

Run SQL files in order:

1. `supabase/migrations/202607040001_initial_schema.sql`
2. `supabase/migrations/202607040002_storage.sql`
3. `supabase/seed/seed.sql`

## Clerk

Enable Google, GitHub, and Email providers. Configure redirect URLs for Vercel preview and production domains.
