# Fix Blank Pages on Netlify

## Problem
Pages show for 0.1 seconds then go blank. This is because Supabase environment variables are missing in Netlify.

## Solution: Add Environment Variables to Netlify

### Step 1: Go to Netlify Dashboard
1. Go to: https://app.netlify.com
2. Click on your site: **sebastian-saethre**
3. Go to **Site settings** (or click on site name)

### Step 2: Add Environment Variables
1. In left menu: Click **"Environment variables"**
2. Click **"Add a variable"**
3. Add first variable:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://dwjiluewfvfwirxyqxpx.supabase.co`
   - **Scopes:** Select **"All scopes"** (or leave default)
   - Click **"Add"**
4. Click **"Add a variable"** again
5. Add second variable:
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3amlsdWV3ZnZmd2lyeHlxeHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTg4MzcsImV4cCI6MjA2OTk5NDgzN30.VT32dvQQhsMHRBr3LI5aFM2VIgSxE3sAY9EFxupbpO0`
   - **Scopes:** Select **"All scopes"**
   - Click **"Add"**

### Step 3: Trigger New Deployment
1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** (or three dots → "Trigger deploy")
3. Select **"Deploy site"**
4. Wait for deployment to complete (1-3 minutes)

### Step 4: Test
1. Go to your Netlify URL
2. Test the pages that were blank:
   - `/portfolio`
   - `/resources`
   - `/blog`
   - `/onboarding`
   - `/admin`
   - `/contact`
3. They should now work!

## Why This Happens

When environment variables are missing:
- Supabase client can't initialize properly
- Components that use Supabase crash
- React shows blank page (white screen of death)

I've updated the code to handle missing env vars more gracefully, but you still need to add them to Netlify for full functionality.

## After Adding Variables

The app will:
- ✅ Connect to Supabase properly
- ✅ Load data from database
- ✅ Allow form submissions
- ✅ Show all pages correctly

