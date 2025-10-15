# Supabase Troubleshooting Guide

## 🚨 **"Load failed (api.supabase.com)" Error**

This error typically occurs due to:

1. **Schema too complex** - Large schemas with many functions
2. **Network connectivity issues**
3. **Supabase service temporarily unavailable**
4. **Syntax errors in the schema**

## 🔧 **Solution: Step-by-Step Deployment**

### **Step 1: Use the Simple Schema**

Instead of the advanced schema, use the simplified version:

1. **Open Supabase SQL Editor**
2. **Copy and paste** the contents of `database/simple-supabase-schema.sql`
3. **Execute** the schema

### **Step 2: If Still Failing - Deploy in Parts**

If the simple schema still fails, deploy it in smaller chunks:

#### **Part 1: Basic Tables**
```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
CREATE TYPE user_role AS ENUM ('farmer', 'buyer', 'admin', 'moderator');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'suspended');
CREATE TYPE crop_status AS ENUM ('pending', 'approved', 'rejected', 'sold', 'expired', 'withdrawn');
CREATE TYPE deal_status AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'cancelled', 'disputed');
CREATE TYPE message_type AS ENUM ('text', 'image', 'document', 'system', 'notification');
CREATE TYPE notification_type AS ENUM ('deal_created', 'deal_accepted', 'deal_rejected', 'message_received', 'crop_approved', 'crop_rejected', 'payment_received', 'system_alert');
CREATE TYPE image_type AS ENUM ('crop_photo', 'harvest_photo', 'certificate', 'location_photo', 'farmer_photo', 'processing_photo');
CREATE TYPE certification_type AS ENUM ('organic', 'fssai', 'iso', 'fair_trade', 'rainforest_alliance', 'usda', 'european_organic', 'indian_organic', 'other');
```

#### **Part 2: Core Tables**
```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    role user_role NOT NULL DEFAULT 'farmer',
    avatar_url TEXT,
    
    -- Location information
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    village VARCHAR(255),
    taluk VARCHAR(255),
    district VARCHAR(255),
    state VARCHAR(255),
    pincode VARCHAR(10),
    country VARCHAR(100) DEFAULT 'India',
    coordinates POINT,
    
    -- Personal details
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    languages JSONB DEFAULT '["en"]',
    preferred_language VARCHAR(10) DEFAULT 'en',
    
    -- Verification and trust
    is_verified BOOLEAN DEFAULT false,
    verification_status verification_status DEFAULT 'pending',
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_documents JSONB DEFAULT '[]',
    trust_score DECIMAL(3,2) DEFAULT 0.0 CHECK (trust_score >= 0 AND trust_score <= 5.0),
    rating_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    
    -- Role-specific details
    bank_details JSONB,
    organization_details JSONB,
    admin_details JSONB,
    farmer_details JSONB,
    
    -- Activity tracking
    last_login_at TIMESTAMP WITH TIME ZONE,
    total_posts INTEGER DEFAULT 0,
    total_deals INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0.0,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);
```

### **Step 3: Check Supabase Status**

1. **Visit**: https://status.supabase.com/
2. **Check** if there are any ongoing issues
3. **Wait** if there are service disruptions

### **Step 4: Verify Your Connection**

1. **Check your internet connection**
2. **Verify your Supabase project URL**
3. **Ensure you're logged into the correct Supabase account**

### **Step 5: Alternative Approach**

If all else fails, use the **original simple schema** from the initial setup:

```sql
-- Use the contents of database/init-simple.sql
-- This is a minimal working schema
```

## 🎯 **Recommended Action**

**Use the simple schema** (`database/simple-supabase-schema.sql`) which includes all the essential features without complex functions that might cause issues.

## 📞 **If Still Having Issues**

1. **Try a different browser**
2. **Clear browser cache**
3. **Try incognito/private mode**
4. **Check Supabase dashboard** for any error messages
5. **Contact Supabase support** if the issue persists

## ✅ **Success Indicators**

You'll know it's working when:
- ✅ Tables are created successfully
- ✅ Sample data is inserted
- ✅ You can query the tables
- ✅ RLS policies are active
