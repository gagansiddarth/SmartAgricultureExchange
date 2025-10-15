# 🔑 **Supabase Credentials Setup**

## **Issue Identified**
Your registration is working, but users are not being saved to the Supabase database because the credentials are not configured.

## **🚀 Quick Fix Steps**

### **Step 1: Get Your Supabase Credentials**

1. **Go to**: https://supabase.com/dashboard
2. **Select** your Smart Agriculture Exchange project
3. **Click** on "Settings" → "API"
4. **Copy** these values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **service_role** key (starts with `eyJ...`)

### **Step 2: Update Your .env File**

**Open** your `backend/.env` file and **replace** the Supabase section with your actual credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-actual-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### **Step 3: Restart Backend**

After updating the .env file:

```bash
# Stop the backend
pkill -f nodemon

# Start it again
cd backend && npm run dev
```

### **Step 4: Test Registration**

Once credentials are set, try registering a new user:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Real User Test",
    "phone": "+919876543499",
    "email": "real@test.com",
    "role": "farmer",
    "village": "Real Village",
    "district": "Real District",
    "state": "Real State"
  }'
```

## **✅ Expected Result**

After setting up credentials, you should see:
- **User ID**: Real UUID format (not `demo-...`)
- **Database Save**: User actually saved to Supabase
- **Login Works**: Can login with the registered phone number

## **🔍 How to Verify**

### **Check Supabase Dashboard**
1. Go to your Supabase project
2. Navigate to **Table Editor**
3. Look at the **users** table
4. You should see your registered users there

### **Test Login Flow**
1. Register a new user
2. Try to login with that phone number
3. Should get real user data from database

## **🚨 If You Don't Have Supabase Project**

If you haven't created a Supabase project yet:

1. **Go to**: https://supabase.com
2. **Sign up** for free account
3. **Create new project**
4. **Wait** for project to be ready (2-3 minutes)
5. **Get credentials** from Settings → API
6. **Run the minimal schema**: Copy and paste `database/minimal-supabase-schema.sql` into the SQL Editor

## **📞 Need Help?**

If you need help with any of these steps, let me know! The registration system is working perfectly - it just needs the Supabase connection to actually save the data.
