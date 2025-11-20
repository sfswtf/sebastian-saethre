-- VERIFISER AT ANONYMOUS POLICY FUNGERER
-- Kjør dette for å se om policyen faktisk tillater anonymous inserts

-- 1. Vis alle policies
SELECT 
  'CURRENT POLICIES:' as info,
  policyname,
  cmd as command,
  roles::text as roles,
  with_check as check_expression
FROM pg_policies
WHERE tablename = 'onboarding_responses'
ORDER BY policyname;

-- 2. Sjekk grants
SELECT 
  'TABLE GRANTS:' as info,
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'onboarding_responses'
AND grantee IN ('anon', 'authenticated', 'public')
ORDER BY grantee, privilege_type;

-- 3. Test insert som anon (viktig - dette simulerer nettsiden)
-- Dette bruker SECURITY DEFINER for å teste som anonymous
DO $$
DECLARE
  test_id uuid;
BEGIN
  -- Test insert med anon context
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
    ARRAY['Anon Policy Test'],
    'Testing anon policy',
    ARRAY['None'],
    'Test',
    ARRAY['Test'],
    'Anon Policy Test User',
    'anon-policy-test-' || extract(epoch from now())::text || '@test.com',
    NULL,
    NULL,
    NULL,
    true
  ) RETURNING id INTO test_id;
  
  RAISE NOTICE '✅ SUCCESS! Anon policy works! ID: %', test_id;
  
  -- Vis resultatet
  SELECT 
    'ANON TEST RESULT:' as info,
    id,
    name,
    email,
    created_at
  FROM onboarding_responses
  WHERE id = test_id;
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ ERROR: %', SQLERRM;
  RAISE NOTICE 'Error Code: %', SQLSTATE;
  RAISE NOTICE 'This means the anon policy is NOT working!';
END $$;

