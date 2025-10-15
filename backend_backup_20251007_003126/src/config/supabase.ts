import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase environment variables not found. Please set SUPABASE_URL and SUPABASE_ANON_KEY');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types (will be generated from Supabase later)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email?: string;
          role: 'farmer' | 'buyer' | 'admin';
          village?: string;
          district?: string;
          state?: string;
          languages: string[];
          is_verified: boolean;
          bank_details?: any;
          organization_details?: any;
          admin_details?: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string;
          role: 'farmer' | 'buyer' | 'admin';
          village?: string;
          district?: string;
          state?: string;
          languages: string[];
          is_verified?: boolean;
          bank_details?: any;
          organization_details?: any;
          admin_details?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string;
          role?: 'farmer' | 'buyer' | 'admin';
          village?: string;
          district?: string;
          state?: string;
          languages?: string[];
          is_verified?: boolean;
          bank_details?: any;
          organization_details?: any;
          admin_details?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      crop_posts: {
        Row: {
          id: string;
          farmer_id: string;
          crop_name: string;
          variety: string;
          quantity: number;
          unit: string;
          price_per_unit: number;
          description?: string;
          images: string[];
          harvest_date: string;
          available_until: string;
          location: {
            village: string;
            district: string;
            state: string;
            coordinates?: {
              lat: number;
              lng: number;
            };
          };
          certification: string[];
          minimum_order: number;
          status: 'pending' | 'approved' | 'rejected' | 'sold';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farmer_id: string;
          crop_name: string;
          variety: string;
          quantity: number;
          unit: string;
          price_per_unit: number;
          description?: string;
          images: string[];
          harvest_date: string;
          available_until: string;
          location: any;
          certification: string[];
          minimum_order: number;
          status?: 'pending' | 'approved' | 'rejected' | 'sold';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farmer_id?: string;
          crop_name?: string;
          variety?: string;
          quantity?: number;
          unit?: string;
          price_per_unit?: number;
          description?: string;
          images?: string[];
          harvest_date?: string;
          available_until?: string;
          location?: any;
          certification?: string[];
          minimum_order?: number;
          status?: 'pending' | 'approved' | 'rejected' | 'sold';
          created_at?: string;
          updated_at?: string;
        };
      };
      deals: {
        Row: {
          id: string;
          crop_post_id: string;
          buyer_id: string;
          farmer_id: string;
          quantity: number;
          price_per_unit: number;
          total_amount: number;
          status: 'pending' | 'accepted' | 'rejected' | 'completed';
          buyer_message?: string;
          farmer_message?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          crop_post_id: string;
          buyer_id: string;
          farmer_id: string;
          quantity: number;
          price_per_unit: number;
          total_amount: number;
          status?: 'pending' | 'accepted' | 'rejected' | 'completed';
          buyer_message?: string;
          farmer_message?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          crop_post_id?: string;
          buyer_id?: string;
          farmer_id?: string;
          quantity?: number;
          price_per_unit?: number;
          total_amount?: number;
          status?: 'pending' | 'accepted' | 'rejected' | 'completed';
          buyer_message?: string;
          farmer_message?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          deal_id: string;
          sender_id: string;
          receiver_id: string;
          message: string;
          message_type: 'text' | 'image' | 'system';
          created_at: string;
        };
        Insert: {
          id?: string;
          deal_id: string;
          sender_id: string;
          receiver_id: string;
          message: string;
          message_type?: 'text' | 'image' | 'system';
          created_at?: string;
        };
        Update: {
          id?: string;
          deal_id?: string;
          sender_id?: string;
          receiver_id?: string;
          message?: string;
          message_type?: 'text' | 'image' | 'system';
          created_at?: string;
        };
      };
    };
  };
}

export default supabase;
