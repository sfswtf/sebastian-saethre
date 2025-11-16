-- Sjekk og fiks RLS policy for onboarding_responses
-- Dette vil vise deg eksakt hva som er feil og fikse det

-- Steg 1: Se alle policies på tabellen
SELECT 
  policyname, 
  cmd, 
  roles,
  with_check
FROM pg_policies 
WHERE tablename = 'onboarding_responses';

-- Steg 2: Sjekk spesifikt INSERT-policyen
SELECT 
  policyname,
  cmd,
  roles,
  with_check
FROM pg_policies 
WHERE tablename = 'onboarding_responses'
AND cmd = 'INSERT';

-- Steg 3: Hvis INSERT-policyen IKKE har 'anon' i roles, må vi fikse den
-- Drop alle INSERT policies
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;
DROP POLICY IF EXISTS "onboarding_responses_insert_policy" ON onboarding_responses;
DROP POLICY IF EXISTS "onboarding_responses_anon_insert" ON onboarding_responses;

-- Steg 4: Opprett ny INSERT policy MED 'anon' eksplisitt
CREATE POLICY "onboarding_responses_anon_insert"
  ON onboarding_responses 
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Steg 5: Verifiser at den nye policyen er riktig
SELECT 
  policyname, 
  cmd, 
  roles,
  with_check
FROM pg_policies 
WHERE tablename = 'onboarding_responses'
AND cmd = 'INSERT';

-- Forventet resultat:
-- policyname: onboarding_responses_anon_insert
-- cmd: INSERT
-- roles: {authenticated,anon}  <-- MÅ inneholde 'anon'!
-- with_check: true

-- Steg 6: Test INSERT som anonym bruker (simulerer nettleser)
-- Dette skal fungere nå!
SET ROLE anon;
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
  ARRAY['Test from anon role'],
  'Testing anonymous insert',
  'Test pain',
  'Anon Test User',
  'anon@test.com',
  true
);
RESET ROLE;

-- Hvis INSERT over fungerer, er alt fikset! ✅

