// Check Images in Crop Posts Script
// This script will check if images are properly stored and displayed

const SUPABASE_URL = 'https://kpvgymcokazhtuhhgrup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwdmd5bWNva2F6aHR1aGhncnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjA5NDMsImV4cCI6MjA3NTMzNjk0M30.xJkEFyAzu63Y715T0E1vEwK5vg9o8VrhrbJeo5Jw4Qw';

async function checkImages() {
  console.log('🖼️ Checking crop post images...\n');

  try {
    // Step 1: Sign in as farmer
    console.log('1️⃣ Authenticating as farmer...');
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
    const accessToken = signInResult.access_token;

    // Step 2: Fetch crop posts with detailed image info
    console.log('\n2️⃣ Fetching crop posts with image details...');
    const postsResponse = await fetch(`${SUPABASE_URL}/rest/v1/crop_posts?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!postsResponse.ok) {
      const errorText = await postsResponse.text();
      console.log('❌ Failed to fetch crop posts:', errorText);
      return;
    }
    
    const posts = await postsResponse.json();
    console.log(`✅ Found ${posts.length} crop posts`);

    // Step 3: Analyze each post's images
    console.log('\n3️⃣ Image Analysis:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    posts.forEach((post, index) => {
      console.log(`\n📋 Post #${index + 1}: ${post.crop_name}`);
      console.log(`   🆔 ID: ${post.id}`);
      console.log(`   📅 Created: ${new Date(post.created_at).toLocaleString()}`);
      
      // Check primary image
      console.log(`   🖼️  Primary Image:`);
      if (post.primary_image_url) {
        console.log(`      ✅ URL: ${post.primary_image_url}`);
        console.log(`      🔗 Accessible: Testing...`);
        
        // Test if image is accessible
        fetch(post.primary_image_url)
          .then(response => {
            if (response.ok) {
              console.log(`      ✅ Image loads successfully`);
            } else {
              console.log(`      ❌ Image failed to load (${response.status})`);
            }
          })
          .catch(err => {
            console.log(`      ❌ Image load error: ${err.message}`);
          });
      } else {
        console.log(`      ❌ No primary image`);
      }
      
      // Check all images
      console.log(`   📸 All Images:`);
      if (post.image_urls && Array.isArray(post.image_urls)) {
        console.log(`      Total images: ${post.image_urls.length}`);
        post.image_urls.forEach((url, imgIndex) => {
          console.log(`      ${imgIndex + 1}. ${url}`);
        });
      } else {
        console.log(`      ❌ No image URLs array or empty`);
      }
      
      // Check if primary image matches first in array
      if (post.primary_image_url && post.image_urls && post.image_urls.length > 0) {
        if (post.primary_image_url === post.image_urls[0]) {
          console.log(`      ✅ Primary image matches first in array`);
        } else {
          console.log(`      ⚠️  Primary image differs from first in array`);
        }
      }
    });

    // Step 4: Check storage bucket
    console.log('\n4️⃣ Storage Bucket Status:');
    const storageResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket/crop-images`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!storageResponse.ok) {
      console.log('❌ Storage bucket "crop-images" does not exist');
      console.log('\n💡 SOLUTION: Create the storage bucket');
      console.log('📋 Steps:');
      console.log('1. Go to: https://supabase.com/dashboard/project/kpvgymcokazhtuhhgrup/storage');
      console.log('2. Click "Create a new bucket"');
      console.log('3. Name: crop-images, Public: Yes');
      console.log('4. Or run this SQL:');
      console.log('   INSERT INTO storage.buckets (id, name, public) VALUES (\'crop-images\', \'crop-images\', true);');
    } else {
      console.log('✅ Storage bucket exists');
      
      // List files in bucket
      const filesResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/list/crop-images`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (filesResponse.ok) {
        const files = await filesResponse.json();
        console.log(`📁 Files in bucket: ${files.length}`);
        if (files.length > 0) {
          files.forEach((file, index) => {
            console.log(`   ${index + 1}. ${file.name} (${file.metadata?.size || 'unknown size'})`);
          });
        } else {
          console.log('   📝 No files uploaded yet');
        }
      }
    }

    console.log('\n🎯 Summary:');
    console.log(`   📊 Total posts: ${posts.length}`);
    console.log(`   🖼️  Posts with primary image: ${posts.filter(p => p.primary_image_url).length}`);
    console.log(`   📸 Posts with image arrays: ${posts.filter(p => p.image_urls && p.image_urls.length > 0).length}`);
    console.log(`   🗂️  Storage bucket: ${storageResponse.ok ? '✅ Exists' : '❌ Missing'}`);

    if (posts.length > 0 && posts[0].image_urls && posts[0].image_urls.length > 0) {
      console.log('\n💡 Image URLs found! The view button should now show images.');
    } else {
      console.log('\n💡 No images found. Upload images when creating posts to see them in the view page.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the check
checkImages();
