# Connect Domain to Netlify - Simple Guide

## Prerequisites
- Your site is already deployed on Netlify (at `sebastiansaethre.netlify.app`)
- You have access to your domene.shop account
- You have access to your Netlify account

---

## Step 1: Add Domain in Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click on your site (`sebastiansaethre`)
3. Go to **Site settings** (top right, gear icon)
4. Click **Domain management** in the left sidebar
5. Click **Add custom domain**
6. Enter: `www.sebastiansaethre.no`
7. Click **Verify**
8. Netlify will show you DNS records you need to add

**Important:** Write down or copy these DNS records - you'll need them in Step 2!

You'll see something like:
- **Type:** `A` or `CNAME`
- **Name:** `www` or `@`
- **Value:** An IP address or domain name

---

## Step 2: Add DNS Records in domene.shop

1. Log in to [domene.shop](https://www.domene.shop)
2. Go to **My Domains** or **Domain Management**
3. Find `sebastiansaethre.no` and click **Manage** or **DNS Settings**
4. Look for **DNS Records** or **DNS Management**

### Option A: If Netlify gave you an A record (IP address)
- **Type:** `A`
- **Name/Host:** `www`
- **Value/Target:** (the IP address Netlify gave you, usually starts with `75.2.x.x` or similar)
- **TTL:** `3600` (or leave default)

### Option B: If Netlify gave you a CNAME record
- **Type:** `CNAME`
- **Name/Host:** `www`
- **Value/Target:** `sebastiansaethre.netlify.app` (or what Netlify told you)
- **TTL:** `3600` (or leave default)

5. Click **Save** or **Add Record**

---

## Step 3: Wait for DNS Propagation

- DNS changes can take **5 minutes to 48 hours** to propagate
- Usually takes **15-30 minutes**
- You can check status in Netlify (it will show "Pending" then "Active")

---

## Step 4: Verify in Netlify

1. Go back to Netlify → Your site → **Domain management**
2. Wait until you see **"Active"** next to your domain
3. If it says **"Pending"**, wait a bit longer

---

## Step 5: Test Your Site

1. Open a new browser window (or incognito mode)
2. Go to `https://www.sebastiansaethre.no`
3. Your site should load!

---

## Troubleshooting

### Domain shows "Pending" for a long time
- Check that DNS records are saved correctly in domene.shop
- Make sure the values match exactly what Netlify gave you
- Wait up to 48 hours (usually much faster)

### Site doesn't load
- Check Netlify shows domain as "Active"
- Try clearing browser cache
- Check DNS records are correct in domene.shop

### SSL Certificate Issues
- Netlify automatically provides SSL certificates
- It may take a few minutes after domain is active
- If it doesn't work after 24 hours, contact Netlify support

---

## Quick Checklist

- [ ] Added domain in Netlify
- [ ] Copied DNS records from Netlify
- [ ] Added DNS records in domene.shop
- [ ] Saved DNS records
- [ ] Waited for DNS propagation (15-30 min)
- [ ] Verified domain is "Active" in Netlify
- [ ] Tested site at www.sebastiansaethre.no

---

## Need Help?

If you get stuck:
1. Check Netlify's domain status page
2. Verify DNS records match exactly
3. Wait a bit longer (DNS can be slow)
4. Check domene.shop's DNS settings are saved

