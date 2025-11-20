# FIX NETLIFY DEPLOY ISSUE

## Problem
Netlify deployer ikke automatisk når du pusher til GitHub. Siste deploy er `main@9f501d3`, men vi har pushet flere commits etter det.

## Løsning

### Steg 1: Sjekk Netlify Build Settings
1. Gå til Netlify Dashboard → **Project configuration** → **Build & deploy**
2. Under **Build settings**, sjekk:
   - **Publish directory:** Skal være `dist` (ikke `.next`)
   - **Build command:** Skal være `npm run build`
   - **Base directory:** Skal være `/` eller tom

### Steg 2: Trigger Manuell Deploy
1. Gå til Netlify Dashboard → **Deploys**
2. Klikk på **"Trigger deploy"** knappen (øverst til høyre)
3. Velg **"Deploy site"**
4. Vent til deployen er ferdig (1-2 minutter)

### Steg 3: Sjekk GitHub Webhook (hvis manuell deploy fungerer)
1. Gå til Netlify Dashboard → **Project configuration** → **Build & deploy**
2. Under **Continuous deployment**, klikk **"Manage repository"**
3. Sjekk at repository er koblet til: `github.com/sfswtf/sebastian-saethre`
4. Sjekk at **Branch to deploy** er satt til `main`

### Steg 4: Hvis Webhook Ikke Fungerer
1. Gå til GitHub → Repository → **Settings** → **Webhooks**
2. Sjekk om det er en webhook for Netlify
3. Hvis ikke, må Netlify kobles til på nytt:
   - Gå til Netlify Dashboard → **Project configuration** → **Build & deploy**
   - Under **Continuous deployment**, klikk **"Manage repository"**
   - Klikk **"Disconnect repository"** og deretter **"Link repository"** på nytt
   - Velg `sfswtf/sebastian-saethre` og branch `main`

## Viktig: Publish Directory
Netlify-konfigurasjonen viser "Publish directory: `.next`" men det skal være `dist` for Vite-prosjekter. Dette kan forhindre at deployen fungerer riktig.

**Fiks dette:**
1. Gå til Netlify Dashboard → **Project configuration** → **Build & deploy**
2. Under **Build settings**, klikk **"Configure"**
3. Endre **Publish directory** fra `.next` til `dist`
4. Klikk **"Save"**
5. Trigger en ny deploy

