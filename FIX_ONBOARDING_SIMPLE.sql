-- ENKEL FIX FOR ONBOARDING FORM
-- Kjør denne hvis den andre filen ikke fungerer

-- 1. Legg til manglende kolonner
ALTER TABLE onboarding_responses 
ADD COLUMN IF NOT EXISTS current_usage_options TEXT[],
ADD COLUMN IF NOT EXISTS pain_points_options TEXT[],
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT;

-- 2. Aktiver RLS
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- 3. Drop alle eksisterende INSERT policies
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;
DROP POLICY IF EXISTS "Allow anonymous and authenticated users to insert onboarding responses" ON onboarding_responses;
DROP POLICY IF EXISTS "onboarding_responses_insert_policy" ON onboarding_responses;

-- 4. Opprett ny INSERT policy (MÅ ha både authenticated og anon)
CREATE POLICY "Allow insert for all users"
ON onboarding_responses
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- 5. Test at det fungerer
INSERT INTO onboarding_responses (
  type, goals, current_usage, name, email, consent
) VALUES (
  'personal', ARRAY['Test'], 'Test', 'Test User', 'test@test.com', true
);

-- Hvis du ser en rad over, fungerer det! Slett test-raden:
-- DELETE FROM onboarding_responses WHERE email = 'test@test.com';

