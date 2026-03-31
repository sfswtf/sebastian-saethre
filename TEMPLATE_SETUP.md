# Template Setup Guide

Denne guiden forklarer hvordan du setter opp denne malen for en ny klient/kunde.

## Oversikt

Denne kodebasen er en gjenbrukbar mal for nettside-applikasjoner. Den inneholder:
- Full admin-funksjonalitet (blog, kurs, ressurser, portfolio, events, kontaktmeldinger, onboarding)
- Flerspråklig støtte (norsk/engelsk)
- Supabase-integrasjon
- Responsiv design med moderne UI

## Steg 1: Klon og installer

```bash
# Klon repository
git clone <repository-url>
cd website-template

# Installer avhengigheter
npm install
```

## Steg 2: Konfigurer Environment Variables

1. Kopier `.env.example` til `.env`:
```bash
cp .env.example .env
```

2. Åpne `.env` og fyll inn verdiene:

### Påkrevde verdier:
```env
VITE_SITE_NAME=Klientens Navn
VITE_SITE_SHORT_NAME=Kort Navn
VITE_SITE_DESCRIPTION=Beskrivelse av nettsiden
VITE_SITE_URL=https://klientens-domene.no
VITE_CONTACT_EMAIL=kontakt@klientens-domene.no
VITE_ADMIN_EMAIL=admin@klientens-domene.no
VITE_LOGO_PRIMARY=/images/logo.jpg
VITE_LOGO_SECONDARY=/images/logo.png  # Valgfritt
```

### Supabase Configuration:
```env
VITE_SUPABASE_URL=din-supabase-url
VITE_SUPABASE_ANON_KEY=din-supabase-anon-key
```

### Payment Configuration (Valgfritt):
```env
# Kryptobetaling (Solana)
VITE_SOLANA_ADDRESS=din-solana-adresse
# Standard: 10% rabatt for kryptobetaling (kan endres i siteConfig.ts)

# PayPal
VITE_PAYPAL_CLIENT_ID=din-paypal-client-id
VITE_PAYPAL_EMAIL=din-paypal-email@example.com
```

**For PayPal-oppsett:**
1. Gå til [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Opprett en app og få din Client ID
3. For produksjon, bruk Live Client ID (ikke Sandbox)
4. Legg inn Client ID i `.env` som `VITE_PAYPAL_CLIENT_ID`
5. Legg inn din PayPal e-post som `VITE_PAYPAL_EMAIL`

**Merk:** PayPal-integrasjonen er forberedt, men krever ytterligere implementering av PayPal SDK for full funksjonalitet. For nå fungerer det som en indikator på at PayPal er valgt som betalingsmetode.

### Admin Authentication:
```env
VITE_ADMIN_PASSWORD=ditt-admin-passord
```

### Valgfrie verdier:
```env
# Social Media
VITE_SOCIAL_TWITTER=@username
VITE_SOCIAL_YOUTUBE=@channel
VITE_SOCIAL_LINKEDIN=company-name
VITE_SOCIAL_FACEBOOK=page-name
VITE_SOCIAL_INSTAGRAM=@username

# CTA Buttons (kan også settes i languageStore)
VITE_CTA_PRIMARY=Kom i gang
VITE_CTA_SECONDARY=Lær mer
```

## Steg 3: Legg til Logoer og Bilder

1. Legg logoer i `public/images/`:
   - `logo.jpg` - Hovedlogo (påkrevd)
   - `logo.png` - Sekundærlogo med tekst (valgfritt)

2. Legg til andre bilder som trengs:
   - `hero-background.jpg` - Hero-seksjon bakgrunn
   - `hero-intro.mp4` - Hero-seksjon video (valgfritt)

## Steg 4: Oppdater Meta Tags i index.html

Åpne `index.html` og oppdater:
- Meta description
- Meta keywords
- Open Graph tags
- Twitter Card tags
- JSON-LD structured data

**Merk:** Disse verdiene er for øyeblikket hardkodede placeholders. Du kan enten:
- Oppdatere dem manuelt i `index.html`
- Eller sette opp en build-script som erstatter dem automatisk fra `siteConfig`

## Steg 5: Oppdater public/robots.txt

Endre sitemap URL i `public/robots.txt`:
```
Sitemap: https://klientens-domene.no/sitemap.xml
```

## Steg 6: Oppdater public/site.webmanifest

Endre navn og beskrivelse i `public/site.webmanifest`:
```json
{
  "name": "Klientens Navn",
  "short_name": "Kort Navn",
  "description": "Beskrivelse av nettsiden"
}
```

## Steg 7: Konfigurer Supabase

1. Opprett et nytt Supabase-prosjekt
2. Kjør migrasjoner fra `supabase/migrations/` i riktig rekkefølge
3. Sett opp admin-bruker:
   ```sql
   INSERT INTO profiles (email, is_admin)
   VALUES ('admin@klientens-domene.no', true);
   ```
4. Konfigurer RLS (Row Level Security) policies etter behov

## Steg 8: Tilpass Tekster

Alle tekster kan tilpasses i `src/stores/languageStore.ts`:
- Navigasjon
- Side-titler og beskrivelser
- CTA-knapper
- Footer-tekster
- Onboarding-formularen
- osv.

Tekstene støtter både norsk og engelsk.

## Steg 9: Test Lokalt

```bash
npm run dev
```

Test at:
- Alle sider laster riktig
- Logoer vises korrekt
- Email-lenker fungerer
- Admin-login fungerer
- Supabase-koblingen fungerer

## Steg 10: Build og Deploy

```bash
npm run build
```

Byggete filer ligger i `dist/` mappen.

### Deploy til Netlify:
1. Push kode til GitHub
2. Koble Netlify til repository
3. Sett environment variables i Netlify dashboard
4. Deploy

### Deploy til Vercel:
1. Push kode til GitHub
2. Koble Vercel til repository
3. Sett environment variables i Vercel dashboard
4. Deploy

## Viktige Filer å Vite Om

- `src/config/siteConfig.ts` - Sentral konfigurasjonsfil
- `src/stores/languageStore.ts` - Alle tekster og oversettelser
- `src/components/admin/` - Admin-funksjonalitet
- `supabase/migrations/` - Database migrasjoner

## Customization Tips

1. **Farger:** Endre Tailwind-konfigurasjon i `tailwind.config.ts`
2. **Fonts:** Legg til custom fonts i `index.css`
3. **Komponenter:** Alle komponenter er modulære og kan enkelt tilpasses
4. **Routing:** Legg til nye ruter i `src/App.tsx`

## Troubleshooting

### Logoer vises ikke:
- Sjekk at logoer ligger i `public/images/`
- Sjekk at `VITE_LOGO_PRIMARY` er satt riktig i `.env`

### Admin login fungerer ikke:
- Sjekk at `VITE_ADMIN_EMAIL` og `VITE_ADMIN_PASSWORD` er satt i `.env`
- Sjekk at admin-bruker er opprettet i Supabase

### Supabase-kobling feiler:
- Sjekk at `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` er riktig
- Sjekk at RLS policies er konfigurert riktig

## Support

For spørsmål eller problemer, sjekk dokumentasjonen eller kontakt utvikleren.

