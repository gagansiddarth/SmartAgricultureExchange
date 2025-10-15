-- TEMPORARY: Disable RLS for testing admin access
-- This will allow admins to see all posts during development

-- Disable RLS on crop_posts table temporarily
ALTER TABLE crop_posts DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on crop_posts
DROP POLICY IF EXISTS "Users can view approved crop posts" ON crop_posts;
DROP POLICY IF EXISTS "Farmers can view their own crop posts" ON crop_posts;
DROP POLICY IF EXISTS "Admins can view all crop posts" ON crop_posts;
DROP POLICY IF EXISTS "Farmers can insert their own crop posts" ON crop_posts;
DROP POLICY IF EXISTS "Farmers can update their own pending crop posts" ON crop_posts;
DROP POLICY IF EXISTS "Admins can update any crop post status" ON crop_posts;
DROP POLICY IF EXISTS "Admins can view pending crop posts" ON crop_posts;

-- Grant full access to authenticated users
GRANT ALL ON crop_posts TO authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON messages TO authenticated;
GRANT ALL ON notifications TO authenticated;

-- Note: This is for development/testing only
-- In production, you should re-enable RLS with proper policies
