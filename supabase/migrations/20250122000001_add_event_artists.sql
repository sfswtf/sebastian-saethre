-- NOTE: This migration is for FUTURE USE when setting up Supabase for production.
-- Currently, the application uses localStorage for all data storage.
-- This migration should be run when ready to migrate to Supabase.

-- Add tour/event specific fields to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS venue_name TEXT,
ADD COLUMN IF NOT EXISTS venue_address TEXT,
ADD COLUMN IF NOT EXISTS venue_city TEXT,
ADD COLUMN IF NOT EXISTS venue_country TEXT DEFAULT 'Norway',
ADD COLUMN IF NOT EXISTS tour_name TEXT,
ADD COLUMN IF NOT EXISTS event_type TEXT CHECK (event_type IN ('tour', 'festival', 'concert', 'other')) DEFAULT 'concert',
ADD COLUMN IF NOT EXISTS capacity INTEGER,
ADD COLUMN IF NOT EXISTS doors_open TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS support_acts TEXT[],
ADD COLUMN IF NOT EXISTS promoter TEXT,
ADD COLUMN IF NOT EXISTS production_notes TEXT;

-- Create junction table for events and artists (many-to-many)
CREATE TABLE IF NOT EXISTS event_artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  is_headliner BOOLEAN DEFAULT false,
  performance_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(event_id, artist_id)
);

-- Enable RLS for event_artists
ALTER TABLE event_artists ENABLE ROW LEVEL SECURITY;

-- Create policies for event_artists
CREATE POLICY "Anyone can view event artists for published events"
ON event_artists
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_artists.event_id
    AND events.status = 'published'
  )
);

CREATE POLICY "Admins can manage event artists"
ON event_artists
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_event_artists_event_id ON event_artists(event_id);
CREATE INDEX IF NOT EXISTS idx_event_artists_artist_id ON event_artists(artist_id);

