-- Create artists table
CREATE TABLE IF NOT EXISTS artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  spotify_url TEXT,
  spotify_embed_url TEXT, -- For embedding Spotify player
  website_url TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  youtube_url TEXT,
  other_links JSONB DEFAULT '[]'::jsonb, -- Array of {label, url} objects
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'published',
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

-- Enable RLS for artists
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

-- Create policies for artists
CREATE POLICY "Anyone can view published artists"
ON artists
FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can manage artists"
ON artists
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create merch table
CREATE TABLE IF NOT EXISTS merch (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NOK',
  image_urls TEXT[] DEFAULT '{}',
  category TEXT,
  sizes TEXT[], -- e.g., ['S', 'M', 'L', 'XL']
  colors TEXT[], -- e.g., ['Black', 'White', 'Red']
  stock_quantity INTEGER,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'out_of_stock')) DEFAULT 'published',
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

-- Enable RLS for merch
ALTER TABLE merch ENABLE ROW LEVEL SECURITY;

-- Create policies for merch
CREATE POLICY "Anyone can view published merch"
ON merch
FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can manage merch"
ON merch
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT NOT NULL,
  customer_postal_code TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_country TEXT NOT NULL DEFAULT 'Norway',
  order_items JSONB NOT NULL, -- Array of {merch_id, name, price, quantity, size, color}
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NOK',
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  shipping_method TEXT,
  tracking_number TEXT,
  notes TEXT,
  admin_notes TEXT -- Internal notes for admin
);

-- Enable RLS for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Users can create orders"
ON orders
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Admins can view all orders"
ON orders
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can update orders"
ON orders
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artists_status ON artists(status);
CREATE INDEX IF NOT EXISTS idx_artists_featured ON artists(featured);
CREATE INDEX IF NOT EXISTS idx_artists_display_order ON artists(display_order);
CREATE INDEX IF NOT EXISTS idx_merch_status ON merch(status);
CREATE INDEX IF NOT EXISTS idx_merch_featured ON merch(featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

