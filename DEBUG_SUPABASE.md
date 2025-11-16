# Debug Supabase Connection

## Problem
Admin can create content but it's not saving to Supabase - only localStorage.

## Quick Test: Check Browser Console

1. Open your Netlify site
2. Open DevTools (F12) → Console
3. Look for:
   - "Supabase client initialized" message
   - Any red error messages
   - "Supabase save failed" warnings

## Common Issues

### 1. Environment Variables Not Set in Netlify
**Check:**
- Go to Netlify Dashboard → Site settings → Environment variables
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- If missing, add them and redeploy

### 2. RLS Policies Blocking Admin Operations
**Problem:** Admin needs to be authenticated to insert/update data, but RLS policies might be blocking.

**Check in Supabase:**
1. Go to Supabase Dashboard → SQL Editor
2. Run this to check policies:

```sql
-- Check INSERT policies for blog_posts
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'blog_posts'
AND cmd = 'INSERT';
```

**Fix:** Admin needs authenticated access. Run this SQL:

```sql
-- Allow authenticated users to insert/update blog_posts
CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

### 3. Admin Not Authenticated
**Problem:** Admin login might not be working, so user is anonymous.

**Check:**
- Try logging in to `/admin` page
- Check if you see "Logged in as admin" message
- Check browser console for auth errors

### 4. CORS Issues
**Check:**
- Open DevTools → Network tab
- Try creating content
- Look for failed requests to `supabase.co`
- Check if CORS errors appear

## Test Supabase Connection

Add this to browser console on your Netlify site:

```javascript
// Test Supabase connection
const testData = {
  title: 'Test Post',
  slug: 'test-post',
  content: 'Test content',
  category: 'test',
  tags: ['test'],
  status: 'draft'
};

const { data, error } = await supabase
  .from('blog_posts')
  .insert([testData])
  .select();

console.log('Test result:', { data, error });
```

If this fails, check the error message - it will tell you what's wrong.

