-- EKSPORTER ONBOARDING DATA TIL CSV FORMAT
-- Kjør dette i Supabase SQL Editor for å få dataene i et forståelig format

-- ============================================
-- EKSPORT TIL CSV FORMAT
-- ============================================
SELECT 
  created_at as "Dato",
  name as "Navn",
  email as "E-post",
  phone as "Telefon",
  type as "Type",
  CASE 
    WHEN type = 'personal' THEN 'Personlig'
    WHEN type = 'professional' THEN 'Profesjonell'
    ELSE type
  END as "Type (Norsk)",
  company_name as "Firmanavn",
  industry as "Bransje",
  array_to_string(goals, ', ') as "Mål",
  current_usage as "Nåværende bruk",
  array_to_string(current_usage_options, ', ') as "Bruksalternativer",
  pain_points as "Utfordringer",
  array_to_string(pain_points_options, ', ') as "Utfordringsalternativer",
  CASE 
    WHEN consent THEN 'Ja'
    ELSE 'Nei'
  END as "Samtykke"
FROM onboarding_responses
ORDER BY created_at DESC;

-- ============================================
-- ALTERNATIV: EKSPORT TIL JSON FORMAT
-- ============================================
-- Hvis du foretrekker JSON, bruk denne:
/*
SELECT 
  json_agg(
    json_build_object(
      'id', id,
      'dato', created_at,
      'navn', name,
      'email', email,
      'telefon', phone,
      'type', type,
      'firmanavn', company_name,
      'bransje', industry,
      'mål', goals,
      'nåværende_bruk', current_usage,
      'bruksalternativer', current_usage_options,
      'utfordringer', pain_points,
      'utfordringsalternativer', pain_points_options,
      'samtykke', consent
    )
  ) as data
FROM onboarding_responses
ORDER BY created_at DESC;
*/

-- ============================================
-- EKSPORT TIL E-MAIL FORMAT (for copy-paste)
-- ============================================
SELECT 
  '--- NY INNSENDING ---' || E'\n' ||
  'Dato: ' || to_char(created_at, 'DD.MM.YYYY HH24:MI') || E'\n' ||
  'Navn: ' || COALESCE(name, 'Ikke oppgitt') || E'\n' ||
  'E-post: ' || COALESCE(email, 'Ikke oppgitt') || E'\n' ||
  'Telefon: ' || COALESCE(phone, 'Ikke oppgitt') || E'\n' ||
  'Type: ' || CASE 
    WHEN type = 'personal' THEN 'Personlig'
    WHEN type = 'professional' THEN 'Profesjonell'
    ELSE type
  END || E'\n' ||
  CASE 
    WHEN company_name IS NOT NULL THEN 'Firmanavn: ' || company_name || E'\n'
    ELSE ''
  END ||
  CASE 
    WHEN industry IS NOT NULL THEN 'Bransje: ' || industry || E'\n'
    ELSE ''
  END ||
  'Mål: ' || array_to_string(goals, ', ') || E'\n' ||
  'Nåværende bruk: ' || COALESCE(current_usage, 'Ikke oppgitt') || E'\n' ||
  CASE 
    WHEN array_length(current_usage_options, 1) > 0 
    THEN 'Bruksalternativer: ' || array_to_string(current_usage_options, ', ') || E'\n'
    ELSE ''
  END ||
  'Utfordringer: ' || COALESCE(pain_points, 'Ikke oppgitt') || E'\n' ||
  CASE 
    WHEN array_length(pain_points_options, 1) > 0 
    THEN 'Utfordringsalternativer: ' || array_to_string(pain_points_options, ', ') || E'\n'
    ELSE ''
  END ||
  'Samtykke: ' || CASE WHEN consent THEN 'Ja' ELSE 'Nei' END || E'\n' ||
  E'\n'
  as email_format
FROM onboarding_responses
ORDER BY created_at DESC;

