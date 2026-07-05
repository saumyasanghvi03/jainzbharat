# Contributing to JainZBharat

Thank you for contributing to JainZBharat! To ensure the platform remains stable, accessible, and high-performance, we follow a strict contribution workflow.

---

## 1. Branch Naming & Pull Requests
- Create a feature branch off `main` for all changes:
  - `feat/feature-name` for new features.
  - `fix/bug-name` for bug fixes.
  - `docs/doc-name` for documentation updates.
- Work iteratively: **never attempt the whole project in one commit / pull request**.
- Keep PRs focused on a single logical task or issue.

---

## 2. Code Quality & Standards

We maintain zero tolerance for compromises on code quality:
- **No TypeScript suppressions**: Never use `// @ts-ignore`, `// @ts-nocheck`, or the `any` type unless absolutely unavoidable. Use `unknown` or generic interfaces.
- **No dead code / comments**: Do not leave commented-out blocks, `TODO` comments, or unused imports in the codebase.
- **No console logs**: Do not commit `console.log`. Use structured logging or Sentry for error tracking.
- **Strict Server Components**: Default to Server Components for maximum performance. Use `'use client'` only for elements requiring user interaction.

---

## 3. Visual & Component Standards
- Refer to `DESIGN.md` for spacing, typography, colors, and shadows.
- Before building a new page or component, check `components/ui/` for reusable primitives. Do not invent inline ad-hoc designs.

---

## 4. Verification Workflow

Before proposing or merging any change, the following commands must run and succeed locally:

```bash
# 1. Install dependencies
npm install

# 2. Linting (Zero warnings allowed)
npm run lint

# 3. Type checking (Zero errors allowed)
npm run typecheck

# 4. Run tests
npm run test

# 5. Production build check
npm run build
```

The repository must remain deployable to Vercel after every single commit.
