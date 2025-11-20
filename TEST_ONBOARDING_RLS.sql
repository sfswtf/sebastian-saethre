-- TEST ONBOARDING RLS - Kjør denne for å verifisere at RLS fungerer
-- Dette simulerer en anonymous insert som nettsiden gjør

-- 1. Sjekk at tabellen eksisterer og har riktig struktur
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'onboarding_responses'
ORDER BY ordinal_position;

-- 2. Sjekk at RLS er aktivert
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'onboarding_responses';

-- 3. Vis alle policies
SELECT 
  policyname,
  cmd as command,
  roles::text as allowed_roles,
  qual as using_expression,
  with_check as check_expression
FROM pg_policies
WHERE tablename = 'onboarding_responses';

-- 4. Test INSERT som anonymous user (dette simulerer hva nettsiden gjør)
-- Dette skal fungere hvis RLS er riktig konfigurert
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
  ARRAY['Learning', 'Productivity'],
  'Not using AI yet',
  ARRAY['None'],
  'Need help getting started',
  ARRAY['I dont know where to start'],
  'Test User From SQL',
  'test-sql@example.com',
  NULL,
  NULL,
  NULL,
  true
) RETURNING id, name, email, type, created_at;

-- 5. Sjekk at insert fungerte (skal vise raden over)
SELECT 
  id,
  name,
  email,
  type,
  goals,
  current_usage_options,
  pain_points_options,
  company_name,
  industry,
  consent,
  created_at
FROM onboarding_responses
WHERE email = 'test-sql@example.com'
ORDER BY created_at DESC;

-- 6. Hvis du ser raden over, fungerer RLS! 
-- Slett test-raden hvis du vil:
-- DELETE FROM onboarding_responses WHERE email = 'test-sql@example.com';

