-- COMPREHENSIVE DIAGNOSE AND FIX FOR ONBOARDING_RESPONSES
-- Run this to see what's wrong and fix it

-- ============================================
-- STEP 1: DIAGNOSE - Show current state
-- ============================================
SELECT '=== CURRENT RLS STATUS ===' as info;
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'onboarding_responses';

SELECT '=== CURRENT POLICIES ===' as info;
SELECT 
  policyname,
  cmd as operation,
  roles::text as roles,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'onboarding_responses'
ORDER BY policyname;

-- ============================================
-- STEP 2: NUCLEAR OPTION - Drop everything
-- ============================================
SELECT '=== DROPPING ALL POLICIES ===' as info;

-- Drop all policies by name
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "onboarding_responses_anon_insert" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "Allow anyone to insert onboarding responses" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "anon_insert_onboarding_responses" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "authenticated_can_insert_onboarding" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "anon_can_insert_onboarding" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "Only admins can view onboarding responses" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "Admins can view onboarding responses" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "admins_select_onboarding_responses" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "admins_can_select_onboarding" ON onboarding_responses CASCADE;

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
-- STEP 3: TEMPORARILY DISABLE RLS (TEST MODE)
-- ============================================
SELECT '=== DISABLING RLS FOR TESTING ===' as info;
ALTER TABLE onboarding_responses DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: TEST INSERT (Should work now)
-- ============================================
SELECT '=== TESTING INSERT (RLS DISABLED) ===' as info;
-- This should work now - try inserting from your website

-- ============================================
-- STEP 5: RE-ENABLE RLS AND CREATE POLICIES
-- ============================================
-- After confirming the insert works, run this section:

-- Re-enable RLS
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Create the most permissive policy possible
CREATE POLICY "allow_all_inserts_onboarding"
ON onboarding_responses
FOR INSERT
TO public
WITH CHECK (true);

-- Also create explicit anon policy
CREATE POLICY "allow_anon_inserts_onboarding"
ON onboarding_responses
FOR INSERT
TO anon
WITH CHECK (true);

-- Also create explicit authenticated policy
CREATE POLICY "allow_authenticated_inserts_onboarding"
ON onboarding_responses
FOR INSERT
TO authenticated
WITH CHECK (true);

-- SELECT policy for admins
CREATE POLICY "admins_can_read_onboarding"
ON onboarding_responses
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- ============================================
-- STEP 6: VERIFY POLICIES
-- ============================================
SELECT '=== VERIFIED POLICIES ===' as info;
SELECT 
  policyname,
  cmd as operation,
  roles::text as roles,
  with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'onboarding_responses'
ORDER BY policyname;

-- ============================================
-- INSTRUCTIONS:
-- ============================================
-- 1. Run the entire script
-- 2. Check if test insert works (RLS disabled)
-- 3. If it works, the policies section will be applied
-- 4. Test again from website
-- 5. If still broken, keep RLS disabled temporarily

