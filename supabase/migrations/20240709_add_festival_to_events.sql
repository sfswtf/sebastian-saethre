ALTER TABLE events ADD COLUMN IF NOT EXISTS festival TEXT;
-- You can later update this to NOT NULL or use an ENUM if you want stricter control. 