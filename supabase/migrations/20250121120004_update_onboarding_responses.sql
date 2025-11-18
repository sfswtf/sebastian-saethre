-- Update onboarding_responses table to support new fields
ALTER TABLE onboarding_responses 
ADD COLUMN IF NOT EXISTS current_usage_options TEXT[],
ADD COLUMN IF NOT EXISTS pain_points_options TEXT[],
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT;

-- Update existing records to migrate data if needed
-- (current_usage and pain_points can contain comma-separated values from checkboxes)
-- We'll handle this in the application layer

