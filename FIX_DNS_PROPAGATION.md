# Fix DNS Propagation and SSL Certificate Issues

## Problem
- DNS stuck on "propagating..."
- SSL certificate not provisioning
- Site not accessible

## Solution: Add DNS Records Manually

If name servers aren't working, we'll add DNS records directly in domene.shop.

---

## Step 1: Get DNS Records from Netlify

1. Go to Netlify → Your site → **Domain management**
2. Click on **`sebastiansaethre.no`** (the domain name itself, not the options menu)
3. This should take you to **DNS settings**
4. Look at the **"DNS records"** section
5. You should see records like:
   - `sebastiansaethre.no` → `sebastiansaethre.netlify.app` (Type: NETLIFY or CNAME)
   - `www.sebastiansaethre.no` → `sebastiansaethre.netlify.app` (Type: NETLIFY or CNAME)

**OR** if you see A records, note the IP addresses.

---

## Step 2: Add DNS Records in domene.shop

1. Go to domene.shop → Your domain → **DNS records** tab
2. **Remove or ignore** the name servers for now (we'll use DNS records instead)

### Add these DNS records:

**Record 1: Root Domain**
- **Type:** `CNAME` (or `A` if Netlify gave you an IP)
- **Name/Host:** `@` or leave empty (for root domain)
- **Value/Target:** `sebastiansaethre.netlify.app` (or the IP if it's an A record)
- **TTL:** `3600`

**Record 2: WWW Subdomain**
- **Type:** `CNAME`
- **Name/Host:** `www`
- **Value/Target:** `sebastiansaethre.netlify.app`
- **TTL:** `3600`

3. Click **Save**

---

## Step 3: Verify in Netlify

1. Go back to Netlify → Domain management
2. Wait 15-30 minutes
3. The status should change from "propagating..." to "Active"
4. SSL certificate should provision automatically

---

## Alternative: Check Name Server Status

If you want to stick with name servers:

1. Go to domene.shop → Your domain → **Nameservers** tab
2. Verify the 4 Netlify name servers are saved correctly
3. Make sure they match exactly:
   - `dns1.p03.nsone.net`
   - `dns2.p03.nsone.net`
   - `dns3.p03.nsone.net`
   - `dns4.p03.nsone.net`

4. If they're correct, wait up to 24 hours (can take time for .no domains)

---

## Troubleshooting SSL Certificate

If SSL still doesn't work after DNS is active:

1. In Netlify → Domain management → Your domain
2. Look for **"SSL/TLS certificate"** section
3. Click **"Verify DNS configuration"** or **"Retry certificate"**
4. Sometimes you need to wait a bit longer after DNS is active

---

## Quick Checklist

- [ ] DNS records added in domene.shop (or name servers verified)
- [ ] Records point to `sebastiansaethre.netlify.app`
- [ ] Waited 15-30 minutes after adding records
- [ ] Checked Netlify shows domain as "Active"
- [ ] SSL certificate status checked
- [ ] Tested site at www.sebastiansaethre.no

