# Netlify Setup - Steg-for-steg (Norsk)

## PROBLEM: Du finner ikke "Site settings" og "Domain management"

Dette betyr at Netlify-prosjektet ikke er koblet til GitHub-repositoryet ditt ennå.

## LØSNING: Kobler til GitHub først

### Steg 1: Gå til Netlify Dashboard
1. Gå til: https://app.netlify.com
2. Du skal se en liste med prosjekter (eller tom liste hvis du ikke har noen)

### Steg 2: Importer GitHub Repository
1. Klikk på **"Add new site"** (stor grønn knapp øverst til høyre)
2. Klikk på **"Import an existing project"**
3. Klikk på **"Deploy with GitHub"** (eller GitHub-ikonet)
4. Hvis du ikke er koblet til GitHub:
   - Klikk **"Authorize Netlify"**
   - Velg GitHub-kontoen din
   - Klikk **"Authorize netlify"** (grønn knapp)
5. Når GitHub er koblet:
   - Du ser en liste med repositories
   - **Søk etter:** `sebastian-saethre` (eller scroll ned)
   - **Klikk på:** `sfswtf/sebastian-saethre`

### Steg 3: Konfigurer Build Settings
Netlify skal automatisk oppdage Vite, men sjekk:

- **Branch to deploy:** `main` (skal være valgt)
- **Build command:** `npm run build` (skal være fylt ut)
- **Publish directory:** `dist` (skal være fylt ut)

**Hvis noe mangler:**
- Klikk på **"Show advanced"** eller **"Change settings"**
- Fyll ut:
  - Build command: `npm run build`
  - Publish directory: `dist`

### Steg 4: Klikk "Deploy site"
1. Klikk på den store grønne knappen **"Deploy site"**
2. Du kommer til deploy-siden
3. Vent mens Netlify bygger (1-3 minutter)
4. Du ser en progress bar

### Steg 5: NÅ skal du se "Site settings"
Når deployment er ferdig:

1. **Klikk på site-navnet** (f.eks. "sebastian-saethre" eller "sebastian-saethre-xxxxx")
2. Du kommer til **Site overview**
3. I venstre meny skal du nå se:
   - Project overview
   - **Site settings** ← KLIKK HER!
   - Deploys
   - Domain management
   - osv.

### Steg 6: Legg til miljøvariabler
1. Klikk på **"Site settings"** i venstre meny
2. Scroll ned til **"Environment variables"** (eller klikk på det i venstre meny)
3. Klikk **"Add a variable"**
4. Legg til første:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://dwjiluewfvfwirxyqxpx.supabase.co`
   - Klikk **"Add"**
5. Klikk **"Add a variable"** igjen
6. Legg til andre:
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3amlsdWV3ZnZmd2lyeHlxeHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTg4MzcsImV4cCI6MjA2OTk5NDgzN30.VT32dvQQhsMHRBr3LI5aFM2VIgSxE3sAY9EFxupbpO0`
   - Klikk **"Add"**

### Steg 7: Trigger ny deployment
1. Gå til **"Deploys"**-fanen (i venstre meny)
2. Klikk på **"Trigger deploy"** (eller tre prikker → "Trigger deploy")
3. Velg **"Deploy site"**
4. Vent mens den bygger på nytt (nå med miljøvariabler)

### Steg 8: Test Netlify-URL
1. Når deployment er ferdig, se øverst på siden
2. Du ser en URL som: `https://sebastian-saethre-xxxxx.netlify.app`
3. Klikk på URL-en
4. Test onboarding-skjemaet
5. Sjekk Supabase Table Editor → `onboarding_responses`

### Steg 9: Koble til domenet (når du er klar)
1. I venstre meny: Klikk på **"Domain management"**
2. Klikk **"Add domain alias"**
3. Skriv: `sebastiansaethre.no`
4. Følg DNS-instruksjonene fra Netlify

---

## Hvis du fortsatt ikke ser "Site settings"

**Mulig årsak:** Du er på feil prosjekt eller har ikke opprettet et prosjekt ennå.

**Løsning:**
1. Gå til: https://app.netlify.com
2. Sjekk om du ser prosjektet "sebastian-saethre" i listen
3. Hvis ikke: Følg Steg 2-4 over for å importere GitHub-repositoryet
4. Hvis du ser prosjektet: Klikk på det, så skal du se "Site settings" i venstre meny

---

## Viktig: Fiks RLS-policy først!

Før du tester på Netlify, husk å kjøre SQL-en i Supabase:

1. Gå til: https://supabase.com/dashboard
2. Klikk på prosjektet: **sebastiansaethre**
3. Klikk på **SQL Editor**
4. Kjør denne SQL-en:

```sql
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;

CREATE POLICY "Anyone can submit an onboarding response"
  ON onboarding_responses 
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);
```

5. Klikk **Run**

