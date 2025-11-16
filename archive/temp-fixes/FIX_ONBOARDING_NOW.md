# Quick Fix: Onboarding Form Not Saving

## Problem
Form submissions work in Supabase SQL Editor but not from localhost.

## Immediate Fix Steps

### Step 1: Restart Dev Server
1. Stop dev server (Ctrl+C in terminal)
2. Start again: `npm run dev`
3. **Hard refresh browser**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Step 2: Verify RLS Policy Allows Anonymous INSERT

Go to **Supabase SQL Editor** and run this:

```sql
-- Drop and recreate INSERT policy to ensure it allows anonymous users
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;

CREATE POLICY "Anyone can submit an onboarding response"
  ON onboarding_responses 
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);
```

### Step 3: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for: "Supabase client initialized"
4. Fill out onboarding form
5. Check for error messages

### Step 4: Test Connection

In browser console (F12 → Console), paste this:

```javascript
// Test Supabase connection
const testData = {
  type: 'personal',
  goals: ['Test'],
  current_usage: 'Test',
  pain_points: 'Test',
  name: 'Test User',
  email: 'test@example.com',
  consent: true
};

const { data, error } = await supabase
  .from('onboarding_responses')
  .insert([testData])
  .select();

console.log('Test result:', { data, error });
```

**If this works:** The connection is fine, check form submission code.
**If this fails:** Check the error message - it will tell you what's wrong.

### Step 5: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Fill out onboarding form
4. Look for requests to `supabase.co`
5. Click on the failed request
6. Check:
   - **Status code** (should be 200 or 201)
   - **Request URL** (should be to your Supabase project)
   - **Error message** in Response tab

## Common Error Messages & Fixes

### "ERR_NAME_NOT_RESOLVED"
**Cause:** Browser can't reach Supabase URL
**Fix:**
- Check internet connection
- Try accessing `https://dwjiluewfvfwiryxqxpx.supabase.co` directly in browser
- Check if Supabase project is active (not paused)

### "new row violates row-level security policy"
**Cause:** RLS policy blocking INSERT
**Fix:** Run Step 2 above to fix the policy

### "Missing Supabase environment variables"
**Cause:** .env file not loaded
**Fix:**
- Make sure `.env` is in project root
- Restart dev server
- Hard refresh browser

### "403 Forbidden"
**Cause:** RLS policy issue
**Fix:** Run Step 2 above

## Still Not Working?

1. **Check .env file:**
   ```bash
   cat .env
   ```
   Should show your Supabase URL and key

2. **Verify Supabase project is active:**
   - Go to Supabase Dashboard
   - Check project status (should be "Active")

3. **Try incognito/private browser:**
   - Sometimes extensions block requests

4. **Check Supabase Dashboard → Settings → API:**
   - Verify Project URL matches `.env` file
   - Verify `anon` key matches `.env` file

