# Troubleshooting Onboarding Form Not Saving to Supabase

## Problem
Onboarding form submissions are not being saved to Supabase, even though:
- The table exists
- RLS policies are set up correctly
- Direct SQL INSERT works in Supabase SQL Editor

## Common Causes & Solutions

### 1. Dev Server Not Restarted After .env Changes

**Solution:**
1. Stop the dev server (Ctrl+C)
2. Restart it: `npm run dev`
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### 2. Environment Variables Not Loaded

**Check:**
1. Open browser console (F12)
2. Look for: "Supabase client initialized"
3. Check if URL and key are present

**Fix:**
- Make sure `.env` file is in project root (same folder as `package.json`)
- Make sure variables start with `VITE_`
- Restart dev server after changing `.env`

### 3. CORS Issues

**Check:**
- In browser console, look for CORS errors
- Check Network tab for failed requests

**Fix:**
- Supabase should handle CORS automatically
- If issues persist, check Supabase Dashboard → Settings → API → CORS settings

### 4. Network/DNS Issues

**Check:**
- Error: `ERR_NAME_NOT_RESOLVED` means browser can't reach Supabase
- Try accessing Supabase URL directly in browser: `https://dwjiluewfvfwiryxqxpx.supabase.co`

**Fix:**
- Check internet connection
- Try different network
- Check if Supabase project is active (not paused)

### 5. RLS Policy Issues

**Verify:**
Run this in Supabase SQL Editor:

```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'onboarding_responses';

-- Test INSERT as anonymous user
INSERT INTO onboarding_responses (
  type, goals, current_usage, pain_points, name, email, consent
)
VALUES (
  'personal', ARRAY['Test'], 'Test', 'Test', 'Test', 'test@test.com', true
);
```

**Fix if needed:**
```sql
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;

CREATE POLICY "Anyone can submit an onboarding response"
  ON onboarding_responses 
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);
```

### 6. Check Browser Console for Errors

**Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Fill out onboarding form
4. Look for:
   - Red error messages
   - "Supabase insert failed" warnings
   - Network errors

**What to look for:**
- `ERR_NAME_NOT_RESOLVED` → Network/DNS issue
- `403 Forbidden` → RLS policy issue
- `401 Unauthorized` → Auth issue (shouldn't happen for anonymous INSERT)
- `Missing Supabase environment variables` → .env not loaded

## Debug Steps

### Step 1: Verify Environment Variables
```bash
# In terminal, check .env file
cat .env | grep VITE_SUPABASE
```

Should show:
```
VITE_SUPABASE_URL=https://dwjiluewfvfwiryxqxpx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Step 2: Check Browser Console
1. Open DevTools (F12)
2. Go to Console
3. Look for "Supabase client initialized" message
4. Check for any error messages

### Step 3: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Fill out onboarding form
4. Look for requests to `supabase.co`
5. Check if they succeed (200) or fail (red)

### Step 4: Test Direct Connection
In browser console, run:
```javascript
// Check if Supabase client is initialized
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
```

### Step 5: Test Supabase Connection
In browser console, run:
```javascript
// Test connection
const { data, error } = await supabase
  .from('onboarding_responses')
  .select('count')
  .limit(1);

console.log('Connection test:', { data, error });
```

## Quick Fix Checklist

- [ ] Restart dev server (`npm run dev`)
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Check `.env` file exists and has correct values
- [ ] Check browser console for errors
- [ ] Verify RLS policy allows anonymous INSERT
- [ ] Test Supabase URL is reachable in browser
- [ ] Check Network tab for failed requests

## Still Not Working?

1. **Check Supabase Dashboard:**
   - Go to Settings → API
   - Verify Project URL matches `.env` file
   - Verify `anon` key matches `.env` file

2. **Check Supabase Project Status:**
   - Make sure project is not paused
   - Check if project is on free tier (should still work)

3. **Try Different Browser:**
   - Sometimes browser extensions block requests
   - Try incognito/private mode

4. **Check Firewall/Network:**
   - Some networks block Supabase domains
   - Try different network (mobile hotspot)

