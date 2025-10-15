import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; // Use service role key for admin operations

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUserRoles() {
  try {
    console.log('🔧 Fixing user roles...');
    
    // Get all users
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }
    
    console.log(`📊 Found ${users.users.length} users`);
    
    // Fix roles for demo users
    const demoUsers = [
      { email: 'farmer@demo.com', role: 'farmer' },
      { email: 'buyer@demo.com', role: 'buyer' },
      { email: 'admin@demo.com', role: 'admin' }
    ];
    
    for (const demoUser of demoUsers) {
      const user = users.users.find(u => u.email === demoUser.email);
      
      if (user) {
        console.log(`🔧 Fixing role for ${demoUser.email}...`);
        
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          user.id,
          {
            user_metadata: {
              ...user.user_metadata,
              role: demoUser.role
            }
          }
        );
        
        if (updateError) {
          console.error(`❌ Error updating ${demoUser.email}:`, updateError);
        } else {
          console.log(`✅ Successfully updated ${demoUser.email} to ${demoUser.role}`);
        }
      } else {
        console.log(`⚠️ User ${demoUser.email} not found`);
      }
    }
    
    console.log('🎉 User role fixing completed!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixUserRoles();