# Sitemap Fix Guide

## Problem
Google Search Console viser "Couldn't fetch" for sitemap.xml

## Løsninger

### 1. Sjekk at sitemap er tilgjengelig
Test at sitemap er tilgjengelig direkte:
```bash
curl https://sebastiansaethre.no/sitemap.xml
```

### 2. Verifiser i Google Search Console
1. Gå til Google Search Console: https://search.google.com/search-console
2. Velg `sebastiansaethre.no` property
3. Gå til "Sitemaps" i venstre meny
4. Klikk "Add a new sitemap"
5. Skriv inn: `sitemap.xml`
6. Klikk "SUBMIT"

### 3. Vent på indeksering
- Google kan ta 1-7 dager før sitemap blir prosessert
- Sjekk status i Search Console etter noen timer/dager

### 4. Sjekk for feil
Hvis det fortsatt ikke fungerer:
- Sjekk at sitemap.xml er i `public/` eller `dist/` mappen
- Sjekk at sitemap er korrekt formatert (XML)
- Sjekk at alle URLs i sitemap er tilgjengelige (ikke 404)

### 5. Manuell indeksering
Hvis sitemap fortsatt ikke fungerer:
1. Gå til "URL Inspection" i Search Console
2. Test hver URL manuelt
3. Klikk "Request Indexing" for viktige sider

## Notater
- Sitemap genereres automatisk ved build (`npm run build`)
- Sitemap ligger i `dist/sitemap.xml` etter build
- Netlify serverer automatisk filer fra `dist/` mappen

