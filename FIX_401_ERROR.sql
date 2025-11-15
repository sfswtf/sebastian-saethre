-- Fix 401 Unauthorized Error for onboarding_responses
-- This error means RLS policies are blocking the INSERT

-- Step 1: Drop existing policies
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;
DROP POLICY IF EXISTS "Only admins can view onboarding responses" ON onboarding_responses;

-- Step 2: Recreate INSERT policy - MUST allow anonymous users
CREATE POLICY "Anyone can submit an onboarding response"
  ON onboarding_responses 
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Step 3: Recreate SELECT policy - Only admins can view
CREATE POLICY "Only admins can view onboarding responses"
  ON onboarding_responses 
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Step 4: Verify RLS is enabled
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Step 5: Test the policy (should work without authentication)
-- Run this to test:
INSERT INTO onboarding_responses (
  type, 
  goals, 
  current_usage, 
  pain_points, 
  name, 
  email, 
  consent
)
VALUES (
  'personal',
  ARRAY['Test'],
  'Testing RLS policy',
  'Test pain',
  'Test User',
  'test@example.com',
  true
);

-- If the INSERT above works, the policy is correct!

