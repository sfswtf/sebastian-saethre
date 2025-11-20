-- OPPRETT RPC FUNCTION SOM BYPASSER RLS
-- Dette er en sikker måte å omgå RLS-problemer på
-- Kjør dette i Supabase SQL Editor

-- ============================================
-- STEP 1: Opprett RPC function som kan insert uten RLS
-- ============================================
CREATE OR REPLACE FUNCTION insert_onboarding_response(
  p_type TEXT,
  p_goals TEXT[],
  p_current_usage TEXT,
  p_current_usage_options TEXT[],
  p_pain_points TEXT,
  p_pain_points_options TEXT[],
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_company_name TEXT DEFAULT NULL,
  p_industry TEXT DEFAULT NULL,
  p_consent BOOLEAN
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER -- Dette er viktig - gir funksjonen admin-rettigheter
AS $$
DECLARE
  new_id uuid;
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
    p_type,
    p_goals,
    p_current_usage,
    p_current_usage_options,
    p_pain_points,
    p_pain_points_options,
    p_name,
    p_email,
    p_phone,
    p_company_name,
    p_industry,
    p_consent
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- ============================================
-- STEP 2: Gi anonymous users tilgang til funksjonen
-- ============================================
GRANT EXECUTE ON FUNCTION insert_onboarding_response TO anon;
GRANT EXECUTE ON FUNCTION insert_onboarding_response TO authenticated;

-- ============================================
-- STEP 3: Test funksjonen
-- ============================================
SELECT insert_onboarding_response(
  'personal'::TEXT,
  ARRAY['Test from RPC']::TEXT[],
  'Test usage'::TEXT,
  ARRAY['None']::TEXT[],
  'Test pain'::TEXT,
  ARRAY['Test']::TEXT[],
  'RPC Test User'::TEXT,
  'rpc-test-' || extract(epoch from now())::text || '@test.com'::TEXT,
  NULL::TEXT,
  NULL::TEXT,
  NULL::TEXT,
  true::BOOLEAN
) as inserted_id;

-- ============================================
-- STEP 4: Verifiser at insert fungerte
-- ============================================
SELECT 
  'RPC TEST RESULT:' as info,
  id,
  name,
  email,
  created_at
FROM onboarding_responses
WHERE email LIKE 'rpc-test-%'
ORDER BY created_at DESC
LIMIT 1;

-- ============================================
-- RESULTAT
-- ============================================
-- Hvis du ser en rad med "RPC Test User" over,
-- betyr det at RPC-funksjonen fungerer!
-- Nettsiden skal nå bruke denne funksjonen i stedet for direkte insert,
-- og den vil fungere uavhengig av RLS-policies.

