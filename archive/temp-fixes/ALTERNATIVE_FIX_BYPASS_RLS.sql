-- ALTERNATIVE FIX: Use a function to bypass RLS
-- This creates a database function that can insert without RLS checks
-- This is a workaround if policies keep failing

-- Step 1: Create a function that inserts with elevated privileges
CREATE OR REPLACE FUNCTION insert_onboarding_response(
  p_type TEXT,
  p_goals TEXT[],
  p_current_usage TEXT,
  p_pain_points TEXT,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_consent BOOLEAN DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER  -- This allows the function to bypass RLS
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO onboarding_responses (
    type, goals, current_usage, pain_points, 
    name, email, phone, consent
  )
  VALUES (
    p_type, p_goals, p_current_usage, p_pain_points,
    p_name, p_email, p_phone, p_consent
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Step 2: Grant execute permission to anon and authenticated
GRANT EXECUTE ON FUNCTION insert_onboarding_response TO anon;
GRANT EXECUTE ON FUNCTION insert_onboarding_response TO authenticated;

-- Step 3: Verify function was created
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'insert_onboarding_response';

-- Now you would need to update the frontend code to call this function
-- instead of direct INSERT. But let's try the policy fix first.

