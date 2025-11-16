# Repository Cleanup Plan

## Files to KEEP (Essential)

### SQL Migrations (Keep in `supabase/migrations/`)
- `supabase/migrations/20250121120000_create_onboarding_responses.sql`
- `supabase/migrations/20250121120001_add_affiliate_links_to_blog.sql`
- `supabase/migrations/20250121120002_create_content_tables.sql`
- Any other numbered migration files

### Documentation (Keep only essential)
- `README.md` (if exists, or create one)
- `IMPLEMENTATION_PLAN.md` (useful reference)
- `SETUP_GUIDE.md` (if it's the main setup guide)

## Files to ARCHIVE (Move to `archive/temp-fixes/`)

### Temporary SQL Fixes
- `ALTERNATIVE_FIX_BYPASS_RLS.sql`
- `CHECK_AND_FIX_RLS.sql`
- `COMPLETE_ONBOARDING_FIX.sql`
- `DIAGNOSE_AND_FIX_ONBOARDING.sql`
- `FIX_401_ERROR.sql`
- `FIX_ALL_ISSUES.sql`
- `FIX_ALL_TABLES_RLS.sql`
- `FIX_ONBOARDING_RLS_AGGRESSIVE.sql`
- `FIX_ONBOARDING_RLS_EXACT_MATCH.sql`
- `FIX_ONBOARDING_RLS_FINAL.sql`
- `FIX_ONBOARDING_RLS_WORKING.sql`
- `FIX_RLS_COMPLETE.sql`
- `FIX_RLS_FINAL.sql`
- `FIX_RLS_RIKTIG.sql`
- `QUICK_FIX_ADMIN_RLS.sql`
- `QUICK_FIX_DISABLE_RLS.sql`

### Temporary Documentation
- `COMPLETE_FIX_GUIDE.md`
- `COMPLETE_SETUP_GUIDE.md`
- `COMPREHENSIVE_BUG_FIXES.md`
- `DEBUG_SUPABASE.md`
- `FIX_ADMIN_AUTH.md`
- `FIX_ADMIN_SUPABASE.md`
- `FIX_BLANK_PAGES.md`
- `FIX_NETLIFY_BRANCH.md`
- `FIX_ONBOARDING_NOW.md`
- `FIX_ONBOARDING_RLS.md`
- `NETLIFY_FIX_SUMMARY.md`
- `NETLIFY_SETUP_GUIDE.md`
- `NETLIFY_STEP_BY_STEP.md`
- `ONBOARDING_RLS_TROUBLESHOOTING.md`
- `RLS_FIX_DETALJERT.md`
- `RUN_MIGRATIONS.md`
- `SUPABASE_INTEGRATION_STATUS.md`
- `SUPABASE_SETUP.md`
- `TROUBLESHOOTING_ONBOARDING.md`
- `URGENT_FIX_DNS_ERROR.md`

## Action Plan

1. Create `archive/temp-fixes/` directory
2. Move all temporary files there
3. Add `archive/` to `.gitignore` (optional - you might want to keep them in git for history)
4. Keep only essential migrations and docs in root

