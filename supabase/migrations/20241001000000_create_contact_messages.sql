-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserting contact messages
CREATE POLICY "Allow inserting contact messages" ON contact_messages
FOR INSERT WITH CHECK (true);

-- Create policy to allow reading contact messages for authenticated users
CREATE POLICY "Allow reading contact messages for authenticated users" ON contact_messages
FOR SELECT USING (auth.role() = 'authenticated');
