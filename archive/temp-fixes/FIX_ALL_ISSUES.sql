-- FIX ALL ISSUES: Complete RLS Policy Fix
-- This will fix contact messages, onboarding, and all other tables

-- ============================================
-- CONTACT MESSAGES: Fix INSERT policy
-- ============================================
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow anonymous to submit contact messages" ON contact_messages;
CREATE POLICY "Allow anonymous to submit contact messages"
ON contact_messages FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- ============================================
-- ONBOARDING RESPONSES: Ensure INSERT works
-- ============================================
DROP POLICY IF EXISTS "onboarding_responses_anon_insert" ON onboarding_responses;
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;
CREATE POLICY "onboarding_responses_anon_insert"
ON onboarding_responses FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- ============================================
-- COURSES: Allow anonymous operations
-- ============================================
DROP POLICY IF EXISTS "Allow anonymous admin operations" ON courses;
CREATE POLICY "Allow anonymous admin operations"
ON courses FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- ============================================
-- PORTFOLIO PROJECTS: Allow anonymous operations
-- ============================================
DROP POLICY IF EXISTS "Allow anonymous admin operations" ON portfolio_projects;
CREATE POLICY "Allow anonymous admin operations"
ON portfolio_projects FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- ============================================
-- TOOLS RESOURCES: Allow anonymous operations
-- ============================================
DROP POLICY IF EXISTS "Allow anonymous admin operations" ON tools_resources;
CREATE POLICY "Allow anonymous admin operations"
ON tools_resources FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- ============================================
-- EVENTS: Allow anonymous operations
-- ============================================
DROP POLICY IF EXISTS "Allow anonymous admin operations" ON events;
CREATE POLICY "Allow anonymous admin operations"
ON events FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- ============================================
-- SOCIAL MEDIA POSTS: Allow anonymous operations
-- ============================================
DROP POLICY IF EXISTS "Allow anonymous admin operations" ON social_media_posts;
CREATE POLICY "Allow anonymous admin operations"
ON social_media_posts FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- ============================================
-- VERIFY ALL POLICIES
-- ============================================
SELECT 
  tablename, 
  policyname, 
  cmd, 
  roles
FROM pg_policies 
WHERE tablename IN (
  'contact_messages',
  'onboarding_responses',
  'courses',
  'portfolio_projects',
  'tools_resources',
  'events',
  'social_media_posts',
  'blog_posts'
)
ORDER BY tablename, cmd;

