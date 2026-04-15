-- FINAL FIX FOR ONBOARDING_RESPONSES RLS
-- This will completely fix the RLS issue by creating separate policies

-- Step 1: Show current policies (for debugging)
SELECT 
  'CURRENT POLICIES:' as info,
  policyname,
  cmd,
  roles::text
FROM pg_policies 
WHERE tablename = 'onboarding_responses';

-- Step 2: Drop ALL existing policies
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;
DROP POLICY IF EXISTS "onboarding_responses_anon_insert" ON onboarding_responses;
DROP POLICY IF EXISTS "Allow anyone to insert onboarding responses" ON onboarding_responses;
DROP POLICY IF EXISTS "anon_insert_onboarding_responses" ON onboarding_responses;
DROP POLICY IF EXISTS "Only admins can view onboarding responses" ON onboarding_responses;
DROP POLICY IF EXISTS "Admins can view onboarding responses" ON onboarding_responses;
DROP POLICY IF EXISTS "admins_select_onboarding_responses" ON onboarding_responses;

-- Step 3: Drop any remaining policies using a loop
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'onboarding_responses'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON onboarding_responses', r.policyname);
    END LOOP;
END $$;

-- Step 4: Ensure table structure is correct
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

-- Step 5: Disable and re-enable RLS to clear any cached policies
ALTER TABLE onboarding_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Step 6: Create SEPARATE policies for anon and authenticated
-- This is more explicit and sometimes works better than combined policies

-- Policy for anonymous users (most important!)
CREATE POLICY "anon_can_insert_onboarding"
ON onboarding_responses
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy for authenticated users (backup)
CREATE POLICY "authenticated_can_insert_onboarding"
ON onboarding_responses
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Step 7: Create SELECT policy for admins
CREATE POLICY "admins_can_select_onboarding"
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

-- Step 8: Verify the new policies
SELECT 
  'NEW POLICIES:' as info,
  policyname,
  cmd,
  roles::text,
  with_check
FROM pg_policies 
WHERE tablename = 'onboarding_responses'
ORDER BY policyname;

-- Expected result:
-- - "anon_can_insert_onboarding" with cmd = 'INSERT', roles = '{anon}'
-- - "authenticated_can_insert_onboarding" with cmd = 'INSERT', roles = '{authenticated}'
-- - "admins_can_select_onboarding" with cmd = 'SELECT', roles = '{authenticated}'

