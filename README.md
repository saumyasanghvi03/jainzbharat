# JainZBharat

JainZBharat is a production-oriented Next.js App Router platform for values-led contribution, learning, service, directories, public profiles, declaration signing, certificates, maps, and governance.

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
