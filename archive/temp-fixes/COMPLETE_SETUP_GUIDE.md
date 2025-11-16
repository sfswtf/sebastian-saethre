# Komplett Setup Guide - Fra Start til Ferdig

## DEL 1: Fiks 401-feilen i Supabase (MÅ GJØRES FØRST!)

### Steg 1.1: Åpne Supabase SQL Editor
1. Gå til: https://supabase.com/dashboard
2. Klikk på prosjektet: **sebastiansaethre**
3. I venstre meny: Klikk på **SQL Editor** (ikonet med `</>`)
4. Klikk på **"New query"** (eller bruk eksisterende)

### Steg 1.2: Kjør denne SQL-en
Kopier og lim inn HELE denne SQL-en:

```sql
-- Fix 401 Unauthorized Error for onboarding_responses
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;

CREATE POLICY "Anyone can submit an onboarding response"
  ON onboarding_responses 
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);
```

**Klikk Run** (eller Ctrl+Enter).

**Du skal se:** "Success. No rows returned"

### Steg 1.3: Test at det fungerer
1. Gå tilbake til localhost: `http://localhost:5173/onboarding`
2. Fyll ut skjemaet
3. Åpne DevTools (F12) → Console
4. Du skal IKKE se 401-feil lenger
5. Sjekk Supabase Table Editor → `onboarding_responses` - du skal se dataene!

---

## DEL 2: Push kode til GitHub

### Steg 2.1: Sjekk hva som skal committes
```bash
git status
```

### Steg 2.2: Legg til alle filer
```bash
git add .
```

### Steg 2.3: Commit
```bash
git commit -m "feat: Complete Supabase integration with translations and fixes"
```

### Steg 2.4: Push til GitHub
```bash
git push origin main
```

**Du skal se:** "Writing objects: 100%..." og "To https://github.com/sfswtf/sebastian-saethre.git"

---

## DEL 3: Sett opp Netlify (Steg-for-steg)

### Steg 3.1: Logg inn på Netlify
1. Gå til: https://app.netlify.com
2. Logg inn (eller opprett konto hvis du ikke har en)
3. Du kommer til Netlify Dashboard

### Steg 3.2: Importer GitHub-prosjektet
1. Klikk på **"Add new site"** (stor grønn knapp)
2. Klikk på **"Import an existing project"**
3. Klikk på **"Deploy with GitHub"** (eller "GitHub" ikonet)
4. Hvis du ikke er koblet til GitHub:
   - Klikk **"Authorize Netlify"**
   - Velg GitHub-kontoen din
   - Klikk **"Authorize netlify"** (grønn knapp)
5. Når GitHub er koblet til:
   - Du ser en liste med repositories
   - **Søk etter:** `sebastian-saethre`
   - Klikk på **"sebastian-saethre"** repository

### Steg 3.3: Konfigurer build-innstillinger
Netlify skal automatisk oppdage Vite, men sjekk at dette er riktig:

- **Branch to deploy:** `main` (skal være valgt)
- **Build command:** `npm run build` (skal være fylt ut automatisk)
- **Publish directory:** `dist` (skal være fylt ut automatisk)

**Hvis noe er feil:**
- Klikk på **"Show advanced"** eller **"Change settings"**
- Fyll ut manuelt:
  - Build command: `npm run build`
  - Publish directory: `dist`

### Steg 3.4: Klikk "Deploy site"
1. Klikk på den store grønne knappen **"Deploy site"**
2. Du kommer til deploy-siden
3. Vent mens Netlify bygger (kan ta 1-3 minutter)
4. Du ser en progress bar som viser build-status

### Steg 3.5: Legg til miljøvariabler (VIKTIG!)
Mens Netlify bygger, eller etterpå:

1. I Netlify Dashboard, gå til: **Site settings** (eller klikk på site-navnet)
2. I venstre meny: Klikk på **"Environment variables"**
3. Klikk på **"Add a variable"** (eller **"Add environment variable"**)
4. Legg til første variabel:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://dwjiluewfvfwirxyqxpx.supabase.co`
   - **Scopes:** Velg **"All scopes"** (eller la stå som default)
   - Klikk **"Add"**
5. Legg til andre variabel:
   - Klikk **"Add a variable"** igjen
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3amlsdWV3ZnZmd2lyeHlxeHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTg4MzcsImV4cCI6MjA2OTk5NDgzN30.VT32dvQQhsMHRBr3LI5aFM2VIgSxE3sAY9EFxupbpO0`
   - **Scopes:** Velg **"All scopes"**
   - Klikk **"Add"**

### Steg 3.6: Trigger ny deployment (etter å ha lagt til miljøvariabler)
1. Gå til **"Deploys"**-fanen
2. Klikk på **"Trigger deploy"** (eller tre prikker → "Trigger deploy")
3. Velg **"Deploy site"**
4. Vent mens den bygger på nytt (nå med miljøvariabler)

### Steg 3.7: Test Netlify-URL-en
1. Når deployment er ferdig, se øverst på siden
2. Du ser en URL som: `https://sebastian-saethre-xxxxx.netlify.app`
3. Klikk på URL-en eller kopier den
4. Åpne i ny fane
5. Test onboarding-skjemaet
6. Sjekk Supabase Table Editor - data skal nå komme inn!

---

## DEL 4: Koble til domenet sebastiansaethre.no

### Steg 4.1: Gå til Domain Management
1. I Netlify Dashboard → **Site settings**
2. I venstre meny: Klikk på **"Domain management"**

### Steg 4.2: Legg til custom domain
1. Klikk på **"Add domain alias"** (eller **"Add custom domain"**)
2. Skriv inn: `sebastiansaethre.no`
3. Klikk **"Verify"** eller **"Add domain"**

### Steg 4.3: Følg DNS-instruksjoner
Netlify vil gi deg DNS-instruksjoner. Du har to valg:

**Valg A: Bruk Netlify DNS (Enklest)**
1. Netlify vil gi deg nameservers (f.eks. `dns1.p01.nsone.net`)
2. Gå til din domain registrar (domainnameshop.no)
3. Endre nameservers til de Netlify gir deg
4. Vent 24-48 timer for DNS-propagation

**Valg B: Legg til DNS-records (Hvis du vil beholde din nåværende DNS)**
1. Netlify vil gi deg en IP-adresse eller CNAME
2. Gå til domainnameshop.no → DNS records
3. Legg til:
   - Type: `A` eller `CNAME`
   - Name: `@` (eller tom)
   - Value: (IP eller CNAME fra Netlify)
4. For www-subdomain:
   - Type: `CNAME`
   - Name: `www`
   - Value: (CNAME fra Netlify)

### Steg 4.4: Vent på DNS-propagation
- Kan ta 5 minutter til 48 timer
- Netlify vil automatisk aktivere HTTPS når DNS er propagert

---

## DEL 5: Verifiser at alt fungerer

### Testliste:
- [ ] Onboarding-skjema fungerer på Netlify-URL
- [ ] Data kommer inn i Supabase `onboarding_responses`-tabellen
- [ ] Admin login fungerer
- [ ] Alle sider laster riktig
- [ ] Custom domain fungerer (når DNS er propagert)

---

## Troubleshooting

### Build feiler i Netlify
- Sjekk build logs i Netlify → Deploys → Klikk på failed deploy
- Vanlig feil: Manglende miljøvariabler → Legg dem til i Step 3.5

### 401-feil fortsatt
- Sjekk at du har kjørt SQL-en i DEL 1
- Sjekk at miljøvariablene er riktig i Netlify
- Trigger ny deployment etter å ha lagt til miljøvariabler

### DNS fungerer ikke
- Sjekk at DNS-records er riktig i domainnameshop
- Vent lenger (kan ta opptil 48 timer)
- Sjekk DNS-propagation: https://dnschecker.org

