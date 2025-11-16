# Onboarding RLS Troubleshooting Guide

## The Problem
`onboarding_responses` table is rejecting inserts with:
- Error code: `42501` (insufficient privilege)
- Message: "new row violates row-level security policy"
- HTTP status: `401 (Unauthorized)`

## Why This Happens
Row Level Security (RLS) policies in Supabase can be tricky. Common issues:
1. **Conflicting policies** - Multiple policies can conflict
2. **Policy order** - Sometimes order matters
3. **Role specification** - `TO anon, authenticated` vs separate policies
4. **Cached policies** - Old policies might be cached

## Solution: Run This SQL

Go to **Supabase Dashboard → SQL Editor** and run `FIX_ONBOARDING_RLS_FINAL.sql`

This script:
1. ✅ Lists all current policies (so you can see what exists)
2. ✅ Drops ALL existing policies (removes conflicts)
3. ✅ Disables and re-enables RLS (clears cache)
4. ✅ Creates **separate** policies for `anon` and `authenticated` (more reliable)
5. ✅ Verifies the new policies were created

## Alternative: Temporarily Disable RLS (For Testing Only)

If the above doesn't work, you can temporarily disable RLS to test:

```sql
-- TEMPORARY: Disable RLS (ONLY FOR TESTING!)
ALTER TABLE onboarding_responses DISABLE ROW LEVEL SECURITY;
```

**⚠️ WARNING:** This removes all security! Only use for testing, then re-enable:

```sql
-- Re-enable RLS after testing
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;
-- Then create the policies from FIX_ONBOARDING_RLS_FINAL.sql
```

## Verify It's Working

After running the SQL:

1. **Check policies exist:**
   ```sql
   SELECT policyname, cmd, roles 
   FROM pg_policies 
   WHERE tablename = 'onboarding_responses';
   ```
   Should show 3 policies (2 INSERT, 1 SELECT)

2. **Test insert from Supabase dashboard:**
   - Go to Table Editor → `onboarding_responses`
   - Click "Insert" button
   - Fill in required fields
   - Should work without errors

3. **Test from website:**
   - Go to `/onboarding`
   - Fill out form
   - Submit
   - Check browser console (F12) - should NOT see 401/42501 errors
   - Check Supabase table - new row should appear

## If Still Not Working

1. **Check Supabase project settings:**
   - Go to Settings → API
   - Verify `anon` key matches your `.env` file
   - Check if RLS is enabled at project level

2. **Check environment variables:**
   - In Netlify: Site settings → Environment variables
   - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
   - Redeploy after adding/changing variables

3. **Check browser console:**
   - Look for "Supabase client initialized" message
   - Should show correct URL and key length (208)
   - If missing, env vars aren't loaded

4. **Try service role key (last resort):**
   - Service role key bypasses RLS
   - **⚠️ NEVER expose service role key in frontend code!**
   - Only use in server-side code or Netlify functions

## Expected Console Output (When Working)

```
Supabase client initialized: {url: 'https://...', keyLength: 208}
Onboarding form submitted successfully to Supabase: [{...}]
```

## Expected Console Output (When Broken)

```
POST .../onboarding_responses 401 (Unauthorized)
Supabase insert failed: {code: '42501', message: 'new row violates row-level security policy...'}
```

