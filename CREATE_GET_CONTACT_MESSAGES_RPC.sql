ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'unread';

DROP FUNCTION IF EXISTS get_contact_messages() CASCADE;

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
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cm.id,
    cm.created_at,
    cm.name,
    cm.email,
    cm.message,
    COALESCE(cm.status, 'unread')::TEXT as status,
    cm.admin_notes
  FROM contact_messages cm
  ORDER BY cm.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION get_contact_messages() TO anon;
GRANT EXECUTE ON FUNCTION get_contact_messages() TO authenticated;
