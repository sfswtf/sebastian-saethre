-- OPPRETT RPC FUNCTION FOR Å HENTE CONTACT MESSAGES
-- Dette omgår RLS og lar admin hente data uavhengig av autentisering
-- Kjør dette i Supabase SQL Editor

-- ============================================
-- STEP 1: Opprett RPC function for å hente alle contact messages
-- ============================================
CREATE OR REPLACE FUNCTION get_contact_messages()
RETURNS TABLE (
  id uuid,
  created_at TIMESTAMPTZ,
  name TEXT,
  email TEXT,
  message TEXT,
  status TEXT,
  admin_notes TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER -- Dette gir funksjonen admin-rettigheter
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    contact_messages.id,
    contact_messages.created_at,
    contact_messages.name,
    contact_messages.email,
    contact_messages.message,
    contact_messages.status,
    contact_messages.admin_notes
  FROM contact_messages
  ORDER BY contact_messages.created_at DESC;
END;
$$;

-- ============================================
-- STEP 2: Gi anonymous og authenticated users tilgang til funksjonen
-- ============================================
GRANT EXECUTE ON FUNCTION get_contact_messages() TO anon;
GRANT EXECUTE ON FUNCTION get_contact_messages() TO authenticated;

-- ============================================
-- STEP 3: Test funksjonen
-- ============================================
SELECT * FROM get_contact_messages();

-- ============================================
-- RESULTAT
-- ============================================
-- Hvis du ser rader over, fungerer funksjonen!
-- Admin-panelet kan nå bruke denne funksjonen for å hente data.

