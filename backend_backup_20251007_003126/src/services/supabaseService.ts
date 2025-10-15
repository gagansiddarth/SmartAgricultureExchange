import { supabase, Database } from '../config/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export class SupabaseService {
  // User operations
  static async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserByPhone(phone: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateUser(id: string, updates: Database['public']['Tables']['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Crop post operations
  static async createCropPost(postData: Database['public']['Tables']['crop_posts']['Insert']) {
    const { data, error } = await supabase
      .from('crop_posts')
      .insert([postData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getCropPosts(filters?: {
    status?: string;
    farmer_id?: string;
    crop_name?: string;
    state?: string;
    limit?: number;
    offset?: number;
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
          state
        )
      `)
      .eq('status', filters?.status || 'approved');

    if (filters?.farmer_id) {
      query = query.eq('farmer_id', filters.farmer_id);
    }

    if (filters?.crop_name) {
      query = query.ilike('crop_name', `%${filters.crop_name}%`);
    }

    if (filters?.state) {
      query = query.eq('location->>state', filters.state);
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

  static async updateCropPostStatus(id: string, status: string, admin_id?: string) {
    const { data, error } = await supabase
      .from('crop_posts')
      .update({ 
        status, 
        updated_at: new Date().toISOString(),
        ...(admin_id && { reviewed_by: admin_id })
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Deal operations
  static async createDeal(dealData: Database['public']['Tables']['deals']['Insert']) {
    const { data, error } = await supabase
      .from('deals')
      .insert([dealData])
      .select()
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
          variety,
          images,
          location
        ),
        users!deals_buyer_id_fkey (
          id,
          name,
          phone
        ),
        users!deals_farmer_id_fkey (
          id,
          name,
          phone
        )
      `)
      .eq(column, user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateDealStatus(id: string, status: string, message?: string) {
    const updates: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };

    if (message) {
      updates.farmer_message = message;
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

  // Message operations
  static async createMessage(messageData: Database['public']['Tables']['messages']['Insert']) {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
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
          role
        )
      `)
      .eq('deal_id', deal_id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Analytics operations
  static async getDashboardStats(user_id: string, role: 'farmer' | 'buyer' | 'admin') {
    const stats: any = {};

    if (role === 'farmer') {
      const [cropPostsResult, dealsResult] = await Promise.all([
        supabase
          .from('crop_posts')
          .select('status, quantity, price_per_unit')
          .eq('farmer_id', user_id),
        supabase
          .from('deals')
          .select('status, total_amount')
          .eq('farmer_id', user_id)
      ]);

      stats.active_harvests = cropPostsResult.data?.filter(p => p.status === 'approved').length || 0;
      stats.total_revenue = dealsResult.data?.reduce((sum, d) => sum + (d.total_amount || 0), 0) || 0;
    }

    if (role === 'buyer') {
      const dealsResult = await supabase
        .from('deals')
        .select('status, total_amount')
        .eq('buyer_id', user_id);

      stats.active_orders = dealsResult.data?.filter(d => d.status === 'accepted').length || 0;
      stats.total_spent = dealsResult.data?.reduce((sum, d) => sum + (d.total_amount || 0), 0) || 0;
    }

    if (role === 'admin') {
      const [pendingReviewsResult, totalUsersResult, activeDealsResult] = await Promise.all([
        supabase
          .from('crop_posts')
          .select('id')
          .eq('status', 'pending'),
        supabase
          .from('users')
          .select('id'),
        supabase
          .from('deals')
          .select('id, total_amount')
          .eq('status', 'accepted')
      ]);

      stats.pending_reviews = pendingReviewsResult.data?.length || 0;
      stats.total_users = totalUsersResult.data?.length || 0;
      stats.active_deals = activeDealsResult.data?.length || 0;
      stats.total_revenue = activeDealsResult.data?.reduce((sum, d) => sum + (d.total_amount || 0), 0) || 0;
    }

    return stats;
  }

  // File upload operations (using Supabase Storage)
  static async uploadImage(file: Buffer, fileName: string, bucket: string = 'crop-images') {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType: 'image/jpeg',
        upsert: true
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
}

export default SupabaseService;
