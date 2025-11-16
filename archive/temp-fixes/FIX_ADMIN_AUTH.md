# Fix Admin Authentication for Supabase

## Problem
Admin login uses **local storage authentication** (not Supabase auth), but RLS policies require **Supabase authentication**. This means you're anonymous to Supabase, so you can't insert/update data.

## Root Cause
- Admin login: Uses `localAuthStore` (local storage)
- Supabase RLS: Requires `auth.uid()` (Supabase authentication)
- Result: You're anonymous → RLS blocks operations → Falls back to localStorage

## Solution Options

### Option 1: Switch Admin to Supabase Auth (Recommended)

This requires updating the admin login to use Supabase authentication instead of local storage.

**Pros:** Secure, proper authentication
**Cons:** Requires code changes

### Option 2: Allow Anonymous Admin Operations (Quick Fix - Less Secure)

Create RLS policies that allow anonymous users to manage content. This is less secure but works immediately.

**⚠️ WARNING:** This allows anyone to modify content. Only use for testing or if you have other security measures.

**SQL to run in Supabase:**

```sql
-- Allow anonymous users to manage blog_posts (TEMPORARY)
DROP POLICY IF EXISTS "Allow anonymous admin operations" ON blog_posts;
CREATE POLICY "Allow anonymous admin operations"
ON blog_posts FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Do the same for other tables
DROP POLICY IF EXISTS "Allow anonymous admin operations" ON courses;
CREATE POLICY "Allow anonymous admin operations"
ON courses FOR ALL
TO anon
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous admin operations" ON portfolio_projects;
CREATE POLICY "Allow anonymous admin operations"
ON portfolio_projects FOR ALL
TO anon
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous admin operations" ON tools_resources;
CREATE POLICY "Allow anonymous admin operations"
ON tools_resources FOR ALL
TO anon
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous admin operations" ON events;
CREATE POLICY "Allow anonymous admin operations"
ON events FOR ALL
TO anon
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous admin operations" ON social_media_posts;
CREATE POLICY "Allow anonymous admin operations"
ON social_media_posts FOR ALL
TO anon
USING (true)
WITH CHECK (true);
```

### Option 3: Use Service Role Key (Most Secure - Complex)

Use Supabase service role key for admin operations. This bypasses RLS but requires careful implementation.

## Recommended: Quick Fix First

For now, use **Option 2** to get it working, then we can implement proper Supabase auth later.

1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL from Option 2 above
3. Test creating content - it should now save to Supabase!

## Check Current Status

In browser console on your Netlify site, run:

```javascript
// Check if you're authenticated with Supabase
const { data: { user } } = await supabase.auth.getUser();
console.log('Supabase authenticated:', !!user);
console.log('User:', user);

// Check local auth
const localAuth = JSON.parse(localStorage.getItem('admin_auth') || '{}');
console.log('Local auth:', localAuth);
```

This will show you which auth system is active.

