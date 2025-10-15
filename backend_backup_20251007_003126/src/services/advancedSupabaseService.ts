import { supabase, Database } from '../config/supabase';
import { PostgrestError } from '@supabase/supabase-js';

// Enhanced database types for the advanced schema
export interface AdvancedDatabase {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email?: string;
          role: 'farmer' | 'buyer' | 'admin' | 'moderator';
          avatar_url?: string;
          address_line1?: string;
          address_line2?: string;
          village?: string;
          taluk?: string;
          district?: string;
          state?: string;
          pincode?: string;
          country: string;
          coordinates?: { lat: number; lng: number };
          date_of_birth?: string;
          gender?: string;
          languages: string[];
          preferred_language: string;
          is_verified: boolean;
          verification_status: 'pending' | 'verified' | 'rejected' | 'suspended';
          verified_at?: string;
          verification_documents: any[];
          trust_score: number;
          rating_count: number;
          average_rating: number;
          bank_details?: any;
          organization_details?: any;
          admin_details?: any;
          farmer_details?: any;
          last_login_at?: string;
          total_posts: number;
          total_deals: number;
          total_earnings: number;
          created_at: string;
          updated_at: string;
          created_by?: string;
          updated_by?: string;
        };
        Insert: Partial<{
          id: string;
          name: string;
          phone: string;
          email: string;
          role: 'farmer' | 'buyer' | 'admin' | 'moderator';
          avatar_url: string;
          address_line1: string;
          address_line2: string;
          village: string;
          taluk: string;
          district: string;
          state: string;
          pincode: string;
          country: string;
          coordinates: any;
          date_of_birth: string;
          gender: string;
          languages: string[];
          preferred_language: string;
          is_verified: boolean;
          verification_status: 'pending' | 'verified' | 'rejected' | 'suspended';
          verified_at: string;
          verification_documents: any[];
          trust_score: number;
          rating_count: number;
          average_rating: number;
          bank_details: any;
          organization_details: any;
          admin_details: any;
          farmer_details: any;
          last_login_at: string;
          total_posts: number;
          total_deals: number;
          total_earnings: number;
          created_at: string;
          updated_at: string;
          created_by: string;
          updated_by: string;
        }>;
        Update: Partial<{
          id: string;
          name: string;
          phone: string;
          email: string;
          role: 'farmer' | 'buyer' | 'admin' | 'moderator';
          avatar_url: string;
          address_line1: string;
          address_line2: string;
          village: string;
          taluk: string;
          district: string;
          state: string;
          pincode: string;
          country: string;
          coordinates: any;
          date_of_birth: string;
          gender: string;
          languages: string[];
          preferred_language: string;
          is_verified: boolean;
          verification_status: 'pending' | 'verified' | 'rejected' | 'suspended';
          verified_at: string;
          verification_documents: any[];
          trust_score: number;
          rating_count: number;
          average_rating: number;
          bank_details: any;
          organization_details: any;
          admin_details: any;
          farmer_details: any;
          last_login_at: string;
          total_posts: number;
          total_deals: number;
          total_earnings: number;
          created_at: string;
          updated_at: string;
          created_by: string;
          updated_by: string;
        }>;
      };
      crop_posts: {
        Row: {
          id: string;
          farmer_id: string;
          crop_name: string;
          variety_id?: string;
          variety_name?: string;
          quantity: number;
          unit: string;
          price_per_unit: number;
          price_currency: string;
          minimum_order: number;
          maximum_order?: number;
          title?: string;
          description?: string;
          key_features: any[];
          growing_method?: string;
          irrigation_type?: string;
          harvest_date: string;
          available_until: string;
          harvest_method?: string;
          storage_condition?: string;
          shelf_life_days?: number;
          location: any;
          farm_size_acres?: number;
          soil_type?: string;
          climate_zone?: string;
          quality_grade?: string;
          moisture_content?: number;
          purity_percentage?: number;
          certifications: any[];
          lab_test_reports: any[];
          primary_image_url?: string;
          images: any[];
          videos: any[];
          status: 'pending' | 'approved' | 'rejected' | 'sold' | 'expired' | 'withdrawn';
          rejection_reason?: string;
          reviewed_by?: string;
          reviewed_at?: string;
          moderation_notes?: string;
          tags: any[];
          search_keywords?: string;
          view_count: number;
          inquiry_count: number;
          deal_count: number;
          created_at: string;
          updated_at: string;
          expires_at?: string;
        };
        Insert: Partial<{
          id: string;
          farmer_id: string;
          crop_name: string;
          variety_id: string;
          variety_name: string;
          quantity: number;
          unit: string;
          price_per_unit: number;
          price_currency: string;
          minimum_order: number;
          maximum_order: number;
          title: string;
          description: string;
          key_features: any[];
          growing_method: string;
          irrigation_type: string;
          harvest_date: string;
          available_until: string;
          harvest_method: string;
          storage_condition: string;
          shelf_life_days: number;
          location: any;
          farm_size_acres: number;
          soil_type: string;
          climate_zone: string;
          quality_grade: string;
          moisture_content: number;
          purity_percentage: number;
          certifications: any[];
          lab_test_reports: any[];
          primary_image_url: string;
          images: any[];
          videos: any[];
          status: 'pending' | 'approved' | 'rejected' | 'sold' | 'expired' | 'withdrawn';
          rejection_reason: string;
          reviewed_by: string;
          reviewed_at: string;
          moderation_notes: string;
          tags: any[];
          search_keywords: string;
          view_count: number;
          inquiry_count: number;
          deal_count: number;
          created_at: string;
          updated_at: string;
          expires_at: string;
        }>;
        Update: Partial<{
          id: string;
          farmer_id: string;
          crop_name: string;
          variety_id: string;
          variety_name: string;
          quantity: number;
          unit: string;
          price_per_unit: number;
          price_currency: string;
          minimum_order: number;
          maximum_order: number;
          title: string;
          description: string;
          key_features: any[];
          growing_method: string;
          irrigation_type: string;
          harvest_date: string;
          available_until: string;
          harvest_method: string;
          storage_condition: string;
          shelf_life_days: number;
          location: any;
          farm_size_acres: number;
          soil_type: string;
          climate_zone: string;
          quality_grade: string;
          moisture_content: number;
          purity_percentage: number;
          certifications: any[];
          lab_test_reports: any[];
          primary_image_url: string;
          images: any[];
          videos: any[];
          status: 'pending' | 'approved' | 'rejected' | 'sold' | 'expired' | 'withdrawn';
          rejection_reason: string;
          reviewed_by: string;
          reviewed_at: string;
          moderation_notes: string;
          tags: any[];
          search_keywords: string;
          view_count: number;
          inquiry_count: number;
          deal_count: number;
          created_at: string;
          updated_at: string;
          expires_at: string;
        }>;
      };
      // Add other table types as needed...
    };
  };
}

export class AdvancedSupabaseService {
  // Enhanced user operations
  static async createUser(userData: AdvancedDatabase['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select(`
        *,
        farmer_details,
        organization_details,
        admin_details
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        farmer_details,
        organization_details,
        admin_details
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserByPhone(phone: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        farmer_details,
        organization_details,
        admin_details
      `)
      .eq('phone', phone)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateUser(id: string, updates: AdvancedDatabase['public']['Tables']['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Enhanced crop post operations
  static async createCropPost(postData: AdvancedDatabase['public']['Tables']['crop_posts']['Insert']) {
    const { data, error } = await supabase
      .from('crop_posts')
      .insert([postData])
      .select(`
        *,
        users!crop_posts_farmer_id_fkey (
          id,
          name,
          village,
          district,
          state,
          average_rating,
          trust_score
        )
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async getCropPosts(filters?: {
    status?: string;
    farmer_id?: string;
    crop_name?: string;
    variety_id?: string;
    state?: string;
    district?: string;
    price_min?: number;
    price_max?: number;
    certification?: string;
    limit?: number;
    offset?: number;
    search_text?: string;
  }) {
    let query = supabase
      .from('crop_posts')
      .select(`
        *,
        users!crop_posts_farmer_id_fkey (
          id,
          name,
          village,
          district,
          state,
          average_rating,
          trust_score,
          is_verified
        ),
        crop_varieties!crop_posts_variety_id_fkey (
          id,
          variety_name,
          description,
          typical_yield_per_acre
        )
      `)
      .eq('status', filters?.status || 'approved');

    if (filters?.farmer_id) {
      query = query.eq('farmer_id', filters.farmer_id);
    }

    if (filters?.crop_name) {
      query = query.ilike('crop_name', `%${filters.crop_name}%`);
    }

    if (filters?.variety_id) {
      query = query.eq('variety_id', filters.variety_id);
    }

    if (filters?.state) {
      query = query.eq('location->>state', filters.state);
    }

    if (filters?.district) {
      query = query.eq('location->>district', filters.district);
    }

    if (filters?.price_min) {
      query = query.gte('price_per_unit', filters.price_min);
    }

    if (filters?.price_max) {
      query = query.lte('price_per_unit', filters.price_max);
    }

    if (filters?.certification) {
      query = query.contains('certifications', [filters.certification]);
    }

    if (filters?.search_text) {
      query = query.or(`crop_name.ilike.%${filters.search_text}%,description.ilike.%${filters.search_text}%,title.ilike.%${filters.search_text}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Advanced search function
  static async searchCrops(searchParams: {
    search_text?: string;
    category_filter?: string;
    price_min?: number;
    price_max?: number;
    location_filter?: string;
    certification_filter?: string;
    limit?: number;
    offset?: number;
  }) {
    const { data, error } = await supabase.rpc('search_crops', {
      search_text: searchParams.search_text || '',
      category_filter: searchParams.category_filter || null,
      price_min: searchParams.price_min || null,
      price_max: searchParams.price_max || null,
      location_filter: searchParams.location_filter || null,
      certification_filter: searchParams.certification_filter || null,
      limit_count: searchParams.limit || 20,
      offset_count: searchParams.offset || 0
    });

    if (error) throw error;
    return data;
  }

  static async updateCropPostStatus(id: string, status: string, admin_id?: string, notes?: string) {
    const updates: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };

    if (admin_id) {
      updates.reviewed_by = admin_id;
      updates.reviewed_at = new Date().toISOString();
    }

    if (notes) {
      updates.moderation_notes = notes;
    }

    const { data, error } = await supabase
      .from('crop_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async incrementCropPostViews(id: string) {
    const { data, error } = await supabase
      .from('crop_posts')
      .update({ view_count: supabase.raw('view_count + 1') })
      .eq('id', id)
      .select('view_count')
      .single();

    if (error) throw error;
    return data;
  }

  // Enhanced deal operations
  static async createDeal(dealData: any) {
    const { data, error } = await supabase
      .from('deals')
      .insert([dealData])
      .select(`
        *,
        crop_posts (
          id,
          crop_name,
          variety_name,
          images,
          location,
          price_per_unit,
          quantity
        ),
        users!deals_buyer_id_fkey (
          id,
          name,
          phone,
          organization_details
        ),
        users!deals_farmer_id_fkey (
          id,
          name,
          phone,
          village,
          district,
          state
        )
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async getDealsByUser(user_id: string, role: 'farmer' | 'buyer') {
    const column = role === 'farmer' ? 'farmer_id' : 'buyer_id';
    
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        crop_posts (
          id,
          crop_name,
          variety_name,
          images,
          location,
          primary_image_url
        ),
        users!deals_buyer_id_fkey (
          id,
          name,
          phone,
          organization_details
        ),
        users!deals_farmer_id_fkey (
          id,
          name,
          phone,
          village,
          district,
          state
        )
      `)
      .eq(column, user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateDealStatus(id: string, status: string, message?: string, user_id?: string) {
    const updates: any = { 
      status, 
      updated_at: new Date().toISOString(),
      status_history: supabase.raw(`status_history || '[{"status": "${status}", "timestamp": "${new Date().toISOString()}", "user_id": "${user_id}"}]'::jsonb`)
    };

    if (message && user_id) {
      // Determine if it's from farmer or buyer based on user_id
      const deal = await supabase.from('deals').select('farmer_id, buyer_id').eq('id', id).single();
      if (deal.data) {
        if (deal.data.farmer_id === user_id) {
          updates.farmer_message = message;
        } else if (deal.data.buyer_id === user_id) {
          updates.buyer_message = message;
        }
      }
    }

    const { data, error } = await supabase
      .from('deals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Enhanced message operations
  static async createMessage(messageData: any) {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select(`
        *,
        users!messages_sender_id_fkey (
          id,
          name,
          role,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async getMessagesByDeal(deal_id: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        users!messages_sender_id_fkey (
          id,
          name,
          role,
          avatar_url
        )
      `)
      .eq('deal_id', deal_id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Enhanced analytics operations using database functions
  static async getFarmerStats(user_id: string) {
    const { data, error } = await supabase.rpc('get_farmer_stats', {
      farmer_uuid: user_id
    });

    if (error) throw error;
    return data;
  }

  static async getBuyerStats(user_id: string) {
    const { data, error } = await supabase.rpc('get_buyer_stats', {
      buyer_uuid: user_id
    });

    if (error) throw error;
    return data;
  }

  static async getAdminStats() {
    const { data, error } = await supabase.rpc('get_admin_stats');

    if (error) throw error;
    return data;
  }

  // Image and media operations
  static async uploadImage(file: Buffer, fileName: string, bucket: string = 'crop-images', metadata?: any) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType: 'image/jpeg',
        upsert: true,
        metadata: metadata
      });

    if (error) throw error;
    return data;
  }

  static async getImageUrl(fileName: string, bucket: string = 'crop-images') {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  static async deleteImage(fileName: string, bucket: string = 'crop-images') {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;
    return true;
  }

  // Image metadata operations
  static async createImageMetadata(metadata: any) {
    const { data, error } = await supabase
      .from('image_metadata')
      .insert([metadata])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getImageMetadata(crop_post_id?: string, deal_id?: string) {
    let query = supabase
      .from('image_metadata')
      .select('*');

    if (crop_post_id) {
      query = query.eq('crop_post_id', crop_post_id);
    }

    if (deal_id) {
      query = query.eq('deal_id', deal_id);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  // User feedback operations
  static async createFeedback(feedbackData: any) {
    const { data, error } = await supabase
      .from('user_feedback')
      .insert([feedbackData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getFeedbackByUser(user_id: string) {
    const { data, error } = await supabase
      .from('user_feedback')
      .select(`
        *,
        users!user_feedback_from_user_id_fkey (
          id,
          name,
          avatar_url
        ),
        deals (
          id,
          crop_posts (
            crop_name,
            variety_name
          )
        )
      `)
      .eq('to_user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Notification operations
  static async createNotification(notificationData: any) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notificationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getNotificationsByUser(user_id: string, limit: number = 20) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  static async markNotificationAsRead(notification_id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', notification_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Crop categories and varieties
  static async getCropCategories() {
    const { data, error } = await supabase
      .from('crop_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getCropVarieties(category_id?: string) {
    let query = supabase
      .from('crop_varieties')
      .select('*')
      .eq('is_active', true);

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    const { data, error } = await query.order('crop_name', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Search history tracking
  static async trackSearch(searchData: any) {
    const { data, error } = await supabase
      .from('search_history')
      .insert([searchData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Real-time subscriptions
  static subscribeToDealMessages(deal_id: string, callback: (payload: any) => void) {
    return supabase
      .channel(`deal-messages-${deal_id}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `deal_id=eq.${deal_id}`
        }, 
        callback
      )
      .subscribe();
  }

  static subscribeToNotifications(user_id: string, callback: (payload: any) => void) {
    return supabase
      .channel(`notifications-${user_id}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user_id}`
        }, 
        callback
      )
      .subscribe();
  }
}

export default AdvancedSupabaseService;
