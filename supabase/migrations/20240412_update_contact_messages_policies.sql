-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can view contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON contact_messages;

-- Create new policies
CREATE POLICY "Anyone can submit contact messages"
ON contact_messages
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
ON contact_messages
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update contact messages"
ON contact_messages
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true); 