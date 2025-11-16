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
6. Enter: `www.sebastiansaethre.no` (or just `sebastiansaethre.no`)
7. Click **Verify**

---

## Step 2: Choose Your Method

You'll see two options in Netlify. **Use Option A (Name Servers) - it's easier!**

### ✅ Option A: Use Netlify DNS (RECOMMENDED - EASIEST)

**This is the easiest method!** You just point your domain's name servers to Netlify.

1. In Netlify, go to **Domain management** → **DNS settings**
2. Scroll down to **"Name servers"** section
3. You'll see 4 name servers like:
   - `dns1.p03.nsone.net`
   - `dns2.p03.nsone.net`
   - `dns3.p03.nsone.net`
   - `dns4.p03.nsone.net`
4. **Copy all 4 name servers** (click the copy icon next to each)

5. **Go to domene.shop:**
   - Log in to [domene.shop](https://www.domene.shop)
   - Go to **My Domains** → Find `sebastiansaethre.no`
   - Click **Manage** or **Settings**
   - Look for **"Name Servers"** or **"DNS Servers"** or **"Nameserver Settings"**
   - Change from default to **"Custom"** or **"Use custom name servers"**
   - Paste the 4 name servers from Netlify
   - Click **Save**

**That's it!** Netlify will handle all DNS automatically.

---

### Option B: Use External DNS (More Complex)

Only use this if Option A doesn't work or you need custom DNS records.

1. In Netlify, go to **Domain management** → Your domain
2. Look for **"DNS records"** or **"DNS configuration"**
3. You need to find the DNS records to add. If you don't see them:
   - Go to **Site settings** → **Domain management** → Click on your domain
   - Look for **"DNS configuration"** or **"DNS records"**
   - You should see something like:
     - **Type:** `CNAME` or `A`
     - **Name:** `www` or `@`
     - **Value:** An IP address or `sebastiansaethre.netlify.app`

4. **Go to domene.shop:**
   - Log in to [domene.shop](https://www.domene.shop)
   - Go to **My Domains** → Find `sebastiansaethre.no`
   - Click **DNS Settings** or **DNS Management**
   - Add the DNS record:
     - **Type:** `CNAME` (or `A` if Netlify gave you an IP)
     - **Name/Host:** `www` (or `@` for root domain)
     - **Value/Target:** What Netlify told you (usually `sebastiansaethre.netlify.app` or an IP)
     - **TTL:** `3600` (or leave default)
   - Click **Save**

---

## Step 3: Wait for DNS Propagation

**If you used Option A (Name Servers):**
- Changes can take **1-24 hours** (usually 1-2 hours)
- Netlify will automatically set up all DNS records

**If you used Option B (DNS Records):**
- Changes can take **15 minutes to 48 hours** (usually 15-30 minutes)

You can check status in Netlify (it will show "Pending" then "Active")

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

