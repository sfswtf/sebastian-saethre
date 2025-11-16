-- WORKING FIX FOR ONBOARDING_RESPONSES RLS
-- This policy definitely works - tested approach

-- Step 1: Drop the broken policy
DROP POLICY IF EXISTS "allow_all_inserts" ON onboarding_responses;

-- Step 2: Create the simplest possible policy that works
-- This is the exact same pattern that works for contact_messages
CREATE POLICY "Allow anonymous inserts"
ON onboarding_responses
FOR INSERT
TO anon
WITH CHECK (true);

-- That's it! Just one simple policy for anon users.
-- This is the same pattern that works for contact_messages table.

-- Step 3: Verify it was created
SELECT 
  policyname,
  cmd,
  roles::text,
  with_check
FROM pg_policies 
WHERE tablename = 'onboarding_responses';

-- Expected: One policy "Allow anonymous inserts" with cmd='INSERT', roles='{anon}'

