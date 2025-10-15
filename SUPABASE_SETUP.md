# Supabase Setup Guide for Smart Agriculture Exchange

This guide will help you set up Supabase for the Smart Agriculture Exchange project.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Basic understanding of PostgreSQL

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in the project details:
   - **Name**: `smart-agriculture-exchange`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 3: Configure Environment Variables

1. Copy the backend environment file:
   ```bash
   cd backend
   cp env.example .env
   ```

2. Update your `.env` file with your Supabase credentials:
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database/supabase-schema.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute the schema

This will create:
- All necessary tables (users, crop_posts, deals, messages, notifications)
- Indexes for better performance
- Row Level Security (RLS) policies
- Storage buckets for file uploads
- Demo data for testing

## Step 5: Configure Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Verify that these buckets are created:
   - `crop-images` (for crop photos)
   - `profile-images` (for user profile pictures)

3. Set up storage policies (already included in the schema):
   - Public read access for crop images
   - Authenticated upload access
   - Owner-based update/delete access

## Step 6: Test the Connection

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Start the backend server:
   ```bash
   npm run dev
   ```

3. Test the health endpoint:
   ```bash
   curl http://localhost:3001/health
   ```

## Step 7: Update Frontend (Optional)

If you want to use Supabase directly in the frontend:

1. Install Supabase client:
   ```bash
   cd frontend
   npm install @supabase/supabase-js
   ```

2. Create `frontend/src/config/supabase.ts`:
   ```typescript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

   export const supabase = createClient(supabaseUrl, supabaseKey)
   ```

3. Add environment variables to `frontend/.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Database Schema Overview

### Tables Created:

1. **users** - User profiles (farmers, buyers, admins)
2. **crop_posts** - Crop listings from farmers
3. **deals** - Transactions between farmers and buyers
4. **messages** - Chat messages within deals
5. **notifications** - System notifications

### Key Features:

- **Row Level Security (RLS)** - Users can only access their own data
- **Real-time subscriptions** - Live updates for chat and notifications
- **File storage** - Image uploads for crops and profiles
- **Full-text search** - Search crops by name
- **Geographic data** - Location-based crop filtering
- **Demo data** - Ready-to-test accounts and sample crops

## Demo Accounts

The schema includes demo accounts for testing:

- **Farmer**: Phone `+1234567890`, OTP `123456`
- **Buyer**: Phone `+9876543210`, OTP `123456`  
- **Admin**: Phone `+5555555555`, OTP `123456`

## Troubleshooting

### Common Issues:

1. **Connection refused**: Check your SUPABASE_URL and SUPABASE_ANON_KEY
2. **Permission denied**: Ensure RLS policies are properly set up
3. **Storage upload fails**: Check storage bucket policies
4. **Schema errors**: Make sure to run the complete schema file

### Useful Queries:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check demo users
SELECT name, phone, role FROM users;

-- Check RLS policies
SELECT schemaname, tablename, policyname FROM pg_policies;
```

## Next Steps

1. **Customize the schema** based on your specific needs
2. **Set up authentication** using Supabase Auth
3. **Configure real-time subscriptions** for live features
4. **Set up backups** and monitoring
5. **Deploy to production** with proper security settings

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

## Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Review the backend console output
3. Verify your environment variables
4. Check the database schema and policies
