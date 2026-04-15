-- FIX ALL TABLES: Allow Anonymous Operations
-- This will make all tables work like blog_posts

-- Courses: Allow anonymous users to manage
DROP POLICY IF EXISTS "Allow anonymous admin operations" ON courses;
CREATE POLICY "Allow anonymous admin operations"
ON courses FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Portfolio Projects: Allow anonymous users to manage
DROP POLICY IF EXISTS "Allow anonymous admin operations" ON portfolio_projects;
CREATE POLICY "Allow anonymous admin operations"
ON portfolio_projects FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Tools Resources: Allow anonymous users to manage
DROP POLICY IF EXISTS "Allow anonymous admin operations" ON tools_resources;
CREATE POLICY "Allow anonymous admin operations"
ON tools_resources FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Events: Allow anonymous users to manage
DROP POLICY IF EXISTS "Allow anonymous admin operations" ON events;
CREATE POLICY "Allow anonymous admin operations"
ON events FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Social Media Posts: Allow anonymous users to manage
DROP POLICY IF EXISTS "Allow anonymous admin operations" ON social_media_posts;
CREATE POLICY "Allow anonymous admin operations"
ON social_media_posts FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Contact Messages: Allow anonymous users to insert (for contact form)
DROP POLICY IF EXISTS "Allow anonymous to submit contact messages" ON contact_messages;
CREATE POLICY "Allow anonymous to submit contact messages"
ON contact_messages FOR INSERT
TO anon
WITH CHECK (true);

-- Contact Messages: Allow authenticated admins to view/manage
DROP POLICY IF EXISTS "Admins can view contact messages" ON contact_messages;
CREATE POLICY "Admins can view contact messages"
ON contact_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Onboarding Responses: Already fixed, but ensure it's correct
DROP POLICY IF EXISTS "onboarding_responses_anon_insert" ON onboarding_responses;
CREATE POLICY "onboarding_responses_anon_insert"
ON onboarding_responses FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Verify all policies were created
SELECT tablename, policyname, cmd, roles
FROM pg_policies 
WHERE policyname LIKE '%anonymous%' OR policyname LIKE '%anon%'
ORDER BY tablename, cmd;

