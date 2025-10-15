// Setup Storage Bucket Script
// This script will create the storage bucket for crop images

const SUPABASE_URL = 'https://kpvgymcokazhtuhhgrup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwdmd5bWNva2F6aHR1aGhncnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjA5NDMsImV4cCI6MjA3NTMzNjk0M30.xJkEFyAzu63Y715T0E1vEwK5vg9o8VrhrbJeo5Jw4Qw';

async function setupStorage() {
  console.log('🪣 Setting up storage bucket for crop images...\n');

  try {
    // Note: Storage bucket creation requires service role key
    // We'll provide manual instructions instead
    
    console.log('📋 MANUAL STORAGE SETUP INSTRUCTIONS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('1. Go to Supabase Storage:');
    console.log('   https://supabase.com/dashboard/project/kpvgymcokazhtuhhgrup/storage');
    console.log('');
    console.log('2. Click "Create a new bucket"');
    console.log('');
    console.log('3. Bucket details:');
    console.log('   • Name: crop-images');
    console.log('   • Public bucket: ✅ Yes (checked)');
    console.log('   • File size limit: 50 MB');
    console.log('   • Allowed MIME types: image/*');
    console.log('');
    console.log('4. Click "Create bucket"');
    console.log('');
    console.log('5. Verify bucket was created successfully');
    console.log('');
    console.log('🔧 ALTERNATIVE: Create bucket via SQL');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('Run this SQL in the SQL Editor:');
    console.log('');
    console.log('INSERT INTO storage.buckets (id, name, public) VALUES (\'crop-images\', \'crop-images\', true);');
    console.log('');
    console.log('Then run the storage policies:');
    console.log('');
    console.log(`CREATE POLICY "Anyone can view crop images" ON storage.objects
    FOR SELECT USING (bucket_id = 'crop-images');

CREATE POLICY "Authenticated users can upload crop images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'crop-images' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their own crop images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'crop-images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own crop images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'crop-images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );`);
    console.log('');
    console.log('🎯 After storage setup, crop post creation with images will work perfectly!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the setup
setupStorage();
