// Create Storage Bucket Script
// This script will create the crop-images storage bucket in Supabase

const SUPABASE_URL = 'https://kpvgymcokazhtuhhgrup.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwdmd5bWNva2F6aHR1aGhncnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTc2MDk0MywiZXhwIjoyMDc1MzM2OTQzfQ.5p4gZzW7m3o6QKjK8J4H2P9R1T7Y3U6I5N8B0V2X9C1M';

async function createStorageBucket() {
  console.log('🪣 Creating storage bucket for crop images...\n');

  try {
    // Create the storage bucket
    console.log('1️⃣ Creating "crop-images" bucket...');
    const bucketResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        id: 'crop-images',
        name: 'crop-images',
        public: true,
        file_size_limit: 10485760, // 10MB
        allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp']
      })
    });

    if (bucketResponse.ok) {
      console.log('✅ Storage bucket "crop-images" created successfully');
    } else {
      const errorText = await bucketResponse.text();
      console.log('⚠️  Bucket might already exist or error:', errorText);
    }

    // Set up storage policies
    console.log('\n2️⃣ Setting up storage policies...');
    
    // Policy 1: Allow authenticated users to upload images
    const uploadPolicyResponse = await fetch(`${SUPABASE_URL}/rest/v1/policies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        table_name: 'objects',
        policy_name: 'crop_images_upload_policy',
        policy_schema: 'storage',
        policy_cmd: 'INSERT',
        policy_expression: 'bucket_id = \'crop-images\' AND auth.role() = \'authenticated\'',
        policy_roles: ['authenticated']
      })
    });

    if (uploadPolicyResponse.ok) {
      console.log('✅ Upload policy created');
    } else {
      const errorText = await uploadPolicyResponse.text();
      console.log('⚠️  Upload policy error:', errorText);
    }

    // Policy 2: Allow public access to view images
    const viewPolicyResponse = await fetch(`${SUPABASE_URL}/rest/v1/policies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        table_name: 'objects',
        policy_name: 'crop_images_view_policy',
        policy_schema: 'storage',
        policy_cmd: 'SELECT',
        policy_expression: 'bucket_id = \'crop-images\'',
        policy_roles: ['public']
      })
    });

    if (viewPolicyResponse.ok) {
      console.log('✅ View policy created');
    } else {
      const errorText = await viewPolicyResponse.text();
      console.log('⚠️  View policy error:', errorText);
    }

    // Policy 3: Allow users to delete their own images
    const deletePolicyResponse = await fetch(`${SUPABASE_URL}/rest/v1/policies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        table_name: 'objects',
        policy_name: 'crop_images_delete_policy',
        policy_schema: 'storage',
        policy_cmd: 'DELETE',
        policy_expression: 'bucket_id = \'crop-images\' AND auth.uid()::text = (storage.foldername(name))[1]',
        policy_roles: ['authenticated']
      })
    });

    if (deletePolicyResponse.ok) {
      console.log('✅ Delete policy created');
    } else {
      const errorText = await deletePolicyResponse.text();
      console.log('⚠️  Delete policy error:', errorText);
    }

    // Verify bucket exists
    console.log('\n3️⃣ Verifying bucket creation...');
    const verifyResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket/crop-images`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      }
    });

    if (verifyResponse.ok) {
      const bucketInfo = await verifyResponse.json();
      console.log('✅ Bucket verified successfully');
      console.log(`   📦 Bucket ID: ${bucketInfo.id}`);
      console.log(`   🌐 Public: ${bucketInfo.public}`);
      console.log(`   📏 File size limit: ${bucketInfo.file_size_limit} bytes`);
    } else {
      console.log('❌ Failed to verify bucket');
    }

    console.log('\n🎉 Storage bucket setup complete!');
    console.log('💡 Now you can upload images when creating crop posts.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
createStorageBucket();
