-- Add location field to membership_applications
ALTER TABLE membership_applications
ADD COLUMN location TEXT NOT NULL DEFAULT '';

-- Add member_type field
ALTER TABLE membership_applications
ADD COLUMN member_type TEXT CHECK (member_type IN ('local', 'casual')) DEFAULT 'casual';

-- Update RLS policies to include new fields
DROP POLICY IF EXISTS "Users can create membership applications" ON membership_applications;
CREATE POLICY "Users can create membership applications"
ON membership_applications
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view membership applications" ON membership_applications;
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

DROP POLICY IF EXISTS "Admins can update membership applications" ON membership_applications;
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
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
); 