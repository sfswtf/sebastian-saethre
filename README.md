# sebastian-saethre-website

Personal site (Vite, React, TypeScript, Tailwind, Supabase). Content and commerce are configured via environment variables and the admin UI.

## Setup

```bash
npm ci
```

Create a `.env` file (or `.env.local`) with at least:

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key

Optional branding and contact values are documented in `src/config/siteConfig.ts` (`VITE_SITE_*`, `VITE_CONTACT_EMAIL`, etc.).

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run preview` — preview the production build

## CI

GitHub Actions runs a production `build` on pushes and pull requests to `main` / `master`. Run `npm run lint` locally when changing TypeScript or React code; the repo still has existing lint debt to clear over time.
