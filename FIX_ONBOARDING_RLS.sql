-- FIX ONBOARDING_RESPONSES RLS POLICY
-- This will completely fix the RLS issue preventing inserts

-- Step 1: Drop ALL existing policies on onboarding_responses
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;
DROP POLICY IF EXISTS "onboarding_responses_anon_insert" ON onboarding_responses;
DROP POLICY IF EXISTS "Only admins can view onboarding responses" ON onboarding_responses;
DROP POLICY IF EXISTS "Admins can view onboarding responses" ON onboarding_responses;

-- Step 2: Ensure the table exists with correct structure
CREATE TABLE IF NOT EXISTS onboarding_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('personal', 'professional')),
  goals TEXT[],
  current_usage TEXT,
  pain_points TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  consent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Step 3: Ensure RLS is enabled
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Step 4: Create a simple, explicit INSERT policy for anonymous users
-- This policy allows ANYONE (authenticated or anonymous) to INSERT
CREATE POLICY "Allow anyone to insert onboarding responses"
ON onboarding_responses
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Step 5: Create a SELECT policy for admins (optional, but good for security)
CREATE POLICY "Admins can view onboarding responses"
ON onboarding_responses
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Step 6: Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'onboarding_responses'
ORDER BY policyname;

-- Step 7: Test query (this should return the policies we just created)
-- You should see:
-- 1. "Allow anyone to insert onboarding responses" with cmd = 'INSERT' and roles = '{authenticated,anon}'
-- 2. "Admins can view onboarding responses" with cmd = 'SELECT' and roles = '{authenticated}'

