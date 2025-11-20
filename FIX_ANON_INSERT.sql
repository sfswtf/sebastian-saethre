-- FIX ANONYMOUS USER INSERT - Dette garanterer at anonymous users kan sende inn skjema
-- Kjør dette i Supabase SQL Editor

-- ============================================
-- STEP 1: Drop ALLE eksisterende policies
-- ============================================
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'onboarding_responses'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON onboarding_responses', r.policyname);
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- Drop manuelt også
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;
DROP POLICY IF EXISTS "Allow anonymous and authenticated users to insert onboarding responses" ON onboarding_responses;
DROP POLICY IF EXISTS "Allow insert for all users" ON onboarding_responses;
DROP POLICY IF EXISTS "onboarding_insert_anon" ON onboarding_responses;
DROP POLICY IF EXISTS "onboarding_insert_authenticated" ON onboarding_responses;
DROP POLICY IF EXISTS "onboarding_select_admin" ON onboarding_responses;
DROP POLICY IF EXISTS "Admins can view onboarding responses" ON onboarding_responses;
DROP POLICY IF EXISTS "Only admins can view onboarding responses" ON onboarding_responses;

-- ============================================
-- STEP 2: Sjekk at alle kolonner eksisterer
-- ============================================
ALTER TABLE onboarding_responses 
ADD COLUMN IF NOT EXISTS current_usage_options TEXT[],
ADD COLUMN IF NOT EXISTS pain_points_options TEXT[],
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT;

-- ============================================
-- STEP 3: Aktiver RLS
-- ============================================
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: Opprett ENKEL policy for anonymous inserts
-- Dette er den viktigste delen - må være helt enkel
-- ============================================
CREATE POLICY "anon_can_insert_onboarding"
ON onboarding_responses
FOR INSERT
TO anon
WITH CHECK (true);

-- ============================================
-- STEP 5: Opprett policy for authenticated users også
-- ============================================
CREATE POLICY "authenticated_can_insert_onboarding"
ON onboarding_responses
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- STEP 6: Opprett SELECT policy for admins
-- ============================================
CREATE POLICY "admins_can_select_onboarding"
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
-- STEP 7: Verifiser policies
-- ============================================
SELECT 
  'POLICIES:' as info,
  policyname,
  cmd as command,
  roles::text as roles
FROM pg_policies
WHERE tablename = 'onboarding_responses'
ORDER BY policyname;

-- ============================================
-- STEP 8: Test som anonymous user (viktig!)
-- ============================================
-- Dette simulerer hva nettsiden gjør
SET LOCAL ROLE anon;

-- Test insert
DO $$
DECLARE
  test_id uuid;
BEGIN
  INSERT INTO onboarding_responses (
    type,
    goals,
    current_usage,
    current_usage_options,
    pain_points,
    pain_points_options,
    name,
    email,
    phone,
    company_name,
    industry,
    consent
  ) VALUES (
    'personal',
    ARRAY['Test'],
    'Test',
    ARRAY['None'],
    'Test',
    ARRAY['Test'],
    'Anon Test',
    'anon-final-test-' || extract(epoch from now())::text || '@test.com',
    NULL,
    NULL,
    NULL,
    true
  ) RETURNING id INTO test_id;
  
  RAISE NOTICE '✅ SUCCESS! Anonymous insert worked! ID: %', test_id;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ ERROR: %', SQLERRM;
  RAISE NOTICE 'Error Code: %', SQLSTATE;
END $$;

RESET ROLE;

-- ============================================
-- RESULTAT
-- ============================================
-- Hvis du ser "✅ SUCCESS! Anonymous insert worked!" over, 
-- betyr det at policyen fungerer og nettsiden skal fungere nå!

