-- First, ensure the user's profile exists
INSERT INTO profiles (id, is_admin)
SELECT id, true
FROM auth.users
WHERE email = 'sebastian@hovdenmusikklubb.no'  -- Replace with your email
ON CONFLICT (id) DO UPDATE
SET is_admin = true;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated; 