# Fix Onboarding Responses RLS Policy

## Problem
Onboarding responses are not being saved to Supabase. This is likely due to RLS (Row Level Security) policy issues.

## Solution: Update RLS Policy

Go to **SQL Editor** in Supabase and run this SQL:

```sql
-- First, check if the policy exists
SELECT * FROM pg_policies WHERE tablename = 'onboarding_responses';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;
DROP POLICY IF EXISTS "Only admins can view onboarding responses" ON onboarding_responses;

-- Recreate INSERT policy - MUST allow anonymous users
CREATE POLICY "Anyone can submit an onboarding response"
  ON onboarding_responses 
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Recreate SELECT policy - Only admins can view
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
```

## Verify RLS is Enabled

Run this to check:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'onboarding_responses';
```

Should return `rowsecurity = true`.

## Test the Policy

Run this test insert (should work without authentication):

```sql
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
  ARRAY['Learning', 'Productivity'],
  'Not using AI yet',
  'Need help getting started',
  'Test User',
  'test@example.com',
  true
);
```

If this works, the policy is correct. If it fails, check the error message.

## Common Issues

1. **Policy not allowing anonymous users**: Make sure `TO authenticated, anon` is in the INSERT policy
2. **RLS not enabled**: Run `ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;`
3. **Wrong schema**: Make sure you're using `public.onboarding_responses`

