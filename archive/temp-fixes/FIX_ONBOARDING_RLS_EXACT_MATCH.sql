-- EXACT MATCH: Use the same policy pattern as contact_messages (which works!)
-- This is a proven working pattern

-- Step 1: Drop any existing broken policies
DROP POLICY IF EXISTS "allow_all_inserts" ON onboarding_responses;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON onboarding_responses;
DROP POLICY IF EXISTS "anon_can_insert_onboarding" ON onboarding_responses;
DROP POLICY IF EXISTS "authenticated_can_insert_onboarding" ON onboarding_responses;

-- Step 2: Create policy EXACTLY like contact_messages (which works!)
CREATE POLICY "Anyone can submit an onboarding response"
ON onboarding_responses
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- This is the EXACT same pattern as contact_messages table
-- If contact_messages works, this will work too!

-- Step 3: Verify
SELECT 
  'onboarding_responses policies:' as info,
  policyname,
  cmd,
  roles::text
FROM pg_policies 
WHERE tablename = 'onboarding_responses';

-- Compare with contact_messages (should be identical pattern):
SELECT 
  'contact_messages policies (for comparison):' as info,
  policyname,
  cmd,
  roles::text
FROM pg_policies 
WHERE tablename = 'contact_messages'
AND cmd = 'INSERT';

