# Netlify Setup Guide - Deploy to Production

## Why Netlify?
- Better network connectivity than localhost
- Production-like environment
- Environment variables configured properly
- Automatic HTTPS
- Easy domain connection

## Step 1: Fix RLS Policies First (IMPORTANT!)

Before deploying, fix the 401 error by running this in Supabase SQL Editor:

```sql
-- Fix onboarding_responses RLS policy
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;

CREATE POLICY "Anyone can submit an onboarding response"
  ON onboarding_responses 
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);
```

## Step 2: Push Code to GitHub

1. Make sure all changes are committed:
   ```bash
   git add .
   git commit -m "feat: Complete Supabase integration with translations"
   ```

2. Push to GitHub:
   ```bash
   git push origin main
   ```

## Step 3: Connect to Netlify

1. Go to: https://app.netlify.com
2. Sign in (or create account)
3. Click "Add new site" → "Import an existing project"
4. Choose "GitHub"
5. Authorize Netlify to access GitHub
6. Select repository: `sfswtf/sebastian-saethre`
7. Click "Deploy site"

## Step 4: Configure Build Settings

Netlify should auto-detect Vite, but verify:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18 (or latest LTS)

## Step 5: Add Environment Variables

1. In Netlify Dashboard → Site Settings → Environment Variables
2. Add these variables:
   - `VITE_SUPABASE_URL` = `https://dwjiluewfvfwirxyqxpx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (your anon key from Supabase)

3. Click "Save"

## Step 6: Trigger New Deployment

1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Deploy site"
3. Wait for build to complete

## Step 7: Connect Custom Domain

1. Go to: Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter: `sebastiansaethre.no`
4. Follow DNS instructions from Netlify
5. Update your domain's DNS records as instructed

## Step 8: Test Production Site

1. Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
2. Test onboarding form
3. Check Supabase table for new entries

## Benefits of Netlify vs Localhost

✅ **Better connectivity** - No local network issues
✅ **HTTPS** - Required for some features
✅ **Production environment** - Tests real deployment
✅ **Environment variables** - Properly configured
✅ **Automatic deployments** - On every git push
✅ **Custom domain** - sebastiansaethre.no

## Troubleshooting

### Build fails
- Check build logs in Netlify
- Verify `package.json` has correct scripts
- Check Node version

### Environment variables not working
- Make sure they start with `VITE_`
- Redeploy after adding variables
- Check build logs for errors

### Still getting 401 errors
- Run the RLS policy fix SQL in Supabase
- Check Supabase Dashboard → Settings → API → CORS settings
- Verify anon key is correct

