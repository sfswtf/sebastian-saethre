-- OPPRETT RPC FUNCTION FOR Å HENTE ONBOARDING RESPONSES
-- Dette omgår RLS og lar admin hente data uavhengig av autentisering
-- Kjør dette i Supabase SQL Editor

-- ============================================
-- STEP 1: Opprett RPC function for å hente alle responses
-- ============================================
CREATE OR REPLACE FUNCTION get_onboarding_responses()
RETURNS TABLE (
  id uuid,
  type TEXT,
  goals TEXT[],
  current_usage TEXT,
  current_usage_options TEXT[],
  pain_points TEXT,
  pain_points_options TEXT[],
  name TEXT,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  industry TEXT,
  consent BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER -- Dette gir funksjonen admin-rettigheter
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    onboarding_responses.id,
    onboarding_responses.type,
    onboarding_responses.goals,
    onboarding_responses.current_usage,
    onboarding_responses.current_usage_options,
    onboarding_responses.pain_points,
    onboarding_responses.pain_points_options,
    onboarding_responses.name,
    onboarding_responses.email,
    onboarding_responses.phone,
    onboarding_responses.company_name,
    onboarding_responses.industry,
    onboarding_responses.consent,
    onboarding_responses.created_at
  FROM onboarding_responses
  ORDER BY onboarding_responses.created_at DESC;
END;
$$;

-- ============================================
-- STEP 2: Gi anonymous og authenticated users tilgang til funksjonen
-- ============================================
GRANT EXECUTE ON FUNCTION get_onboarding_responses() TO anon;
GRANT EXECUTE ON FUNCTION get_onboarding_responses() TO authenticated;

-- ============================================
-- STEP 3: Test funksjonen
-- ============================================
SELECT * FROM get_onboarding_responses();

-- ============================================
-- RESULTAT
-- ============================================
-- Hvis du ser rader over, fungerer funksjonen!
-- Admin-panelet kan nå bruke denne funksjonen for å hente data.

