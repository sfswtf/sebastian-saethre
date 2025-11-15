-- Ensure Sebastian Saethre can login as admin
-- This migration ensures the user with email sebastian.saethre@gmail.com has admin access

-- First, ensure the user's profile exists and is set as admin
-- This will work if the user already exists in auth.users
INSERT INTO profiles (id, email, is_admin)
SELECT id, email, true
FROM auth.users
WHERE email = 'sebastian.saethre@gmail.com'
ON CONFLICT (id) DO UPDATE
SET is_admin = true, email = EXCLUDED.email;

-- Also add to allowed_admins table for redundancy
INSERT INTO allowed_admins (email)
VALUES ('sebastian.saethre@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- If the user doesn't exist yet, we'll need to create them manually via Supabase Auth
-- But this ensures that once they sign up, they'll automatically get admin status

