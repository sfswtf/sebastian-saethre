-- COMPLETE DIAGNOSTIC AND FIX FOR ONBOARDING_RESPONSES
-- This will show what's wrong and fix it properly

-- ============================================
-- STEP 1: DIAGNOSE - Show current state
-- ============================================
SELECT '=== RLS STATUS ===' as step;
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'onboarding_responses';

SELECT '=== CURRENT POLICIES ===' as step;
SELECT 
  policyname,
  cmd as operation,
  roles::text as roles,
  qual as using_clause,
  with_check as with_check_clause
FROM pg_policies 
WHERE tablename = 'onboarding_responses'
ORDER BY policyname;

-- ============================================
-- STEP 2: COMPARE WITH WORKING TABLE
-- ============================================
SELECT '=== CONTACT_MESSAGES POLICIES (WORKING) ===' as step;
SELECT 
  policyname,
  cmd as operation,
  roles::text as roles,
  with_check as with_check_clause
FROM pg_policies 
WHERE tablename = 'contact_messages'
AND cmd = 'INSERT';

-- ============================================
-- STEP 3: NUCLEAR OPTION - Remove everything
-- ============================================
SELECT '=== DROPPING ALL POLICIES ===' as step;

-- Drop all policies by name
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "allow_all_inserts" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "anon_can_insert_onboarding" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "authenticated_can_insert_onboarding" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "allow_anon_inserts_onboarding" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "allow_authenticated_inserts_onboarding" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "allow_all_inserts_onboarding" ON onboarding_responses CASCADE;

-- Drop any remaining policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'onboarding_responses'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON onboarding_responses CASCADE', r.policyname);
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- ============================================
-- STEP 4: Ensure table structure is correct
-- ============================================
SELECT '=== ENSURING TABLE EXISTS ===' as step;
CREATE TABLE IF NOT EXISTS onboarding_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('personal', 'professional')),
  goals TEXT[],
  current_usage TEXT,
  pain_points TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  consent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- STEP 5: Reset RLS (clear any cache)
-- ============================================
SELECT '=== RESETTING RLS ===' as step;
ALTER TABLE onboarding_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 6: Create policy EXACTLY like contact_messages
-- ============================================
SELECT '=== CREATING POLICY (EXACT MATCH) ===' as step;

-- This is the EXACT same policy that works for contact_messages
CREATE POLICY "Anyone can submit an onboarding response"
ON onboarding_responses
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- ============================================
-- STEP 7: Verify the policy was created
-- ============================================
SELECT '=== VERIFICATION ===' as step;
SELECT 
  policyname,
  cmd as operation,
  roles::text as roles,
  with_check as with_check_clause
FROM pg_policies 
WHERE tablename = 'onboarding_responses'
ORDER BY policyname;

-- Should show one policy: "Anyone can submit an onboarding response"
-- with cmd='INSERT', roles='{authenticated,anon}', with_check='true'

-- ============================================
-- STEP 8: Test query (simulate anon insert)
-- ============================================
SELECT '=== TEST COMPLETE ===' as step;
SELECT 'Now test from your website. If it still fails, check:' as info;
SELECT '1. Supabase project settings → API → anon key matches .env' as check;
SELECT '2. Netlify environment variables are set correctly' as check;
SELECT '3. Browser console shows correct Supabase URL and key length' as check;

