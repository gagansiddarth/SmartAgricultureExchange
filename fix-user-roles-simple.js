// Fix User Roles Script - Simple Version
// This script will create user profiles with the correct schema

const SUPABASE_URL = 'https://kpvgymcokazhtuhhgrup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwdmd5bWNva2F6aHR1aGhncnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjA5NDMsImV4cCI6MjA3NTMzNjk0M30.xJkEFyAzu63Y715T0E1vEwK5vg9o8VrhrbJeo5Jw4Qw';

async function fixUserRolesSimple() {
  console.log('🔧 Fixing user roles - Simple version...\n');

  const demoAccounts = [
    { email: 'admin@demo.com', password: 'Admin123!', role: 'admin', name: 'Admin User' },
    { email: 'farmer@demo.com', password: 'Farmer123!', role: 'farmer', name: 'Demo Farmer' },
    { email: 'buyer@demo.com', password: 'Buyer123!', role: 'buyer', name: 'Demo Buyer' }
  ];

  for (const account of demoAccounts) {
    console.log(`\n🔧 Fixing ${account.email}...`);
    
    try {
      // Step 1: Sign in
      const signInResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email: account.email,
          password: account.password
        })
      });

      const signInResult = await signInResponse.json();
      
      if (!signInResponse.ok) {
        console.log(`❌ Sign in failed: ${signInResult.error_description || signInResult.msg}`);
        continue;
      }
      
      console.log('✅ Sign in successful');
      const accessToken = signInResult.access_token;
      const userId = signInResult.user.id;

      // Step 2: Create user profile with minimal fields
      console.log('📝 Creating user profile...');
      const profileData = {
        id: userId,
        email: account.email,
        name: account.name,
        role: account.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add farmer-specific fields if role is farmer
      if (account.role === 'farmer') {
        profileData.village = 'Demo Village';
        profileData.district = 'Demo District';
        profileData.state = 'Demo State';
        profileData.phone = '+919876543210';
      } else if (account.role === 'buyer') {
        profileData.phone = '+919876543211';
      } else if (account.role === 'admin') {
        profileData.phone = '+919876543212';
      }

      const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(profileData)
      });

      if (profileResponse.ok) {
        console.log('✅ User profile created successfully');
      } else {
        const errorText = await profileResponse.text();
        console.log(`⚠️  Profile creation response: ${profileResponse.status} - ${errorText}`);
        
        // Try to update if profile already exists
        if (profileResponse.status === 409 || profileResponse.status === 400) {
          console.log('🔄 Attempting to update existing profile...');
          const updateData = {
            role: account.role,
            name: account.name,
            updated_at: new Date().toISOString()
          };

          const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${userId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(updateData)
          });

          if (updateResponse.ok) {
            console.log('✅ User profile updated successfully');
          } else {
            const updateError = await updateResponse.text();
            console.log(`❌ Profile update failed: ${updateError}`);
          }
        }
      }

    } catch (error) {
      console.error(`❌ Error fixing ${account.email}:`, error.message);
    }
  }

  console.log('\n🎯 Final Verification:');
  
  // Final verification
  for (const account of demoAccounts) {
    console.log(`\n✅ Verifying ${account.email}...`);
    
    try {
      const signInResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email: account.email,
          password: account.password
        })
      });

      const signInResult = await signInResponse.json();
      
      if (signInResponse.ok) {
        const accessToken = signInResult.access_token;
        const userId = signInResult.user.id;

        console.log(`   User ID: ${userId}`);
        console.log(`   Metadata Role: ${signInResult.user.user_metadata?.role || 'NOT SET'}`);

        // Check user profile
        const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?select=*&id=eq.${userId}`, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${accessToken}`
          }
        });

        const profileResult = await profileResponse.json();
        
        if (profileResponse.ok && profileResult && profileResult.length > 0) {
          console.log(`   Profile Role: ${profileResult[0].role}`);
          console.log(`   Profile Name: ${profileResult[0].name}`);
          console.log(`   Expected Role: ${account.role}`);
          console.log(`   Status: ${profileResult[0].role === account.role ? '✅ CORRECT' : '❌ INCORRECT'}`);
        } else {
          console.log('   ❌ No profile found');
        }
      }
    } catch (error) {
      console.log(`   ❌ Verification failed: ${error.message}`);
    }
  }

  console.log('\n🎉 Role fixing complete!');
  console.log('Now try logging in again - you should see different dashboards for each role.');
}

// Run the fix
fixUserRolesSimple();
