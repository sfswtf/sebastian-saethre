-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('subscribed', 'unsubscribed')) DEFAULT 'subscribed',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to subscribe (INSERT)
CREATE POLICY "Anyone can subscribe to newsletter"
ON newsletter_subscriptions
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Only admins can view subscriptions
CREATE POLICY "Admins can view newsletter subscriptions"
ON newsletter_subscriptions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Allow users to unsubscribe (UPDATE their own subscription)
CREATE POLICY "Users can update their own subscription"
ON newsletter_subscriptions
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_status ON newsletter_subscriptions(status);

