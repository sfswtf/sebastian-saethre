-- Check if table exists and show its structure
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_name = 'membership_applications'
) as table_exists; 