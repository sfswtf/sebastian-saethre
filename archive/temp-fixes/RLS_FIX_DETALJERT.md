# Detaljert RLS Fix - Hvis det ikke fungerer etter 5 forsøk

## Problem
RLS policy-koden fungerer ikke selv etter flere forsøk. Dette kan skyldes:
1. Policy eksisterer allerede med feil konfigurasjon
2. RLS er ikke aktivert
3. Tabellen eksisterer ikke
4. Feil schema (public vs auth)

## Komplett løsning - Steg for steg

### Steg 1: Sjekk at tabellen eksisterer
Kjør denne i Supabase SQL Editor:

```sql
-- Sjekk om tabellen eksisterer
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'onboarding_responses';
```

**Forventet resultat:** En rad med `onboarding_responses` og `public`

**Hvis tabellen ikke eksisterer:**
Kjør denne først:

```sql
-- Opprett tabellen hvis den ikke eksisterer
CREATE TABLE IF NOT EXISTS public.onboarding_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('personal', 'professional')),
  goals TEXT[],
  current_usage TEXT,
  pain_points TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  consent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Steg 2: Sjekk RLS status
```sql
-- Sjekk om RLS er aktivert
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND table_name = 'onboarding_responses';
```

**Forventet resultat:** `rowsecurity = true`

**Hvis RLS ikke er aktivert:**
```sql
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;
```

### Steg 3: Se alle eksisterende policies
```sql
-- Se alle policies på tabellen
SELECT 
  policyname, 
  cmd, 
  roles, 
  qual, 
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename = 'onboarding_responses';
```

**Skriv ned alle policy-navnene du ser!**

### Steg 4: Drop ALLE eksisterende policies
Kjør denne for hver policy du fant i Steg 3:

```sql
-- Drop alle mulige policy-navn
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON public.onboarding_responses;
DROP POLICY IF EXISTS "Only admins can view onboarding responses" ON public.onboarding_responses;
DROP POLICY IF EXISTS "onboarding_responses_insert_policy" ON public.onboarding_responses;
DROP POLICY IF EXISTS "onboarding_responses_select_policy" ON public.onboarding_responses;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.onboarding_responses;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.onboarding_responses;
DROP POLICY IF EXISTS "onboarding_responses_anon_insert" ON public.onboarding_responses;
DROP POLICY IF EXISTS "onboarding_responses_public_insert" ON public.onboarding_responses;

-- Hvis du fant andre policy-navn i Steg 3, legg dem til her:
-- DROP POLICY IF EXISTS "DITT_POLICY_NAVN" ON public.onboarding_responses;
```

### Steg 5: Opprett ny INSERT policy (RIKTIG SYNTAX)
```sql
-- Opprett INSERT policy som tillater både authenticated og anon
CREATE POLICY "onboarding_responses_anon_insert"
  ON public.onboarding_responses
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);
```

**VIKTIG:** 
- `TO authenticated, anon` - MÅ ha begge!
- `WITH CHECK (true)` - MÅ være `true`, ikke `(true)` eller noe annet

### Steg 6: Opprett SELECT policy (for admins)
```sql
-- Opprett SELECT policy for admins
CREATE POLICY "onboarding_responses_admin_select"
  ON public.onboarding_responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
```

### Steg 7: Verifiser policies
```sql
-- Sjekk at policies er opprettet
SELECT 
  policyname, 
  cmd, 
  roles, 
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename = 'onboarding_responses';
```

**Forventet resultat:** 
- 2 policies (en INSERT, en SELECT)
- INSERT policy skal ha `roles = '{authenticated,anon}'`
- INSERT policy skal ha `with_check = 'true'`

### Steg 8: Test INSERT som anonym bruker
```sql
-- Test INSERT (skal fungere nå!)
INSERT INTO public.onboarding_responses (
  type, 
  goals, 
  current_usage, 
  pain_points, 
  name, 
  email, 
  consent
)
VALUES (
  'personal',
  ARRAY['Test'],
  'Testing RLS policy',
  'Test pain',
  'Test User',
  'test@example.com',
  true
);
```

**Hvis dette fungerer:** RLS-policyen er riktig! ✅

**Hvis dette feiler:** Se feilmeldingen nøye og send den til meg.

### Steg 9: Test fra nettleseren
1. Gå til `http://localhost:5173/onboarding`
2. Fyll ut skjemaet
3. Åpne DevTools (F12) → Console
4. Du skal IKKE se 401-feil
5. Sjekk Supabase Table Editor → `onboarding_responses` - data skal være der!

---

## Hvis det fortsatt ikke fungerer

### Sjekkliste:
- [ ] Tabellen eksisterer i `public` schema?
- [ ] RLS er aktivert (`rowsecurity = true`)?
- [ ] Alle gamle policies er droppet?
- [ ] INSERT policy har `TO authenticated, anon`?
- [ ] INSERT policy har `WITH CHECK (true)`?
- [ ] Test INSERT i SQL Editor fungerer?

### Send meg:
1. Resultatet fra Steg 1 (eksisterer tabellen?)
2. Resultatet fra Steg 2 (RLS aktivert?)
3. Resultatet fra Steg 3 (hvilke policies finnes?)
4. Feilmeldingen fra Steg 8 (hvis INSERT feiler)

---

## Alternativ: Deaktiver RLS midlertidig (KUN FOR TESTING!)

**⚠️ ADVARSEL: Dette er IKKE trygt for produksjon!**

Hvis du bare vil teste at alt fungerer:

```sql
-- Midlertidig deaktiver RLS (KUN FOR TESTING!)
ALTER TABLE public.onboarding_responses DISABLE ROW LEVEL SECURITY;
```

**Husk å aktivere RLS igjen etterpå:**
```sql
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;
```

