# Supabase Integration & Deployment Plan

## Overview
This document outlines the plan to connect the codebase to Supabase, GitHub, and deploy to Netlify.

## Phase 1: Supabase Database Setup

### 1.1 Environment Variables
Create `.env` file in project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 1.2 Required Tables
All tables already have migrations in `supabase/migrations/`. Run these in order:

1. **Core Tables:**
   - `profiles` (with `is_admin` field)
   - `blog_posts` (with `affiliate_links` JSONB)
   - `onboarding_responses`
   - `contact_messages`
   - `courses`
   - `portfolio_projects`
   - `tools_resources`
   - `events`
   - `social_media_posts`

2. **RLS Policies:**
   - Public INSERT for forms (onboarding, contact)
   - Admin-only SELECT for all tables
   - Admin-only UPDATE/DELETE

### 1.3 Migration Execution Order
Run migrations in Supabase SQL Editor in this order:
1. `20240407_initial_schema.sql` (or `20240410_complete_setup.sql`)
2. `20240410_admin_setup.sql`
3. `20240411_ensure_admin.sql`
4. `20250121120000_create_onboarding_responses.sql`
5. `20250121120001_add_affiliate_links_to_blog.sql`

### 1.4 Admin User Setup
Ensure your email (`sebastian.saethre@gmail.com`) has admin access:
- Check `profiles` table has your email with `is_admin = true`
- Or run `20240411_ensure_admin.sql` migration

## Phase 2: Code Updates for Supabase

### 2.1 Update Supabase Client
File: `src/lib/supabase.ts`
- Already configured to use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- No changes needed if env vars are set

### 2.2 Update Stores to Use Supabase
Files to update:
- `src/stores/onboardingStore.ts` - Already tries Supabase first, falls back to localStorage
- `src/stores/formStore.ts` - Update contact form submission
- All admin managers - Switch from LocalStorageService to Supabase

### 2.3 Update Components
- `src/components/ContactForm.tsx` - Already uses Supabase
- All admin managers - Add Supabase queries
- Frontend pages - Fetch from Supabase instead of localStorage

## Phase 3: GitHub Repository Setup

### 3.1 Initialize Git (if not already)
```bash
git init
git add .
git commit -m "Initial commit: AI onboarding website"
```

### 3.2 Connect to GitHub
```bash
git remote add origin https://github.com/sfswtf/sebastian-saethre.git
git branch -M main
git push -u origin main
```

### 3.3 .gitignore
Ensure `.gitignore` includes:
```
.env
.env.local
node_modules/
dist/
.DS_Store
```

## Phase 4: Netlify Deployment

### 4.1 Netlify Configuration
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 4.2 Environment Variables in Netlify
Add these in Netlify Dashboard → Site Settings → Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 4.3 Domain Configuration
1. In Netlify: Site Settings → Domain Management
2. Add custom domain: `sebastiansaethre.no`
3. Update DNS records as instructed by Netlify
4. Enable HTTPS (automatic with Netlify)

### 4.4 Build Settings
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18

## Phase 5: Migration Strategy

### 5.1 Data Migration from localStorage
Create a migration script to move existing localStorage data to Supabase:
- Run once after Supabase is connected
- Script location: `scripts/migrate-localStorage-to-supabase.ts`

### 5.2 Testing Strategy
1. Test locally with Supabase connection
2. Test all forms (onboarding, contact)
3. Test admin panel CRUD operations
4. Test frontend pages display published content
5. Deploy to Netlify staging
6. Test production deployment

## Implementation Checklist

### Supabase Setup
- [ ] Create `.env` file with Supabase credentials
- [ ] Run all migrations in Supabase SQL Editor
- [ ] Verify admin user exists in `profiles` table
- [ ] Test Supabase connection locally
- [ ] Update all stores to use Supabase (remove localStorage fallback for production)
- [ ] Test all CRUD operations

### GitHub Setup
- [ ] Initialize git repository
- [ ] Create `.gitignore` file
- [ ] Add and commit all files
- [ ] Connect to GitHub remote
- [ ] Push to main branch
- [ ] Verify repository is accessible

### Netlify Setup
- [ ] Create `netlify.toml` configuration
- [ ] Connect GitHub repository to Netlify
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Set up custom domain `sebastiansaethre.no`
- [ ] Configure DNS records
- [ ] Test deployment
- [ ] Enable automatic deployments from main branch

### Testing
- [ ] Test all forms submit to Supabase
- [ ] Test admin panel can read/write data
- [ ] Test frontend pages display content from Supabase
- [ ] Test authentication (if implemented)
- [ ] Test on mobile devices
- [ ] Test performance and loading times

## Notes

- Keep localStorage as fallback during development
- Use Supabase Row Level Security (RLS) for data protection
- All migrations are in `supabase/migrations/` directory
- Environment variables should NEVER be committed to git
- Netlify will automatically build on every push to main branch


