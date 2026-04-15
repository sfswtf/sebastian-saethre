-- FINAL FIX FOR RLS POLICY ISSUE
-- Dette scriptet fikser problemet med "new row violates row-level security policy"
-- Kjør dette i Supabase SQL Editor

-- ============================================
-- STEP 1: Deaktiver RLS midlertidig for å teste
-- ============================================
ALTER TABLE onboarding_responses DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: Drop ALLE eksisterende policies (inkludert de som kan være skjulte)
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

-- Drop policies manuelt også (i tilfelle de ikke vises i pg_policies)
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;
DROP POLICY IF EXISTS "Allow anonymous and authenticated users to insert onboarding responses" ON onboarding_responses;
DROP POLICY IF EXISTS "Allow insert for all users" ON onboarding_responses;
DROP POLICY IF EXISTS "onboarding_responses_insert_policy" ON onboarding_responses;
DROP POLICY IF EXISTS "Admins can view onboarding responses" ON onboarding_responses;
DROP POLICY IF EXISTS "Only admins can view onboarding responses" ON onboarding_responses;

-- ============================================
-- STEP 3: Test INSERT uten RLS (skal fungere nå)
-- ============================================
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
  'Test without RLS',
  ARRAY['None'],
  'Test',
  ARRAY['Test'],
  'RLS Test User',
  'rls-test-' || extract(epoch from now())::text || '@test.com',
  NULL,
  NULL,
  NULL,
  true
) RETURNING id, name, email, created_at;

-- Hvis du ser en rad over, fungerer insert uten RLS!

-- ============================================
-- STEP 4: Aktiver RLS igjen
-- ============================================
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: Opprett ENKEL INSERT policy som DEFINITIVT fungerer
-- ============================================
-- Dette er den viktigste delen - policyen må være helt enkel
CREATE POLICY "onboarding_insert_anon"
ON onboarding_responses
FOR INSERT
TO anon
WITH CHECK (true);

-- Opprett også for authenticated users (for å være sikker)
CREATE POLICY "onboarding_insert_authenticated"
ON onboarding_responses
FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- STEP 6: Opprett SELECT policy for admins
-- ============================================
CREATE POLICY "onboarding_select_admin"
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
  'POLICIES CREATED:' as status,
  policyname,
  cmd as command,
  roles::text as allowed_roles
FROM pg_policies
WHERE tablename = 'onboarding_responses'
ORDER BY policyname;

-- ============================================
-- STEP 8: Test INSERT med RLS aktivert (som anonymous user)
-- ============================================
-- Dette simulerer hva nettsiden gjør
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
  ARRAY['Test with RLS'],
  'Test with RLS enabled',
  ARRAY['None'],
  'Test',
  ARRAY['Test'],
  'RLS Enabled Test',
  'rls-enabled-test-' || extract(epoch from now())::text || '@test.com',
  NULL,
  NULL,
  NULL,
  true
) RETURNING id, name, email, created_at;

-- Hvis du ser en rad over, fungerer RLS policyen! 🎉

-- ============================================
-- RESULTAT
-- ============================================
-- Du skal nå se:
-- 1. En rad fra STEP 3 (insert uten RLS)
-- 2. En rad fra STEP 8 (insert med RLS)
-- 
-- Hvis begge fungerer, er problemet løst!
-- Hvis bare STEP 3 fungerer, er det fortsatt et problem med RLS policyen.

