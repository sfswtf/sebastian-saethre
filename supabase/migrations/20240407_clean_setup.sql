-- 1. First, drop everything to start fresh
DROP TABLE IF EXISTS membership_applications;

-- 2. Create the table with all necessary columns
CREATE TABLE membership_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    age_group TEXT NOT NULL,
    music_genres TEXT[] NOT NULL DEFAULT '{}',
    motivation TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- 4. Create the "anyone can submit" policy
CREATE POLICY "Anyone can submit an application"
    ON membership_applications
    FOR INSERT
    WITH CHECK (true);

-- 5. Create the "admins can view" policy
CREATE POLICY "Admins can view all applications"
    ON membership_applications
    FOR SELECT
    USING (true);  -- Temporarily allowing everyone to view for testing

-- 6. Grant necessary permissions
GRANT ALL ON membership_applications TO authenticated;
GRANT ALL ON membership_applications TO anon; 