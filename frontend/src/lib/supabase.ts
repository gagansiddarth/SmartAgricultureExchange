import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'farmer' | 'buyer' | 'admin';
  village?: string;
  district?: string;
  state?: string;
  pincode?: string;
  languages: string[];
  is_verified: boolean;
  verification_status: string;
  bank_details?: any;
  organization_details?: any;
  admin_details?: any;
  created_at: string;
  updated_at: string;
}

export interface CropPost {
  id: string;
  farmer_id: string;
  crop_name: string;
  variety: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  description: string;
  images: string[];
  harvest_date: string;
  expiry_date: string;
  location: string;
  quality_grade: string;
  organic_certified: boolean;
  created_at: string;
  updated_at: string;
}

// Auth functions
export const auth = {
  // Sign up with email
  async signUp(email: string, password: string, userData: Partial<User>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  // Sign in with email
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get current session
  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
};

// Database functions
export const db = {
  // Users
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    return { data, error };
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    return { data, error };
  },

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Crop Posts
  async createCropPost(cropData: Omit<CropPost, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('crop_posts')
      .insert([cropData])
      .select()
      .single();
    return { data, error };
  },

  async getCropPosts(filters?: {
    farmer_id?: string;
    crop_name?: string;
    location?: string;
    price_min?: number;
    price_max?: number;
  }) {
    let query = supabase
      .from('crop_posts')
      .select(`
        *,
        users:farmer_id (
          name,
          village,
          district,
          state
        )
      `)
      .order('created_at', { ascending: false });

    if (filters) {
      if (filters.farmer_id) query = query.eq('farmer_id', filters.farmer_id);
      if (filters.crop_name) query = query.ilike('crop_name', `%${filters.crop_name}%`);
      if (filters.location) query = query.ilike('location', `%${filters.location}%`);
      if (filters.price_min) query = query.gte('price_per_unit', filters.price_min);
      if (filters.price_max) query = query.lte('price_per_unit', filters.price_max);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async getCropPostById(id: string) {
    const { data, error } = await supabase
      .from('crop_posts')
      .select(`
        *,
        users:farmer_id (
          name,
          phone,
          email,
          village,
          district,
          state,
          bank_details
        )
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  async updateCropPost(id: string, updates: Partial<CropPost>) {
    const { data, error } = await supabase
      .from('crop_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteCropPost(id: string) {
    const { error } = await supabase
      .from('crop_posts')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Storage functions
export const storage = {
  async uploadImage(file: File, bucket: string, path: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  },

  async getImageUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data;
  },

  async deleteImage(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    return { error };
  }
};

// Real-time subscriptions
export const realtime = {
  subscribeToCropPosts(callback: (payload: any) => void) {
    return supabase
      .channel('crop_posts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'crop_posts'
      }, callback)
      .subscribe();
  },

  subscribeToChat(dealId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`chat_${dealId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `deal_id=eq.${dealId}`
      }, callback)
      .subscribe();
  }
};
