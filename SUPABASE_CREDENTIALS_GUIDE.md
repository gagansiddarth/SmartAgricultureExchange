# How to Get Your Supabase Credentials

## 🔑 **Step 1: Find Your Supabase Project URL**

1. **Go to** [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Select** your Smart Agriculture Exchange project
3. **Click** on "Settings" in the left sidebar
4. **Click** on "API" 
5. **Copy** the "Project URL" - it looks like: `https://your-project-id.supabase.co`

## 🔑 **Step 2: Get Your API Keys**

On the same API settings page:

1. **Copy** the "anon public" key (starts with `eyJ...`)
2. **Copy** the "service_role" key (starts with `eyJ...`)

⚠️ **Important**: Keep the service_role key secret - never expose it in frontend code!

## 📝 **Step 3: Create Your .env File**

Create a file called `.env` in your `backend` folder with:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJ...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...

# Other existing variables
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
PORT=3001
```

## ✅ **Step 4: Test Connection**

Once you have your credentials, we'll test the connection!
