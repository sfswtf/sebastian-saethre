# Website Template

En gjenbrukbar mal for nettside-applikasjoner med full admin-funksjonalitet.

## Oversikt

Dette er en komplett React-basert nettside-mal som kan tilpasses for nye klienter/kunder. Malen inneholder:

- ✅ Full admin-funksjonalitet (blog, kurs, ressurser, portfolio, events, kontaktmeldinger, onboarding)
- ✅ Flerspråklig støtte (norsk/engelsk)
- ✅ Supabase-integrasjon for backend
- ✅ Responsiv design med moderne UI
- ✅ SEO-optimalisert med meta tags og structured data
- ✅ Konfigurerbar via environment variables og siteConfig

## Funksjonalitet

### Admin Dashboard
- Blog Manager - Administrer blogginnlegg
- Course Manager - Administrer kurs
- Resource Manager - Administrer ressurser og verktøy
- Portfolio Manager - Administrer portefølje-prosjekter
- Event Manager - Administrer arrangementer
- Contact Messages - Se og håndter kontaktmeldinger
- Onboarding Responses - Se og håndter onboarding-svar
- Social Media Manager - Administrer sosiale medier
- Page Content Manager - Administrer sideinnhold

### Publike Sider
- Hjemmeside med hero-seksjon
- Portfolio
- Blog/Nyheter
- Kurs
- Ressurser
- Community
- Kontakt
- Onboarding-formular

## Komme i Gang

### Rask Start

1. **Klon repository:**
   ```bash
   git clone <repository-url>
   cd website-template
   ```

2. **Installer avhengigheter:**
   ```bash
   npm install
   ```

3. **Sett opp environment variables:**
   ```bash
   cp .env.example .env
   # Rediger .env og fyll inn verdiene
   ```

4. **Start utviklingsserver:**
   ```bash
   npm run dev
   ```

### Detaljert Setup

Se [TEMPLATE_SETUP.md](./TEMPLATE_SETUP.md) for detaljerte instruksjoner om hvordan du setter opp malen for en ny klient.

## Konfigurasjon

All konfigurasjon gjøres via:

1. **Environment Variables** (`.env` fil)
   - Site navn, URL, email
   - Supabase credentials
   - Admin credentials

2. **siteConfig** (`src/config/siteConfig.ts`)
   - Logo paths
   - Social media links
   - CTA button texts

3. **languageStore** (`src/stores/languageStore.ts`)
   - Alle tekster og oversettelser

## Teknologier

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Backend/Database
- **React Router** - Routing
- **Zustand** - State management
- **Framer Motion** - Animations

## Scripts

```bash
npm run dev      # Start utviklingsserver
npm run build    # Bygg for produksjon
npm run preview  # Preview produksjonsbygget
npm run lint     # Kjør ESLint
```

## Struktur

```
├── src/
│   ├── components/      # React komponenter
│   │   ├── admin/      # Admin komponenter
│   │   └── animations/ # Animasjonskomponenter
│   ├── config/         # Konfigurasjonsfiler
│   ├── lib/            # Utility funksjoner
│   ├── stores/         # Zustand stores
│   └── types/          # TypeScript typer
├── public/             # Statiske filer
├── supabase/
│   └── migrations/     # Database migrasjoner
└── dist/               # Byggete filer
```

## Dokumentasjon

- [TEMPLATE_SETUP.md](./TEMPLATE_SETUP.md) - Detaljert setup-guide for nye klienter

## Lisens

[Legg til din lisens her]

## Support

For spørsmål eller problemer, kontakt utvikleren.

