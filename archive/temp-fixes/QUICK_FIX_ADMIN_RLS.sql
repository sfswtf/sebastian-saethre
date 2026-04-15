-- QUICK FIX: Allow Anonymous Admin Operations
-- ⚠️ WARNING: This allows anyone to modify content. Use only for testing or if you have other security measures.
-- For production, you should switch to Supabase authentication instead.

-- Blog Posts: Allow anonymous users to manage
DROP POLICY IF EXISTS "Allow anonymous admin operations" ON blog_posts;
CREATE POLICY "Allow anonymous admin operations"
ON blog_posts FOR ALL
TO anon
USING (true)
WITH CHECK (true);

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

-- Verify policies were created
SELECT tablename, policyname, cmd, roles
FROM pg_policies 
WHERE policyname = 'Allow anonymous admin operations'
ORDER BY tablename;

