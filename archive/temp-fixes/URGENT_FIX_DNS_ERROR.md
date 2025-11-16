# URGENT FIX: DNS Error - Supabase Not Reachable

## Problem
`ERR_NAME_NOT_RESOLVED` - Browser cannot reach Supabase URL.

## Root Cause
The Supabase project URL `dwjiluewfvfwiryxqxpx.supabase.co` cannot be resolved by DNS.

## Possible Causes

1. **Supabase Project is Paused** (Most Likely)
2. **Wrong URL in .env file**
3. **DNS/Network issue**
4. **Supabase project deleted or moved**

## IMMEDIATE FIX STEPS

### Step 1: Check Supabase Project Status

1. Go to: https://supabase.com/dashboard
2. Check if project **sebastiansaethre** exists
3. Check if project status is **"Active"** (not "Paused")
4. If paused: Click "Resume" or "Restore"

### Step 2: Verify Correct URL

1. In Supabase Dashboard → **Settings** → **API**
2. Copy the **Project URL** (should be like `https://xxxxx.supabase.co`)
3. Compare with `.env` file

### Step 3: Update .env if URL Changed

If the URL in Supabase Dashboard is different from `.env`:

1. Update `.env` file with correct URL
2. Restart dev server: `npm run dev`
3. Hard refresh browser: Ctrl+Shift+R

### Step 4: Test Connection

In terminal, test if URL is reachable:

```bash
curl -I https://YOUR_SUPABASE_URL.supabase.co
```

If this fails, the project might be paused or the URL is wrong.

## Alternative: Use Different Supabase Project

If current project is not accessible:

1. Create new Supabase project
2. Copy new Project URL and anon key
3. Update `.env` file
4. Run all migrations in new project

## Temporary Workaround

Until Supabase is fixed, the app will use localStorage fallback automatically. Data will be saved locally but not in Supabase.

## Check Supabase Dashboard

Go to: https://supabase.com/dashboard/project/sebastiansaethre

Look for:
- Project status (should be "Active")
- Any warnings or errors
- Project settings → API → Project URL

