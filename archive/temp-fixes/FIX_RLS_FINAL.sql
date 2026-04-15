-- FINAL RLS FIX - Dette SKAL fungere!
-- Problemet: INSERT-policyen tillater ikke anonyme brukere

-- Steg 1: Se hva INSERT-policyen faktisk sier
SELECT 
  policyname, 
  cmd, 
  roles,
  with_check
FROM pg_policies 
WHERE tablename = 'onboarding_responses'
AND cmd = 'INSERT';

-- Steg 2: Drop ALLE eksisterende INSERT policies
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;
DROP POLICY IF EXISTS "onboarding_responses_insert_policy" ON onboarding_responses;
DROP POLICY IF EXISTS "onboarding_responses_anon_insert" ON onboarding_responses;

-- Steg 3: Opprett ny INSERT policy som EKSPLISITT tillater anon
CREATE POLICY "onboarding_responses_anon_insert"
  ON onboarding_responses 
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Steg 4: Verifiser at policyen er riktig
SELECT 
  policyname, 
  cmd, 
  roles,
  with_check
FROM pg_policies 
WHERE tablename = 'onboarding_responses'
AND cmd = 'INSERT';

-- Forventet resultat:
-- roles skal være: {authenticated,anon}
-- Hvis du ser bare {authenticated}, er det feil!

-- Steg 5: Test at det fungerer (skal fungere nå!)
-- Denne simulerer en anonym bruker fra nettleseren
INSERT INTO onboarding_responses (
  type, 
  goals, 
  current_usage, 
  pain_points, 
  name, 
  email, 
  consent
)
VALUES (
  'personal',
  ARRAY['Test from SQL'],
  'Testing anonymous insert',
  'Test pain',
  'SQL Test User',
  'sqltest@example.com',
  true
);

-- Hvis INSERT over fungerer, test fra nettleseren igjen!

