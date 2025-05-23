-- Drop existing policies
DROP POLICY IF EXISTS "Users can create membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Admins can view membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Admins can update membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Anyone can submit an application" ON membership_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON membership_applications;
DROP POLICY IF EXISTS "Admins can manage applications" ON membership_applications;

-- Create new policies
CREATE POLICY "Anyone can submit membership applications"
ON membership_applications
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admins can view membership applications"
ON membership_applications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can update membership applications"
ON membership_applications
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can delete membership applications"
ON membership_applications
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
); 