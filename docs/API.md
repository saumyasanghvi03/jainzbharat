# API Documentation

- `GET /api/jainz-id` returns the JainZ ID format and database generation strategy.
- `POST /api/declaration/sign` validates declaration signatures with Zod and requires rate-limit compliance.
- `GET /api/certificates?jainzId=JZB-2026-000001&name=Name` returns certificate metadata and QR verification data.
- `GET /api/badges?jainzId=JZB-2026-000001` returns LinkedIn, GitHub README, and embeddable badge content.
- `GET /api/search?q=founder` returns searchable platform modules.
