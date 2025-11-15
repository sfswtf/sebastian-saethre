# Supabase Migrations Guide

## Step 1: Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Log in and select project: **sebastiansaethre**
3. Navigate to **SQL Editor** (left sidebar)

## Step 2: Run Migrations in Order

Copy and paste each migration file content into the SQL Editor and run them **in this exact order**:

### 1. Core Setup (if not already run)
**File:** `supabase/migrations/20240410_complete_setup.sql`
- Creates: `profiles`, `events`, `membership_applications`, `contact_messages`
- Sets up RLS policies

### 2. Admin Setup
**File:** `supabase/migrations/20240410_admin_setup.sql`
- Creates admin user system

### 3. Ensure Admin User
**File:** `supabase/migrations/20240411_ensure_admin.sql`
- Ensures your email (sebastian.saethre@gmail.com) has admin access

### 4. Onboarding Responses Table
**File:** `supabase/migrations/20250121120000_create_onboarding_responses.sql`
- Creates table for onboarding form submissions

### 5. Blog Affiliate Links
**File:** `supabase/migrations/20250121120001_add_affiliate_links_to_blog.sql`
- Adds `affiliate_links` JSONB column to `blog_posts` table

### 6. Content Tables (NEW - IMPORTANT!)
**File:** `supabase/migrations/20250121120002_create_content_tables.sql`
- Creates: `blog_posts`, `courses`, `portfolio_projects`, `tools_resources`
- Sets up RLS policies for all content types
- Creates indexes for performance

## Step 3: Verify Tables

After running all migrations, verify in **Table Editor**:

✅ `blog_posts` (with `affiliate_links` JSONB column)
✅ `courses`
✅ `portfolio_projects`
✅ `tools_resources`
✅ `onboarding_responses`
✅ `contact_messages`
✅ `profiles` (with `is_admin` column)
✅ `events`

## Step 4: Verify Admin Access

1. Go to **Authentication** → **Users**
2. Find your user or create one with email: `sebastian.saethre@gmail.com`
3. Copy the user's UUID
4. Go to **Table Editor** → `profiles` table
5. Insert or update your profile:
   ```sql
   INSERT INTO profiles (id, is_admin)
   VALUES ('your-user-uuid-here', true)
   ON CONFLICT (id) DO UPDATE SET is_admin = true;
   ```

## Step 5: Test the Integration

1. Start dev server: `npm run dev`
2. Test admin login at `/login`
3. Test creating content:
   - Create a blog post → Check it appears on `/blog`
   - Create a course → Check it appears on `/courses`
   - Create a portfolio project → Check it appears on `/portfolio`
   - Create a resource → Check it appears on `/resources`
4. Test onboarding form at `/onboarding` → Check data in `onboarding_responses` table

## Troubleshooting

### If migration fails:
- Check for existing tables (some may already exist)
- Use `CREATE TABLE IF NOT EXISTS` (already in migrations)
- Check error messages in Supabase SQL Editor

### If admin access doesn't work:
- Verify `profiles` table has your user with `is_admin = true`
- Check RLS policies allow admin access
- Try logging out and back in

### If data doesn't appear:
- Check browser console for errors
- Verify Supabase connection in `.env` file
- Check RLS policies allow public read access for published content

