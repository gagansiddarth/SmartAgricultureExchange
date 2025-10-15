// Debug Crop Post Creation Script
// This script will test crop post creation and identify the exact error

const SUPABASE_URL = 'https://kpvgymcokazhtuhhgrup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwdmd5bWNva2F6aHR1aGhncnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjA5NDMsImV4cCI6MjA3NTMzNjk0M30.xJkEFyAzu63Y715T0E1vEwK5vg9o8VrhrbJeo5Jw4Qw';

async function debugCropPost() {
  console.log('🔍 Debugging crop post creation...\n');

  try {
    // Step 1: Test authentication
    console.log('1️⃣ Testing authentication...');
    const signInResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email: 'farmer@demo.com',
        password: 'Farmer123!'
      })
    });

    const signInResult = await signInResponse.json();
    
    if (!signInResponse.ok) {
      console.log('❌ Authentication failed:', signInResult);
      return;
    }
    
    console.log('✅ Authentication successful');
    const userId = signInResult.user.id;
    const accessToken = signInResult.access_token;

    // Step 2: Test table access
    console.log('\n2️⃣ Testing crop_posts table access...');
    const testQueryResponse = await fetch(`${SUPABASE_URL}/rest/v1/crop_posts?select=id&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!testQueryResponse.ok) {
      const errorText = await testQueryResponse.text();
      console.log('❌ Table access failed:', errorText);
      return;
    }
    
    console.log('✅ Table access successful');

    // Step 3: Test user_profiles access
    console.log('\n3️⃣ Testing user_profiles table access...');
    const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${userId}`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.log('❌ User profile access failed:', errorText);
      return;
    }
    
    const profileData = await profileResponse.json();
    console.log('✅ User profile access successful:', profileData[0]?.role);

    // Step 4: Test crop post creation with minimal data
    console.log('\n4️⃣ Testing crop post creation...');
    const cropPostData = {
      farmer_id: userId,
      crop_name: 'Test Crop',
      variety_name: 'Test Variety',
      crop_type: 'Test Crop',
      description: 'Test description',
      quantity: 10,
      quantity_unit: 'kg',
      price_per_unit: 50,
      location: {
        village: 'Test Village',
        district: 'Test District',
        state: 'Test State',
        pincode: '123456',
        address: 'Test Address'
      },
      status: 'pending'
    };

    const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/crop_posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(cropPostData)
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.log('❌ Crop post creation failed:', errorText);
      
      // Try to parse error details
      try {
        const errorJson = JSON.parse(errorText);
        console.log('📋 Error details:', JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.log('📋 Raw error:', errorText);
      }
      return;
    }
    
    console.log('✅ Crop post creation successful!');

    // Step 5: Test storage bucket access
    console.log('\n5️⃣ Testing storage bucket access...');
    const storageResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket/crop-images`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!storageResponse.ok) {
      const errorText = await storageResponse.text();
      console.log('❌ Storage bucket access failed:', errorText);
      console.log('💡 You may need to create the storage bucket manually in Supabase dashboard');
    } else {
      console.log('✅ Storage bucket access successful');
    }

    console.log('\n🎉 Debug completed successfully!');
    console.log('📋 Summary:');
    console.log('   ✅ Authentication: Working');
    console.log('   ✅ Table access: Working');
    console.log('   ✅ User profiles: Working');
    console.log('   ✅ Crop post creation: Working');
    console.log('   ⚠️  Storage: Check manually');

  } catch (error) {
    console.error('❌ Debug failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the debug function
debugCropPost();
