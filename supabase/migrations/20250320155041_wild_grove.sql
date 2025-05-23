/*
  # Initial Schema for Hovden Musikklubb

  1. New Tables
    - users (handled by Supabase Auth)
    - profiles
      - Extended user information
      - Bong balance tracking
      - Membership status
    - events
      - Event details and management
      - Ticket information
    - tickets
      - Tracks ticket purchases and usage
    - media
      - Community uploaded content
      - Moderation status tracking
    - newsletters
      - Newsletter subscription management
    
  2. Security
    - RLS policies for each table
    - Admin role management
    - Public/private access controls

  3. Functions
    - Bong management procedures
    - Ticket validation
*/

-- Create custom types
CREATE TYPE media_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE ticket_status AS ENUM ('valid', 'used', 'expired', 'refunded');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  bong_balance INTEGER DEFAULT 0,
  is_member BOOLEAN DEFAULT false,
  membership_expiry TIMESTAMPTZ,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  ticket_price INTEGER,
  ticket_quantity INTEGER,
  tickets_sold INTEGER DEFAULT 0,
  image_url TEXT,
  created_by uuid REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  status ticket_status DEFAULT 'valid',
  purchase_date TIMESTAMPTZ DEFAULT now(),
  used_date TIMESTAMPTZ,
  qr_code TEXT UNIQUE
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  title TEXT,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL,
  status media_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  moderated_at TIMESTAMPTZ,
  moderated_by uuid REFERENCES profiles(id)
);

-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  is_subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Tickets policies
CREATE POLICY "Users can view own tickets"
  ON tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets"
  ON tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Media policies
CREATE POLICY "Approved media is viewable by everyone"
  ON media FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Users can view own media"
  ON media FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload media"
  ON media FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage media"
  ON media FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Newsletter policies
CREATE POLICY "Admins can view all subscriptions"
  ON newsletter_subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION process_bong_purchase(
  user_id uuid,
  amount integer
) RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET bong_balance = bong_balance + amount,
      updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION use_bong(
  user_id uuid,
  amount integer
) RETURNS boolean AS $$
DECLARE
  current_balance integer;
BEGIN
  SELECT bong_balance INTO current_balance
  FROM profiles
  WHERE id = user_id;
  
  IF current_balance >= amount THEN
    UPDATE profiles
    SET bong_balance = bong_balance - amount,
        updated_at = now()
    WHERE id = user_id;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;