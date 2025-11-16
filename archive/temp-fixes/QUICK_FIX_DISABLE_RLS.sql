-- QUICK FIX: Temporarily disable RLS on onboarding_responses
-- This will allow inserts to work immediately
-- ⚠️ WARNING: This removes security! Only use temporarily!

-- Disable RLS
ALTER TABLE onboarding_responses DISABLE ROW LEVEL SECURITY;

-- Verify it's disabled
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'onboarding_responses';

-- Now try inserting from your website - it should work!

-- ============================================
-- TO RE-ENABLE RLS LATER (after fixing policies):
-- ============================================
-- ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;
-- Then create proper policies

