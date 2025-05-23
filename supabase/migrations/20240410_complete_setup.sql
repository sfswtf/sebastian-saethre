-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT false,
  PRIMARY KEY (id)
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

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
CREATE TABLE events (
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
CREATE TABLE membership_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  age_group TEXT NOT NULL,
  music_genres TEXT[] NOT NULL,
  motivation TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  location TEXT NOT NULL,
  member_type TEXT CHECK (member_type IN ('local', 'casual')) DEFAULT 'casual'
);

-- Enable RLS for membership_applications
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

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

-- Create contact_messages table
CREATE TABLE contact_messages (
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
CREATE TABLE about_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  content JSONB NOT NULL,
  version INTEGER NOT NULL
);

-- Enable RLS for about_page
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;

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
CREATE TABLE social_media_posts (
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

-- Add new fields to membership_applications
ALTER TABLE membership_applications
ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT '';

ALTER TABLE membership_applications
ADD COLUMN IF NOT EXISTS member_type TEXT CHECK (member_type IN ('local', 'casual')) DEFAULT 'casual'; 