# Architecture

The platform uses the Next.js App Router with server components for public pages and route handlers for API workflows. Supabase PostgreSQL owns permanent records such as JainZ IDs, declaration versions, signatures, directories, events, certificates, and audit logs. Clerk owns authentication. Middleware applies baseline security headers.

## Modules

- Declaration: immutable version archive and signing workflow.
- JainZ ID: sequence-backed permanent IDs with public profile URLs.
- Signing Wall: searchable and filterable public signature records.
- Certificates and badges: verifiable artifacts with QR-backed URLs.
- Directories: founders, students, professionals, volunteers, mentors, sanghs, temples, NGOs.
- Community: contribution score, volunteer hours, mentorship, achievements.
- Admin: verification, moderation, reports, analytics, audit logs.
