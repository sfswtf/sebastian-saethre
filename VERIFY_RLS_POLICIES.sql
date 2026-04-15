-- VERIFISER RLS POLICIES FOR ONBOARDING
-- Kjør dette for å se hva som faktisk er satt opp

-- 1. Sjekk alle policies på tabellen
SELECT 
  'POLICIES:' as info,
  policyname,
  cmd as command,
  roles::text as allowed_roles,
  qual as using_expression,
  with_check as check_expression
FROM pg_policies
WHERE tablename = 'onboarding_responses'
ORDER BY policyname;

-- 2. Sjekk om RLS er aktivert
SELECT 
  'RLS STATUS:' as info,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'onboarding_responses';

-- 3. Test om anonymous user faktisk kan insert
-- Dette simulerer hva nettsiden gjør
-- Hvis dette feiler, er policyen ikke riktig satt opp

-- Først, sett rollen til anon (anonymous)
SET ROLE anon;

-- Prøv å insert
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
  ARRAY['Test from anon role'],
  'Test',
  ARRAY['None'],
  'Test',
  ARRAY['Test'],
  'Anon Test User',
  'anon-test-' || extract(epoch from now())::text || '@test.com',
  NULL,
  NULL,
  NULL,
  true
) RETURNING id, name, email, created_at;

-- Tilbake til postgres role
RESET ROLE;

-- 4. Sjekk om insert fungerte
SELECT 
  'ANON INSERT RESULT:' as info,
  id,
  name,
  email,
  created_at
FROM onboarding_responses
WHERE email LIKE 'anon-test-%'
ORDER BY created_at DESC
LIMIT 1;

