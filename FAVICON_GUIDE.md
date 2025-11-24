# Favicon Setup Guide

## Problem
Google søk viser ikke favicon fordi flere formater og størrelser trengs.

## Løsning

### Metode 1: Bruk ImageMagick (Anbefalt)

1. **Installer ImageMagick** (hvis ikke allerede installert):
   ```bash
   # macOS
   brew install imagemagick
   
   # Linux
   sudo apt-get install imagemagick
   
   # Windows
   # Last ned fra https://imagemagick.org/script/download.php
   ```

2. **Kjør scriptet**:
   ```bash
   node generate-favicons.js
   ```

3. **Sjekk at filene er generert**:
   - `public/favicon-16x16.png`
   - `public/favicon-32x32.png`
   - `public/apple-touch-icon.png`

### Metode 2: Online Tools (Alternativ)

Hvis du ikke vil installere ImageMagick, kan du bruke online verktøy:

1. Gå til https://realfavicongenerator.net/
2. Last opp `public/favicon.png`
3. Last ned genererte filer
4. Plasser dem i `public/` mappen

### Metode 3: Manuell redigering

1. Åpne `public/favicon.png` i et bildebehandlingsprogram (Photoshop, GIMP, etc.)
2. Eksporter til følgende størrelser:
   - 16x16 px → `favicon-16x16.png`
   - 32x32 px → `favicon-32x32.png`
   - 180x180 px → `apple-touch-icon.png`

## Verifisering

Etter at filene er generert:

1. Bygg prosjektet: `npm run build`
2. Sjekk at filene er i `dist/` mappen
3. Test i nettleseren: Åpne `dist/index.html` og sjekk at favicon vises
4. Deploy til Netlify

## Notater

- `site.webmanifest` er allerede opprettet og konfigurert
- `index.html` er allerede oppdatert med alle nødvendige lenker
- Google kan ta noen dager før favicon vises i søkeresultater

