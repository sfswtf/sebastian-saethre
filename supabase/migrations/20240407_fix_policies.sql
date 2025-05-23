-- First, drop existing policies
DROP POLICY IF EXISTS "Anyone can submit an application" ON membership_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON membership_applications;
DROP POLICY IF EXISTS "Admins can manage applications" ON membership_applications;

-- Then recreate the policies
CREATE POLICY "Anyone can submit an application"
    ON membership_applications
    FOR INSERT
    WITH CHECK (true);

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

-- Add policy for admins to manage applications
CREATE POLICY "Admins can manage applications"
    ON membership_applications
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND is_admin = true
        )
    ); 