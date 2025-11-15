# Supabase Setup Guide - Fra Start til Ferdig

## ⚠️ VIKTIG: Kjør migrasjonene i nøyaktig denne rekkefølgen!

---

## STEG 1: Åpne SQL Editor

1. Gå til: https://supabase.com/dashboard
2. Logg inn
3. Klikk på prosjektet: **sebastiansaethre**
4. I venstre meny: Klikk på **SQL Editor** (ikonet med `</>`)
5. Klikk på **"New query"** (eller bruk den eksisterende)

---

## STEG 2: Sjekk hva som allerede finnes

Kopier og lim inn dette i SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Klikk **Run** (eller trykk `Ctrl+Enter` / `Cmd+Enter`).

**Hva du skal se:** En liste med tabeller. Noter hvilke som allerede finnes.

---

## STEG 3: Migrasjon 1 - Core Setup (MÅ KØRES FØRST!)

**Kopier HELE denne SQL-en og lim inn i SQL Editor:**

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT false,
  email TEXT,
  PRIMARY KEY (id)
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create policy for profiles
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON profiles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  image_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'cancelled')),
  ticket_price INTEGER,
  tickets_url TEXT
);

-- Enable RLS for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view published events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;

-- Create policies for events
CREATE POLICY "Anyone can view published events"
ON events
FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can manage events"
ON events
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create membership_applications table
CREATE TABLE IF NOT EXISTS membership_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  age_group TEXT NOT NULL,
  music_genres TEXT[] NOT NULL,
  motivation TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  location TEXT NOT NULL DEFAULT '',
  member_type TEXT CHECK (member_type IN ('local', 'casual')) DEFAULT 'casual'
);

-- Enable RLS for membership_applications
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Admins can view membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Admins can update membership applications" ON membership_applications;

-- Create policies for membership_applications
CREATE POLICY "Users can create membership applications"
ON membership_applications
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Admins can view membership applications"
ON membership_applications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can update membership applications"
ON membership_applications
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create contact_messages table (if not exists)
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('unread', 'read', 'replied')) DEFAULT 'unread',
  admin_notes TEXT
);

-- Enable RLS for contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can view contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON contact_messages;

-- Create policies for contact_messages
CREATE POLICY "Anyone can submit contact messages"
ON contact_messages
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
ON contact_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can update contact messages"
ON contact_messages
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create about_page table
CREATE TABLE IF NOT EXISTS about_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  content JSONB NOT NULL,
  version INTEGER NOT NULL
);

-- Enable RLS for about_page
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view about page content" ON about_page;
DROP POLICY IF EXISTS "Admins can manage about page content" ON about_page;

-- Create policies for about_page
CREATE POLICY "Anyone can view about page content"
ON about_page
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Admins can manage about page content"
ON about_page
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create social_media_posts table
CREATE TABLE IF NOT EXISTS social_media_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'youtube', 'tiktok', 'image')),
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  display_order INTEGER
);

-- Enable RLS for social_media_posts
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active social media posts" ON social_media_posts;
DROP POLICY IF EXISTS "Admins can manage social media posts" ON social_media_posts;

-- Create policies for social_media_posts
CREATE POLICY "Anyone can view active social media posts"
ON social_media_posts
FOR SELECT
USING (active = true);

CREATE POLICY "Admins can manage social media posts"
ON social_media_posts
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
```

**Klikk Run** (eller `Ctrl+Enter`).

**Hva du skal se:** "Success. No rows returned" eller lignende. Ingen feilmeldinger.

**Verifiser:** Gå til **Table Editor** i venstre meny. Du skal nå se `profiles`-tabellen.

---

## STEG 4: Migrasjon 2 - Admin Setup

**Kopier HELE denne SQL-en:**

```sql
-- Create a function to handle setting initial admin status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (NEW.id, NEW.email, false)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update profiles table to ensure email field exists
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create allowed_admins table to manage who can be an admin
CREATE TABLE IF NOT EXISTS public.allowed_admins (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up RLS for allowed_admins
ALTER TABLE public.allowed_admins ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admins can manage allowed_admins" ON public.allowed_admins;

-- Only admins can manage the allowed_admins table
CREATE POLICY "Admins can manage allowed_admins"
ON public.allowed_admins
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Function to automatically set admin status if email is in allowed_admins
CREATE OR REPLACE FUNCTION public.check_and_set_admin_status()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.allowed_admins WHERE email = NEW.email) THEN
    NEW.is_admin := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to check and set admin status on profile updates
DROP TRIGGER IF EXISTS check_admin_status ON public.profiles;
CREATE TRIGGER check_admin_status
  BEFORE INSERT OR UPDATE OF email ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.check_and_set_admin_status();

-- Insert initial admin email
INSERT INTO public.allowed_admins (email)
VALUES ('sebastian.saethre@gmail.com')
ON CONFLICT (email) DO NOTHING;
```

**Klikk Run**.

**Hva du skal se:** "Success. No rows returned"

---

## STEG 5: Migrasjon 3 - Sett deg som admin

**Kopier denne SQL-en (erstatt e-posten hvis den er annerledes):**

```sql
-- First, ensure the user's profile exists
INSERT INTO profiles (id, is_admin, email)
SELECT id, true, email
FROM auth.users
WHERE email = 'sebastian.saethre@gmail.com'
ON CONFLICT (id) DO UPDATE
SET is_admin = true, email = EXCLUDED.email;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
```

**Klikk Run**.

**Hva du skal se:** "Success" med antall rader oppdatert.

**Verifiser:** Gå til **Table Editor** → `profiles`. Du skal se din bruker med `is_admin = true`.

---

## STEG 6: Migrasjon 4 - Onboarding Responses

**Kopier HELE denne SQL-en:**

```sql
-- Create onboarding_responses table
CREATE TABLE IF NOT EXISTS onboarding_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Enable RLS
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit an onboarding response" ON onboarding_responses;
DROP POLICY IF EXISTS "Only admins can view onboarding responses" ON onboarding_responses;

-- Create policies
CREATE POLICY "Anyone can submit an onboarding response"
  ON onboarding_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view onboarding responses"
  ON onboarding_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );
```

**Klikk Run**.

**Hva du skal se:** "Success. No rows returned"

---

## STEG 7: Migrasjon 5 - Content Tables (VIKTIG!)

**Kopier HELE denne SQL-en (denne er lang, men viktig):**

```sql
-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  author_id UUID REFERENCES auth.users(id),
  affiliate_links JSONB DEFAULT '[]'::jsonb
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'NOK',
  course_image TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  duration TEXT,
  level TEXT,
  lessons INTEGER,
  author_id UUID REFERENCES auth.users(id)
);

-- Create portfolio_projects table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  category TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  author_id UUID REFERENCES auth.users(id)
);

-- Create tools_resources table
CREATE TABLE IF NOT EXISTS tools_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  affiliate_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 5) DEFAULT 0,
  worth_it BOOLEAN DEFAULT false,
  author_id UUID REFERENCES auth.users(id)
);

-- Enable RLS for all tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools_resources ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (Blog Posts)
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;

-- Blog Posts Policies
CREATE POLICY "Anyone can view published blog posts"
ON blog_posts FOR SELECT
TO authenticated, anon
USING (status = 'published');

CREATE POLICY "Admins can manage blog posts"
ON blog_posts FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Drop existing policies if they exist (Courses)
DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;

-- Courses Policies
CREATE POLICY "Anyone can view published courses"
ON courses FOR SELECT
TO authenticated, anon
USING (status = 'published');

CREATE POLICY "Admins can manage courses"
ON courses FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Drop existing policies if they exist (Portfolio)
DROP POLICY IF EXISTS "Anyone can view portfolio projects" ON portfolio_projects;
DROP POLICY IF EXISTS "Admins can manage portfolio projects" ON portfolio_projects;

-- Portfolio Projects Policies
CREATE POLICY "Anyone can view portfolio projects"
ON portfolio_projects FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Admins can manage portfolio projects"
ON portfolio_projects FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Drop existing policies if they exist (Resources)
DROP POLICY IF EXISTS "Anyone can view tools resources" ON tools_resources;
DROP POLICY IF EXISTS "Admins can manage tools resources" ON tools_resources;

-- Tools Resources Policies
CREATE POLICY "Anyone can view tools resources"
ON tools_resources FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Admins can manage tools resources"
ON tools_resources FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_featured ON portfolio_projects(featured);
CREATE INDEX IF NOT EXISTS idx_tools_resources_category ON tools_resources(category);
CREATE INDEX IF NOT EXISTS idx_tools_resources_rating ON tools_resources(rating);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
DROP TRIGGER IF EXISTS update_portfolio_projects_updated_at ON portfolio_projects;
DROP TRIGGER IF EXISTS update_tools_resources_updated_at ON tools_resources;

-- Create triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_resources_updated_at
  BEFORE UPDATE ON tools_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Klikk Run**.

**Hva du skal se:** "Success. No rows returned"

---

## STEG 8: Verifiser at alt er opprettet

1. Gå til **Table Editor** i venstre meny
2. Du skal nå se disse tabellene:
   - ✅ `profiles`
   - ✅ `blog_posts`
   - ✅ `courses`
   - ✅ `portfolio_projects`
   - ✅ `tools_resources`
   - ✅ `onboarding_responses`
   - ✅ `contact_messages`
   - ✅ `events`
   - ✅ `social_media_posts`
   - ✅ `membership_applications`
   - ✅ `about_page`
   - ✅ `allowed_admins`

**Hvis noen tabeller mangler:** Gå tilbake til SQL Editor og kjør migrasjonen for den tabellen igjen.

---

## STEG 9: Verifiser admin-tilgang

1. Gå til **Table Editor** → `profiles`
2. Klikk på **Data**-fanen
3. Du skal se din bruker med `is_admin = true`

**Hvis ikke:**
1. Gå til **Authentication** → **Users**
2. Finn din bruker (eller opprett en hvis den ikke finnes)
3. Kopier brukerens UUID
4. Gå tilbake til **SQL Editor** og kjør:

```sql
INSERT INTO profiles (id, is_admin, email)
VALUES ('DIN_UUID_HER', true, 'sebastian.saethre@gmail.com')
ON CONFLICT (id) DO UPDATE 
SET is_admin = true, email = EXCLUDED.email;
```

---

## STEG 10: Test integrasjonen

1. Åpne terminal i prosjektmappen
2. Kjør: `npm run dev`
3. Gå til: `http://localhost:5173/login`
4. Logg inn med din e-post
5. Gå til: `http://localhost:5173/admin`
6. Du skal nå se admin dashboard!

---

## Feilsøking

### Feil: "relation does not exist"
**Løsning:** Du har kjørt migrasjonene i feil rekkefølge. Start fra STEG 3 igjen.

### Feil: "policy already exists"
**Løsning:** Ignorer feilen, policies er allerede opprettet. Fortsett til neste steg.

### Feil: "column already exists"
**Løsning:** Ignorer feilen, kolonnen finnes allerede. Fortsett til neste steg.

### Admin-tilgang fungerer ikke
**Løsning:** 
1. Sjekk at `profiles`-tabellen har din bruker med `is_admin = true`
2. Logg ut og inn igjen
3. Sjekk at e-posten i `allowed_admins` matcher din e-post

---

## Ferdig! 🎉

Nå skal alt være klart. Du kan nå:
- Opprette blog posts i admin
- Opprette courses, portfolio projects, og resources
- Alt vil vises på frontend-sidene
- Onboarding-formen vil lagre data i databasen

