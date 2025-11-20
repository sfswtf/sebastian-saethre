-- FIX ONBOARDING FORM SUBMISSION TO SUPABASE
-- Kjør denne i Supabase SQL Editor for å fikse RLS-policies og tabellstruktur

-- ============================================
-- STEP 1: Sjekk tabellstruktur og legg til manglende kolonner
-- ============================================

-- Legg til nye kolonner hvis de ikke finnes
ALTER TABLE onboarding_responses 
ADD COLUMN IF NOT EXISTS current_usage_options TEXT[],
ADD COLUMN IF NOT EXISTS pain_points_options TEXT[],
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT;

-- ============================================
-- STEP 2: Sjekk at RLS er aktivert
-- ============================================

ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Drop ALLE eksisterende policies
-- ============================================

-- Drop alle eksisterende policies på en gang
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

-- ============================================
-- STEP 4: Opprett ny INSERT policy som tillater anonymous users
-- ============================================

-- Dette er den viktigste policy - den må tillate både authenticated OG anon
CREATE POLICY "Allow anonymous and authenticated users to insert onboarding responses"
ON onboarding_responses
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- ============================================
-- STEP 5: Opprett SELECT policy for admins (valgfritt, men anbefalt)
-- ============================================

-- Tillat admins å se alle innsendinger
CREATE POLICY "Admins can view onboarding responses"
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
-- STEP 6: Verifiser at policies er opprettet
-- ============================================

SELECT 
  'POLICIES CREATED:' as status,
  policyname,
  cmd as command,
  roles::text as allowed_roles,
  with_check as check_condition
FROM pg_policies 
WHERE tablename = 'onboarding_responses'
ORDER BY policyname;

-- ============================================
-- STEP 7: Test INSERT som anonymous user
-- ============================================

-- Dette skal fungere nå (selv om du er logget inn, tester vi anonymous)
-- Hvis dette feiler, er det fortsatt et problem med RLS
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
  ARRAY['Test Goal'],
  'Test usage',
  ARRAY['Test Option'],
  'Test pain point',
  ARRAY['Test Pain Option'],
  'Test User',
  'test@example.com',
  '12345678',
  NULL,
  NULL,
  true
);

-- Sjekk at insert fungerte
SELECT 
  'TEST INSERT SUCCESSFUL!' as status,
  id,
  name,
  email,
  type,
  created_at
FROM onboarding_responses
WHERE email = 'test@example.com'
ORDER BY created_at DESC
LIMIT 1;

-- ============================================
-- STEP 8: Rydd opp test-data (valgfritt)
-- ============================================

-- Fjern test-innsendingen hvis du vil
-- DELETE FROM onboarding_responses WHERE email = 'test@example.com';

-- ============================================
-- RESULTAT
-- ============================================
-- Hvis du ser "TEST INSERT SUCCESSFUL!" over, betyr det at RLS er riktig konfigurert
-- Hvis du får en feilmelding, sjekk:
-- 1. At tabellen eksisterer
-- 2. At alle kolonner eksisterer
-- 3. At RLS er aktivert
-- 4. At policies er opprettet (sjekk output fra STEP 6)

