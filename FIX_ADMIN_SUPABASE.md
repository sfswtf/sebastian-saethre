# Fix Admin Not Saving to Supabase

## Problem
Admin can create content but it's only saved to localStorage, not Supabase.

## Root Cause
RLS policies require admin to be **authenticated** (logged in) to insert/update data. If you're not logged in, you're anonymous and can't write to Supabase.

## Solution 1: Ensure Admin is Logged In

### Check if you're logged in:
1. Go to your Netlify site: `/admin`
2. Check if you see a login form or if you're already logged in
3. If you see login form, log in with your admin credentials

### If you don't have admin account:
1. Go to `/login` on your Netlify site
2. Create an account or log in
3. Then set yourself as admin in Supabase (see Solution 2)

## Solution 2: Set Yourself as Admin in Supabase

### Step 1: Get your user ID
1. Log in to your site at `/login`
2. Open browser console (F12)
3. Run this:
```javascript
const { data: { user } } = await supabase.auth.getUser();
console.log('User ID:', user?.id);
console.log('User Email:', user?.email);
```

### Step 2: Set yourself as admin in Supabase
1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL (replace EMAIL with your email):

```sql
-- Set yourself as admin
UPDATE profiles
SET is_admin = true
WHERE email = 'sebastian.saethre@gmail.com';

-- Verify
SELECT id, email, is_admin FROM profiles WHERE email = 'sebastian.saethre@gmail.com';
```

### Step 3: Add your email to allowed_admins
```sql
-- Add your email to allowed admins
INSERT INTO allowed_admins (email)
VALUES ('sebastian.saethre@gmail.com')
ON CONFLICT (email) DO NOTHING;
```

## Solution 3: Alternative - Allow Anonymous Admin (Less Secure)

If you want to allow admin operations without authentication (NOT recommended for production):

```sql
-- Allow anonymous users to manage content (TEMPORARY - for testing only)
CREATE POLICY "Allow anonymous admin operations"
ON blog_posts FOR ALL
TO anon
USING (true)
WITH CHECK (true);
```

**⚠️ WARNING:** This is NOT secure! Only use for testing. Remove this policy before going to production.

## Solution 4: Check Environment Variables

Make sure environment variables are set in Netlify:
1. Netlify Dashboard → Site settings → Environment variables
2. Verify:
   - `VITE_SUPABASE_URL` = `https://dwjiluewfvfwirxyqxpx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (your anon key)
3. If missing, add them and redeploy

## Debug Steps

### Step 1: Check Browser Console
1. Open your Netlify site
2. Open DevTools (F12) → Console
3. Try creating content
4. Look for error messages - they will tell you what's wrong

### Step 2: Check if you're authenticated
In browser console, run:
```javascript
const { data: { user } } = await supabase.auth.getUser();
console.log('Authenticated:', !!user);
console.log('User:', user);
```

### Step 3: Test Supabase connection
In browser console, run:
```javascript
// Test connection
const { data, error } = await supabase
  .from('blog_posts')
  .select('count')
  .limit(1);

console.log('Connection test:', { data, error });
```

## Most Likely Issue

**You're not logged in as admin.** The RLS policies require authentication. 

**Quick fix:**
1. Go to `/login` on your Netlify site
2. Log in (or create account)
3. Set yourself as admin in Supabase (Solution 2)
4. Try creating content again

