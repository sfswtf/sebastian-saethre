-- Create membership_applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS membership_applications (
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

-- Enable RLS
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert
CREATE POLICY "Anyone can submit an application"
    ON membership_applications
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow admins to view all applications
CREATE POLICY "Admins can view all applications"
    ON membership_applications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    ); 