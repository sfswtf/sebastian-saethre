-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url TEXT,
    ticket_price DECIMAL(10,2),
    capacity INTEGER,
    location TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
    tickets_url TEXT
);

-- Create about_page table
CREATE TABLE about_page (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    content JSONB NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    version INTEGER NOT NULL DEFAULT 1
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Enable read access for all users" ON events
    FOR SELECT USING (status = 'published');

CREATE POLICY "Enable insert/update for authenticated users only" ON events
    FOR ALL USING (auth.role() = 'authenticated');

-- Policies for about_page
CREATE POLICY "Enable read access for all users" ON about_page
    FOR SELECT USING (true);

CREATE POLICY "Enable insert/update for authenticated users only" ON about_page
    FOR ALL USING (auth.role() = 'authenticated'); 