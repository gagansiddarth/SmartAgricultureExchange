// Create Demo Accounts that work without email verification
// Using different email format to avoid verification issues

const SUPABASE_URL = 'https://kpvgymcokazhtuhhgrup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwdmd5bWNva2F6aHR1aGhncnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjA5NDMsImV4cCI6MjA3NTMzNjk0M30.xJkEFyAzu63Y715T0E1vEwK5vg9o8VrhrbJeo5Jw4Qw';

async function createDemoAccounts() {
  console.log('🚀 Creating demo accounts (no verification required)...\n');

  // Use simple email addresses that might not require verification
  const accounts = [
    {
      email: 'admin.demo@test.com',
      password: 'Admin123!',
      name: 'Demo Admin',
      role: 'admin'
    },
    {
      email: 'farmer.demo@test.com',
      password: 'Farmer123!',
      name: 'Demo Farmer',
      role: 'farmer'
    },
    {
      email: 'buyer.demo@test.com',
      password: 'Buyer123!',
      name: 'Demo Buyer',
      role: 'buyer'
    }
  ];

  for (const account of accounts) {
    try {
      console.log(`📧 Creating ${account.role} account: ${account.email}`);
      
      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email: account.email,
          password: account.password,
          options: {
            data: {
              name: account.name,
              role: account.role
            }
          }
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${account.role} account created successfully!`);
      } else if (result.msg?.includes('already registered')) {
        console.log(`ℹ️  ${account.role} account already exists`);
      } else {
        console.log(`❌ Error creating ${account.role}: ${result.msg || 'Unknown error'}`);
      }
      
      console.log(''); // Empty line for readability
      
    } catch (error) {
      console.error(`❌ Network error for ${account.role}:`, error.message);
      console.log(''); // Empty line for readability
    }
  }

  console.log('🎯 UPDATED Demo Account Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👨‍💼 ADMIN ACCOUNT:');
  console.log('   📧 Email:    admin.demo@test.com');
  console.log('   🔑 Password: Admin123!');
  console.log('   🌐 Login:    http://localhost:5174/login');
  console.log('   📊 Dashboard: http://localhost:5174/admin-dashboard');
  console.log('');
  console.log('🌱 FARMER ACCOUNT:');
  console.log('   📧 Email:    farmer.demo@test.com');
  console.log('   🔑 Password: Farmer123!');
  console.log('   🌐 Login:    http://localhost:5174/login');
  console.log('   🌱 Dashboard: http://localhost:5174/farmer-dashboard');
  console.log('');
  console.log('🏢 BUYER ACCOUNT:');
  console.log('   📧 Email:    buyer.demo@test.com');
  console.log('   🔑 Password: Buyer123!');
  console.log('   🌐 Login:    http://localhost:5174/login');
  console.log('   🏢 Dashboard: http://localhost:5174/dashboard');
  console.log('');
  console.log('💡 ALTERNATIVE: If these still don\'t work, try:');
  console.log('   1. Use your own email address to register');
  console.log('   2. Check your email for verification link');
  console.log('   3. Or we can disable email verification in Supabase settings');
}

// Run the function
createDemoAccounts();
