-- Fix Row Level Security policies for admin access
-- This fixes the issue where admins can't see farmer posts

-- First, let's drop the existing problematic policies
DROP POLICY IF EXISTS "Admins can view all crop posts" ON crop_posts;
DROP POLICY IF EXISTS "Admins can update any crop post status" ON crop_posts;

-- Create new policies that work with user metadata instead of user_profiles
CREATE POLICY "Admins can view all crop posts" ON crop_posts
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'admin' OR
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

CREATE POLICY "Admins can update any crop post status" ON crop_posts
    FOR UPDATE USING (
        auth.jwt() ->> 'role' = 'admin' OR
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- Also fix the orders policy for buyers
DROP POLICY IF EXISTS "Buyers can create orders" ON orders;

CREATE POLICY "Buyers can create orders" ON orders
    FOR INSERT WITH CHECK (
        auth.uid() = buyer_id AND (
            auth.jwt() ->> 'role' = 'buyer' OR
            (auth.jwt() -> 'user_metadata' ->> 'role') = 'buyer'
        )
    );

-- Let's also add a policy to allow admins to view pending posts specifically
CREATE POLICY "Admins can view pending crop posts" ON crop_posts
    FOR SELECT USING (
        status = 'pending' AND (
            auth.jwt() ->> 'role' = 'admin' OR
            (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
        )
    );

-- Grant necessary permissions
GRANT ALL ON crop_posts TO authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON messages TO authenticated;
GRANT ALL ON notifications TO authenticated;
