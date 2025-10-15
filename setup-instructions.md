# 🚀 Smart Agriculture Exchange - Database Setup Instructions

## 📋 Step-by-Step Setup

### 1. Run Database Schema
1. **Go to Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/kpvgymcokazhtuhhgrup/sql
   ```

2. **Copy the contents of:** `database/crop-posts-schema.sql`

3. **Paste and run the SQL script** in the SQL Editor

4. **Verify the schema was created successfully** (should see no errors)

### 2. Update Demo User Profiles
After the schema is created, run:
```bash
node update-demo-profiles.js
```

This will update the existing demo accounts with proper roles and profile information.

### 3. Test the Complete Workflow

#### Demo Account Credentials:
- **👨‍💼 Admin:** `admin@demo.com` / `Admin123!`
- **🌱 Farmer:** `farmer@demo.com` / `Farmer123!`
- **🏢 Buyer:** `buyer@demo.com` / `Buyer123!`

#### Testing Flow:
1. **Login as farmer** → Post new crop with images
2. **Login as admin** → Review and approve crop posts
3. **Login as buyer** → Browse approved crops

## 🎯 What the Schema Creates:

### Tables:
- **`crop_posts`** - Farmer crop listings
- **`user_profiles`** - Extended user information
- **`orders`** - Buyer-farmer transactions
- **`messages`** - Communication between users
- **`reviews`** - Rating and feedback system
- **`notifications`** - System notifications

### Features:
- **Image storage** in Supabase Storage
- **Row Level Security (RLS)** for data protection
- **Custom functions** for efficient data retrieval
- **Automatic user profile creation** on signup
- **Admin dashboard statistics** view

## 🔧 Troubleshooting:

### If you get foreign key constraint errors:
- Make sure to run the schema AFTER creating demo accounts
- The schema no longer includes hardcoded demo data
- Demo profiles are updated via the `update-demo-profiles.js` script

### If storage bucket creation fails:
- Go to Storage in Supabase dashboard
- Manually create a bucket named `crop-images`
- Set it as public

## ✅ Success Indicators:
- All tables created without errors
- Demo profiles updated successfully
- Can login with demo accounts
- Can create crop posts as farmer
- Can review posts as admin
- Can browse approved crops as buyer

## 🎉 Ready for Production!
Once setup is complete, you have a fully functional Smart Agriculture Exchange with:
- Complete crop posting workflow
- Admin review system
- Buyer marketplace
- Image upload functionality
- User role management
- Secure data access
