-- Create Demo Users for Supabase Direct Connection
-- Run this in your Supabase SQL Editor

-- First, create the demo users in Supabase Auth
-- (You'll need to do this manually in Supabase Dashboard > Authentication > Users)

-- Then create their profiles in the users table
INSERT INTO users (
  id,
  name,
  email,
  role,
  village,
  district,
  state,
  languages,
  is_verified,
  verification_status,
  bank_details,
  organization_details,
  created_at,
  updated_at
) VALUES 
(
  -- Replace with actual UUIDs from Supabase Auth
  '550e8400-e29b-41d4-a716-446655440001',
  'Rajesh Kumar',
  'farmer@demo.com',
  'farmer',
  'Krishnapur',
  'Krishna',
  'Andhra Pradesh',
  ARRAY['en', 'te'],
  true,
  'verified',
  '{"account_number": "1234567890", "ifsc_code": "SBIN0001234", "bank_name": "State Bank of India", "branch": "Krishnapur Branch"}',
  null,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Green Foods Ltd',
  'buyer@demo.com',
  'buyer',
  'Mumbai',
  'Mumbai',
  'Maharashtra',
  ARRAY['en', 'hi'],
  true,
  'verified',
  null,
  '{"company_name": "Green Foods Ltd", "gst_number": "27AABCU9603R1ZX", "business_type": "Food Processing", "established_year": 2015}',
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Admin User',
  'admin@demo.com',
  'admin',
  'Bangalore',
  'Bangalore Urban',
  'Karnataka',
  ARRAY['en'],
  true,
  'verified',
  null,
  null,
  NOW(),
  NOW()
);

-- Verify the users were created
SELECT id, name, email, role, is_verified FROM users WHERE email IN (
  'farmer@demo.com',
  'buyer@demo.com', 
  'admin@demo.com'
);
