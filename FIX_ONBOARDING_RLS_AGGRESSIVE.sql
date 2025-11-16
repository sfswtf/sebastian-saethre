-- AGGRESSIVE FIX FOR ONBOARDING_RESPONSES RLS
-- This will completely remove all policies and recreate them correctly

-- Step 1: List all current policies (for debugging)
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
WHERE tablename = 'onboarding_responses';

-- Step 2: Drop ALL existing policies (using CASCADE to be sure)
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "onboarding_responses_anon_insert" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "Allow anyone to insert onboarding responses" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "Only admins can view onboarding responses" ON onboarding_responses CASCADE;
DROP POLICY IF EXISTS "Admins can view onboarding responses" ON onboarding_responses CASCADE;

-- Step 3: Drop any remaining policies (catch-all)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'onboarding_responses') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON onboarding_responses CASCADE';
    END LOOP;
END $$;

-- Step 4: Ensure table exists
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

-- Step 5: Disable RLS temporarily, then re-enable (to clear any cached policies)
ALTER TABLE onboarding_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Step 6: Create a VERY permissive INSERT policy
-- Using both USING and WITH CHECK for maximum compatibility
CREATE POLICY "anon_insert_onboarding_responses"
ON onboarding_responses
FOR INSERT
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Step 7: Create SELECT policy for admins
CREATE POLICY "admins_select_onboarding_responses"
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

-- Step 8: Verify policies were created
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

-- Step 9: Test the policy (this should return the policy we just created)
-- You should see:
-- - "anon_insert_onboarding_responses" with cmd = 'INSERT', roles = '{anon,authenticated}'
-- - "admins_select_onboarding_responses" with cmd = 'SELECT', roles = '{authenticated}'

