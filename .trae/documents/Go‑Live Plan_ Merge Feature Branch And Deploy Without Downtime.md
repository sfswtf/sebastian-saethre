## Goals
- Merge the feature branch safely and ship to production with zero downtime
- Keep repo private and main protected; use Deploy Preview for QA
- Verify Supabase RPCs, env vars, and key flows (Contact, Admin Messages, Onboarding)

## Pre‑Flight Checks
- Translations:
  - Update Norwegian contact modal title to “Takk for meldingen din!” and confirm English: “Thanks for your message!”
- Build & Lint:
  - Run `npm run build` locally; ensure no warnings block deploy
  - Run linter and fix any errors
- Supabase Readiness:
  - Confirm `public.get_contact_messages()` exists and returns rows
  - Confirm policies on `contact_messages` (INSERT for anon/auth, SELECT via admin policy)
  - Ensure env vars available locally and in Netlify: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Feature Review (staging/local):
  - Navbar symmetry and no flicker; centered logo; language flags only
  - Hero spacing and CTA layout; helper text removed
  - Community/Services bottom cards removed
  - Interactive buttons subtle hover without flicker
  - Contact form success modal opens; “View Resources” navigates
  - Admin Messages list shows Supabase rows via RPC

## Branch & Git
- Stay on feature branch (`feature/ui-polish-dec-2025`)
- Rebase/fast‑forward on current `main` — resolve conflicts locally
- Write a clear PR description of UI changes and Supabase RPC fix
- Ensure main branch protection: require PR + review, disallow direct pushes

## Netlify Deploy
- Production stays tied to `main`
- Open PR → Deploy Preview auto‑build
- Verify preview with checklist (below)
- Merge to `main` when approved → Production deploy (no downtime)

## Verification Checklist (Preview & Production)
- Home: hero copy, spacing, buttons, language toggle
- Navbar: left/right clusters balanced, logo centered, Contact+Language far right
- Community/Services: no bottom CTA cards
- Blog list: loads; no onboarding CTA card at bottom
- Contact: submit → modal shows; resources button works
- Admin: Messages tab shows new Supabase rows via RPC; update notes/status works
- Onboarding: submit works; thank‑you modal functions
- Responsive: mobile nav opens/closes; language dropdown alignment

## Rollback Plan
- If issues found post‑merge, use Netlify “Rollback” to previous successful deploy
- Revert PR in GitHub to restore prior `main`

## Security & Access
- Repo visibility: Private
- 2FA enabled for GitHub; limit collaborator access
- Verify Netlify env vars are set for Production and Deploy Previews

## Monitoring & Logs
- Netlify build/deploy logs reviewed on each deploy
- Supabase Logs → check RPC executions and inserts
- Optional: add error tracking (Sentry) later

## Execution Steps
1. Update translation string (“Takk for meldingen din!”) and commit to feature branch
2. Rebase on latest `main`; resolve conflicts; push branch
3. Open PR → review Deploy Preview with checklist
4. Approve & merge to `main` → Production deploy
5. Post‑deploy verification; monitor logs; rollback if needed

Confirm this plan and I’ll perform the translation fix, open the PR, and guide verification through the Deploy Preview.