-- Add affiliate_links column to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS affiliate_links JSONB DEFAULT '[]'::jsonb;

