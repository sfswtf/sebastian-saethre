# Fix Netlify to Build from Main Branch

## Problem
Netlify is building from `devin/1726594416-portfolio-website-implementation` branch instead of `main` branch. This is why the Tailwind fix isn't being used.

## Solution: Change Netlify to Build from Main Branch

### Option 1: Change in Netlify Dashboard (Recommended)

1. Go to Netlify Dashboard: https://app.netlify.com
2. Click on your site: **sebastian-saethre**
3. Go to **Site settings** (or click on site name)
4. In left menu: Click **"Build & deploy"**
5. Under **"Continuous Deployment"** section:
   - Find **"Branch to deploy"**
   - Change it from `devin/1726594416-portfolio-website-implementation` to `main`
6. Click **"Save"**
7. Go to **"Deploys"** tab
8. Click **"Trigger deploy"** → **"Deploy site"**

### Option 2: Change Default Branch in GitHub (Alternative)

If you want `main` to be the default branch in GitHub:

1. Go to GitHub: https://github.com/sfswtf/sebastian-saethre
2. Click **Settings** (in repository)
3. Scroll down to **"Default branch"**
4. Change from `devin/1726594416-portfolio-website-implementation` to `main`
5. Click **"Update"**

Then update Netlify to use `main` (follow Option 1).

### Option 3: Fix the Other Branch (If you need to keep it)

If you need to keep the other branch working:

1. In GitHub, go to the branch: `devin/1726594416-portfolio-website-implementation`
2. Edit `tailwind.config.ts`
3. Change `darkMode: ["class"]` to `darkMode: 'class'`
4. Commit and push

But **Option 1 is recommended** - just change Netlify to build from `main`.

