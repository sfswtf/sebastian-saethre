-- RLS FIX - Denne SKAL fungere!
-- Problemet: Original policy mangler "TO authenticated, anon"

-- Steg 1: Drop den eksisterende policy (den mangler "TO authenticated, anon")
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;

-- Steg 2: Opprett ny policy MED "TO authenticated, anon" (Dette er nøkkelen!)
CREATE POLICY "Anyone can submit an onboarding response"
  ON onboarding_responses 
  FOR INSERT
  TO authenticated, anon  -- <-- DETTE MANGLER I ORIGINAL!
  WITH CHECK (true);

-- Steg 3: Verifiser at policy er opprettet riktig
SELECT 
  policyname, 
  cmd, 
  roles,
  with_check
FROM pg_policies 
WHERE tablename = 'onboarding_responses';

-- Steg 4: Test INSERT (skal fungere nå!)
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
  ARRAY['Test'],
  'Testing RLS fix',
  'Test pain',
  'Test User',
  'test@example.com',
  true
);

-- Hvis INSERT over fungerer, er alt fikset! ✅

