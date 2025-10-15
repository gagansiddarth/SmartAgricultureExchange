# 🔑 **Get Your Supabase Service Role Key**

## **Issue Found**
Your Supabase URL and anon key are set correctly, but you're missing the **service role key** which is required for server-side operations like user registration.

## **🚀 Quick Fix Steps**

### **Step 1: Get Your Service Role Key**

1. **Go to**: https://supabase.com/dashboard/project/kpvgymcokazhtuhhgrup/settings/api
2. **Look for**: "Project API keys" section
3. **Copy**: The **"service_role"** key (NOT the anon key)
4. **It should look like**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwdmd5bWNva2F6aHR1aGhncnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTc2MDk0MywiZXhwIjoyMDc1MzM2OTQzfQ.xxxxxxxxxxxxx`

### **Step 2: Add to Your .env File**

**Open** your `backend/.env` file and **add** the service role key:

```env
# Supabase Configuration
SUPABASE_URL=https://kpvgymcokazhtuhhgrup.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwdmd5bWNva2F6aHR1aGhncnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjA5NDMsImV4cCI6MjA3NTMzNjk0M30.xJkEFyAzu63Y715T0E1vEwK5vg9o8VrhrbJeo5Jw4Qw
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### **Step 3: Restart Backend**

After adding the service role key:

```bash
# Stop the backend
pkill -f nodemon

# Start it again
cd backend && npm run dev
```

### **Step 4: Test Registration**

Once the service role key is added, test registration:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Real Supabase User",
    "phone": "+919876543799",
    "email": "real@supabase.com",
    "role": "farmer",
    "village": "Real Village",
    "district": "Real District",
    "state": "Real State"
  }'
```

## **✅ Expected Result**

After adding the service role key, you should see:
- **User ID**: Real UUID format from Supabase (not `user-...`)
- **Database Save**: User actually saved to Supabase
- **Login Works**: Can login with the registered phone number

## **🔍 How to Verify**

### **Check Supabase Dashboard**
1. Go to: https://supabase.com/dashboard/project/kpvgymcokazhtuhhgrup/editor
2. Navigate to **Table Editor**
3. Look at the **users** table
4. You should see your registered users there

### **Test Login Flow**
1. Register a new user
2. Try to login with that phone number
3. Should get real user data from Supabase database

## **⚠️ Important Notes**

- **Service Role Key** is different from **Anon Key**
- **Service Role Key** has full database access (server-side only)
- **Anon Key** has limited access (client-side)
- Keep the service role key secure and never expose it in frontend code

## **📞 Need Help?**

If you can't find the service role key, let me know! It should be right next to the anon key in your Supabase dashboard.
