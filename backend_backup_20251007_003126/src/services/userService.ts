// User service for Supabase integration
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase credentials not found. Running in demo mode.');
}

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

export interface UserData {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  role: 'farmer' | 'buyer';
  village?: string;
  district?: string;
  state?: string;
  pincode?: string;
  languages?: string[];
  is_verified?: boolean;
  verification_status?: string;
  bank_details?: any;
  organization_details?: any;
  created_at?: string;
}

// In-memory storage for demo users (temporary solution)
const demoUsers: { [phone: string]: any } = {};

// Create a new user in Supabase
export const createUser = async (userData: UserData) => {
  if (!supabase) {
    console.log('Supabase not configured. Using in-memory storage for demo.');
    
    // Generate a proper user ID
    const userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    const user = {
      ...userData,
      id: userId,
      is_verified: false,
      verification_status: 'pending',
      created_at: new Date().toISOString()
    };
    
            // Store in memory for demo (by email)
            if (userData.email) {
              demoUsers[userData.email] = user;
            }
    console.log('Demo user stored in memory:', user);
    
    return {
      success: true,
      user: user
    };
  }

  try {
    // Generate UUID for the user
    const userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    const userToSave = {
      id: userId,
      name: userData.name,
      phone: userData.phone,
      email: userData.email || null,
      role: userData.role,
      village: userData.village || null,
      district: userData.district || null,
      state: userData.state || null,
      pincode: userData.pincode || null,
      languages: userData.languages || ['en'],
      is_verified: false,
      verification_status: 'pending',
      bank_details: userData.role === 'farmer' ? (userData.bank_details || null) : null,
      organization_details: userData.role === 'buyer' ? (userData.organization_details || null) : null,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('users')
      .insert([userToSave])
      .select()
      .single();

    if (error) {
      console.error('Error creating user in Supabase:', error);
      return {
        success: false,
        error: error.message
      };
    }

    console.log('User created successfully in Supabase:', data);
    return {
      success: true,
      user: data
    };
  } catch (error) {
    console.error('Unexpected error creating user:', error);
    return {
      success: false,
      error: 'Failed to create user'
    };
  }
};

// Get user by email
export const getUserByEmail = async (email: string) => {
  if (!supabase) {
    console.log('Supabase not configured. Checking in-memory storage.');
    
    // Check in-memory storage first
    const demoUser = demoUsers[email];
    if (demoUser) {
      console.log('Found demo user in memory:', demoUser);
      return demoUser;
    }
    
    console.log('No user found in memory for email:', email);
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.log('No user found for email:', email);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};

// Get user by phone number (kept for backward compatibility)
export const getUserByPhone = async (phone: string) => {
  if (!supabase) {
    console.log('Supabase not configured. Checking in-memory storage.');
    
    // Check in-memory storage first
    const demoUser = demoUsers[phone];
    if (demoUser) {
      console.log('Found demo user in memory:', demoUser);
      return demoUser;
    }
    
    console.log('No user found in memory for phone:', phone);
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      console.log('No user found for phone:', phone);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user by phone:', error);
    return null;
  }
};

// Get user by ID
export const getUserById = async (userId: string) => {
  if (!supabase) {
    console.log('Supabase not configured. Returning demo user.');
    return {
      id: userId,
      name: 'Demo User',
      phone: '+1234567890',
      role: 'farmer',
      is_verified: true
    };
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.log('No user found for ID:', userId);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
};

// Update user profile
export const updateUser = async (userId: string, updates: Partial<UserData>) => {
  if (!supabase) {
    console.log('Supabase not configured. Demo update.');
    return {
      success: true,
      user: { id: userId, ...updates }
    };
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      user: data
    };
  } catch (error) {
    console.error('Unexpected error updating user:', error);
    return {
      success: false,
      error: 'Failed to update user'
    };
  }
};
