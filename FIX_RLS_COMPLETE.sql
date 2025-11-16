-- COMPLETE RLS FIX - Kjør denne i Supabase SQL Editor
-- Dette vil fikse 401-feilen EN GANG FOR ALLE

-- Steg 1: Sjekk om tabellen eksisterer
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'onboarding_responses'
);

-- Steg 2: Sjekk om RLS er aktivert
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'onboarding_responses';

-- Steg 3: Aktiver RLS hvis det ikke er aktivert
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Steg 4: Sjekk eksisterende policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'onboarding_responses';

-- Steg 5: Drop ALLE eksisterende policies (for å starte på nytt)
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;
DROP POLICY IF EXISTS "Only admins can view onboarding responses" ON onboarding_responses;
DROP POLICY IF EXISTS "onboarding_responses_insert_policy" ON onboarding_responses;
DROP POLICY IF EXISTS "onboarding_responses_select_policy" ON onboarding_responses;
DROP POLICY IF EXISTS "Enable insert for all users" ON onboarding_responses;
DROP POLICY IF EXISTS "Enable read access for all users" ON onboarding_responses;

-- Steg 6: Opprett INSERT policy (MÅ tillate både authenticated OG anon)
CREATE POLICY "onboarding_responses_insert_policy"
  ON onboarding_responses
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Steg 7: Opprett SELECT policy (kun for admins)
CREATE POLICY "onboarding_responses_select_policy"
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

-- Steg 8: Test INSERT som anonym bruker (skal fungere nå)
-- Kjør denne for å teste:
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
  'Testing RLS policy fix',
  'Test pain',
  'Test User',
  'test@example.com',
  true
);

-- Hvis INSERT over fungerer, er RLS-policyen riktig!
-- Hvis den feiler, sjekk feilmeldingen nøye.

-- Steg 9: Verifiser policies
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'onboarding_responses';

