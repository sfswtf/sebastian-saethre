# Implementation Plan: Supabase, GitHub & Netlify Integration

## ✅ Completed Fixes

### 1. Email Links
- ✅ Contact page email now uses `mailto:` link
- ✅ Footer email already had `mailto:` link
- ✅ Onboarding thanks page uses email for scheduling (replaced Calendly)

### 2. Onboarding Form Feedback
- ✅ Added loading state (`isSubmitting`) with spinner
- ✅ Shows "Sending..." message during submission
- ✅ Success toast appears before navigation
- ✅ 500ms delay before redirect to show feedback

### 3. Google Meet Alternative
- ✅ Replaced Calendly with email link (mailto with pre-filled subject/body)
- ✅ User can click to open their default email client
- ✅ Alternative: Can set up Google Calendar appointment slots later

---

## Phase 1: Supabase Database Setup

### Step 1.1: Get Supabase Credentials
1. Go to https://supabase.com/dashboard
2. Open project: `sebastiansaethre`
3. Go to Settings → API
4. Copy:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` public key

### Step 1.2: Create Environment File
Create `.env` in project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 1.3: Run Database Migrations
In Supabase Dashboard → SQL Editor, run migrations in this order:

1. **Initial Schema** (if not already run):
   - `20240410_complete_setup.sql` - Creates all core tables

2. **Admin Setup**:
   - `20240410_admin_setup.sql` - Creates admin user system
   - `20240411_ensure_admin.sql` - Ensures your email is admin

3. **New Tables**:
   - `20250121120000_create_onboarding_responses.sql` - Onboarding form table
   - `20250121120001_add_affiliate_links_to_blog.sql` - Blog affiliate links

### Step 1.4: Verify Tables Exist
Check these tables exist in Supabase:
- ✅ `profiles` (with `is_admin` column)
- ✅ `blog_posts` (with `affiliate_links` JSONB column)
- ✅ `onboarding_responses`
- ✅ `contact_messages`
- ✅ `courses`
- ✅ `portfolio_projects`
- ✅ `tools_resources`
- ✅ `events`
- ✅ `social_media_posts`

### Step 1.5: Verify Admin Access
Run this query in Supabase SQL Editor:
```sql
SELECT email, is_admin FROM profiles WHERE email = 'sebastian.saethre@gmail.com';
```
Should return `is_admin = true`

---

## Phase 2: Update Code for Supabase

### Step 2.1: Update Supabase Client (Already Done)
File: `src/lib/supabase.ts` - Already configured ✅

### Step 2.2: Update Admin Managers
Files to update (switch from LocalStorageService to Supabase):

1. **BlogManager.tsx**
   - `fetchPosts()`: Use `supabase.from('blog_posts').select()`
   - `handleSubmit()`: Use `supabase.from('blog_posts').insert()` or `.update()`
   - `handleDelete()`: Use `supabase.from('blog_posts').delete()`

2. **CourseManager.tsx** - Same pattern
3. **PortfolioManager.tsx** - Same pattern
4. **ResourceManager.tsx** - Same pattern
5. **EventManager.tsx** - Same pattern
6. **SocialMediaManager.tsx** - Same pattern
7. **ContactMessages.tsx** - Already uses Supabase ✅

### Step 2.3: Update Frontend Pages
Files to update (fetch from Supabase instead of localStorage):

1. **BlogPage.tsx**
   - Replace `LocalStorageService.get('blog_posts')` with `supabase.from('blog_posts').select()`
   - Filter for `status = 'published'`

2. **BlogPostDetailPage.tsx**
   - Fetch by slug: `supabase.from('blog_posts').select().eq('slug', slug).single()`

3. **CoursesPage.tsx**
   - Replace localStorage with Supabase query

4. **CourseDetailPage.tsx**
   - Fetch by ID from Supabase

5. **PortfolioPage.tsx**
   - Replace localStorage with Supabase query

6. **PortfolioDetailPage.tsx**
   - Fetch by ID from Supabase

7. **ResourcesPage.tsx**
   - Replace localStorage with Supabase query

8. **SocialMediaGallery.tsx**
   - Replace localStorage with Supabase query

### Step 2.4: Keep localStorage as Fallback
- Keep LocalStorageService calls as fallback in try/catch blocks
- This allows local testing if Supabase is unavailable
- Production will use Supabase primarily

---

## Phase 3: GitHub Repository Setup

### Step 3.1: Check Git Status
```bash
git status
```

### Step 3.2: Initialize Git (if needed)
```bash
git init
```

### Step 3.3: Add All Files
```bash
git add .
```

### Step 3.4: Initial Commit
```bash
git commit -m "Initial commit: Sebastian Saethre portfolio website with AI onboarding"
```

### Step 3.5: Connect to GitHub
```bash
git remote add origin https://github.com/sfswtf/sebastian-saethre.git
git branch -M main
git push -u origin main
```

### Step 3.6: Verify .gitignore
Ensure `.gitignore` includes:
- `.env`
- `.env.local`
- `node_modules/`
- `dist/`

---

## Phase 4: Netlify Deployment

### Step 4.1: Netlify Configuration (Already Created)
File: `netlify.toml` - Already created ✅

### Step 4.2: Connect GitHub to Netlify
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Authorize Netlify to access GitHub
5. Select repository: `sfswtf/sebastian-saethre`
6. Configure build:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

### Step 4.3: Add Environment Variables
In Netlify Dashboard → Site Settings → Environment Variables:
- `VITE_SUPABASE_URL` = Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

### Step 4.4: Custom Domain Setup
1. In Netlify: Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter: `sebastiansaethre.no`
4. Follow DNS configuration instructions:
   - Add A record or CNAME as instructed
   - Netlify will provide the exact DNS values

### Step 4.5: SSL Certificate
- Netlify automatically provisions SSL certificate
- HTTPS will be enabled automatically after DNS propagates

### Step 4.6: Deploy
- First deployment will trigger automatically after connecting GitHub
- Future deployments happen automatically on every push to `main` branch

---

## Phase 5: Testing Checklist

### Local Testing (Before Deployment)
- [ ] Test onboarding form submission (check Supabase table)
- [ ] Test contact form submission (check Supabase table)
- [ ] Test admin login
- [ ] Test creating blog post in admin
- [ ] Test publishing blog post
- [ ] Verify blog post appears on frontend
- [ ] Test all CRUD operations in admin panel
- [ ] Test blog post detail page loads correctly
- [ ] Test course detail page loads correctly
- [ ] Test portfolio detail page loads correctly

### Production Testing (After Deployment)
- [ ] Test all forms work on production domain
- [ ] Test admin panel on production
- [ ] Verify HTTPS is working
- [ ] Test mobile responsiveness
- [ ] Test page load speeds
- [ ] Verify all images load correctly
- [ ] Test navigation between pages
- [ ] Test language switcher

---

## Migration Notes

### Data Migration Strategy
If you have existing data in localStorage:
1. Export data from browser localStorage
2. Create a migration script to insert into Supabase
3. Run script once after Supabase is connected
4. Verify data appears in Supabase tables

### Rollback Plan
- Keep localStorage fallback active during transition
- If Supabase has issues, site will still work with localStorage
- Gradually remove localStorage fallback after Supabase is stable

---

## Next Steps After Deployment

1. **Analytics**: Add Plausible or Fathom Analytics
2. **Email Notifications**: Set up Supabase Edge Functions for email alerts
3. **SEO**: Verify meta tags, sitemap, robots.txt
4. **Performance**: Optimize images, enable caching
5. **Monitoring**: Set up error tracking (Sentry, etc.)

---

## Support & Resources

- Supabase Docs: https://supabase.com/docs
- Netlify Docs: https://docs.netlify.com
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html


