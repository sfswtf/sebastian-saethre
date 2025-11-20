-- DEBUG ONBOARDING FORM - Finn ut hvorfor det ikke fungerer
-- Kjør denne i Supabase SQL Editor

-- 1. Sjekk tabellstruktur
SELECT 
  'TABLE STRUCTURE:' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'onboarding_responses'
ORDER BY ordinal_position;

-- 2. Sjekk RLS status
SELECT 
  'RLS STATUS:' as info,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'onboarding_responses';

-- 3. Vis ALLE policies (viktig!)
SELECT 
  'POLICIES:' as info,
  policyname,
  cmd as command,
  roles::text as allowed_roles,
  qual as using_expression,
  with_check as check_expression
FROM pg_policies
WHERE tablename = 'onboarding_responses';

-- 4. Test INSERT med eksakt samme struktur som nettsiden bruker
-- Dette skal fungere hvis RLS er riktig
DO $$
DECLARE
  test_id uuid;
BEGIN
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
    ARRAY['Learning'],
    'Test usage',
    ARRAY['None'],
    'Test pain',
    ARRAY['I dont know where to start'],
    'SQL Test User',
    'sql-test-' || extract(epoch from now())::text || '@test.com',
    NULL,
    NULL,
    NULL,
    true
  ) RETURNING id INTO test_id;
  
  RAISE NOTICE 'SUCCESS! Insert worked. ID: %', test_id;
  
  -- Vis den nye raden
  SELECT 
    'INSERTED ROW:' as status,
    id,
    name,
    email,
    type,
    created_at
  FROM onboarding_responses
  WHERE id = test_id;
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'ERROR: %', SQLERRM;
  RAISE NOTICE 'Error Code: %', SQLSTATE;
END $$;

-- 5. Sjekk om det finnes noen rader i tabellen
SELECT 
  'EXISTING ROWS:' as info,
  COUNT(*) as total_rows,
  MAX(created_at) as latest_submission
FROM onboarding_responses;

-- 6. Vis de siste 5 radene (hvis noen finnes)
SELECT 
  'RECENT SUBMISSIONS:' as info,
  id,
  name,
  email,
  type,
  created_at
FROM onboarding_responses
ORDER BY created_at DESC
LIMIT 5;

