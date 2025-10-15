import { supabase } from '../lib/supabase';

export interface AdminStats {
  total_posts: number;
  pending_posts: number;
  approved_posts: number;
  rejected_posts: number;
  active_farmers: number;
  farmers_with_approved_posts: number;
  total_deals: number;
  completed_deals: number;
  total_revenue: number;
  recent_activity: any[];
}

export interface VerificationData {
  hasLocation: boolean;
  locationAccuracy: string;
  timestamp: string;
  device: string;
  suspicious: boolean;
  exifData?: any;
}

// Get comprehensive admin dashboard statistics
export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    // Fetch basic stats
    const [postsResult, usersResult, dealsResult] = await Promise.all([
      supabase.from('crop_posts').select('status, created_at'),
      supabase.from('user_profiles').select('role, created_at'),
      supabase.from('deals').select('status, offer_price, created_at').limit(100)
    ]);

    // Calculate stats
    const posts = postsResult.data || [];
    const users = usersResult.data || [];
    const deals = dealsResult.data || [];

    const stats: AdminStats = {
      total_posts: posts.length,
      pending_posts: posts.filter(p => p.status === 'pending').length,
      approved_posts: posts.filter(p => p.status === 'approved').length,
      rejected_posts: posts.filter(p => p.status === 'rejected').length,
      active_farmers: users.filter(u => u.role === 'farmer').length,
      farmers_with_approved_posts: 0, // Will calculate separately
      total_deals: deals.length,
      completed_deals: deals.filter(d => d.status === 'completed').length,
      total_revenue: deals
        .filter(d => d.status === 'completed')
        .reduce((sum, d) => sum + (d.offer_price || 0), 0),
      recent_activity: []
    };

    // Calculate farmers with approved posts
    const farmersWithApprovedPosts = await supabase
      .from('crop_posts')
      .select('farmer_id')
      .eq('status', 'approved');

    stats.farmers_with_approved_posts = 
      new Set(farmersWithApprovedPosts.data?.map(p => p.farmer_id) || []).size;

    // Generate recent activity
    stats.recent_activity = await generateRecentActivity();

    return stats;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};

// Generate recent activity feed
export const generateRecentActivity = async (): Promise<any[]> => {
  try {
    const activities: any[] = [];
    
    // Recent posts
    const { data: recentPosts } = await supabase
      .from('crop_posts')
      .select('id, crop_name, status, created_at, farmer_id')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentPosts) {
      for (const post of recentPosts) {
        const { data: farmer } = await supabase
          .from('user_profiles')
          .select('name')
          .eq('id', post.farmer_id)
          .single();

        activities.push({
          id: `post-${post.id}`,
          type: 'post_created',
          description: `New ${post.status} post: ${post.crop_name} by ${farmer?.name || 'Unknown'}`,
          timestamp: post.created_at,
          user_name: farmer?.name
        });
      }
    }

    // Recent deals
    const { data: recentDeals } = await supabase
      .from('deals')
      .select('id, status, offer_price, created_at, farmer_id, buyer_id')
      .order('created_at', { ascending: false })
      .limit(3);

    if (recentDeals) {
      for (const deal of recentDeals) {
        const [farmerResult, buyerResult] = await Promise.all([
          supabase.from('user_profiles').select('name').eq('id', deal.farmer_id).single(),
          supabase.from('user_profiles').select('name').eq('id', deal.buyer_id).single()
        ]);

        activities.push({
          id: `deal-${deal.id}`,
          type: 'deal_created',
          description: `New deal: ₹${deal.offer_price} between ${farmerResult.data?.name || 'Unknown'} and ${buyerResult.data?.name || 'Unknown'}`,
          timestamp: deal.created_at,
          user_name: buyerResult.data?.name
        });
      }
    }

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);
  } catch (err) {
    console.error('Error generating recent activity:', err);
    return [];
  }
};

// Get pending posts for review with farmer details
export const getPendingPostsForReview = async () => {
  try {
    const { data, error } = await supabase
      .from('crop_posts')
      .select(`
        *,
        farmer:farmer_id (
          name,
          phone
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform data to match our interface
    const transformedPosts = data?.map(post => ({
      ...post,
      farmer_name: post.farmer?.name,
      farmer_phone: post.farmer?.phone
    })) || [];

    return { data: transformedPosts, error: null };
  } catch (error) {
    console.error('Error fetching pending posts:', error);
    return { data: [], error };
  }
};

// Update crop post status with admin notes
export const updateCropPostStatusWithNotes = async (
  postId: string,
  status: 'approved' | 'rejected',
  adminNotes?: string
): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        message: 'User not authenticated',
        error: 'Authentication required'
      };
    }

    const updateData: any = {
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString()
    };

    if (adminNotes && adminNotes.trim()) {
      updateData.admin_notes = adminNotes.trim();
    }

    const { error: updateError } = await supabase
      .from('crop_posts')
      .update(updateData)
      .eq('id', postId);

    if (updateError) {
      throw updateError;
    }

    // Create notification for farmer
    const { data: postData } = await supabase
      .from('crop_posts')
      .select('farmer_id, crop_name, variety_name')
      .eq('id', postId)
      .single();

    if (postData) {
      await supabase
        .from('notifications')
        .insert({
          user_id: postData.farmer_id,
          type: 'crop_post_reviewed',
          title: `Your crop post has been ${status}`,
          message: `${postData.crop_name} - ${postData.variety_name || 'N/A'} has been ${status} by admin${adminNotes ? '. Notes: ' + adminNotes : ''}`,
          data: { crop_post_id: postId, status, admin_notes: adminNotes }
        });
    }

    return {
      success: true,
      message: `Crop post ${status} successfully`
    };
  } catch (error) {
    console.error('Error updating crop post status:', error);
    return {
      success: false,
      message: 'Failed to update crop post status',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Analyze image for verification (placeholder for ML analysis)
export const analyzeImageForVerification = async (imageUrl: string): Promise<VerificationData> => {
  try {
    // This would typically involve server-side ML analysis
    // For now, we'll return mock data based on basic checks
    
    // Simulate EXIF analysis
    const hasLocation = Math.random() > 0.3; // 70% chance of having location
    const suspicious = Math.random() < 0.1; // 10% chance of being suspicious
    
    return {
      hasLocation,
      locationAccuracy: hasLocation ? (Math.random() > 0.5 ? 'High' : 'Medium') : 'None',
      timestamp: new Date().toISOString(),
      device: Math.random() > 0.5 ? 'Mobile' : 'Desktop',
      suspicious,
      exifData: hasLocation ? {
        latitude: 12.9716 + (Math.random() - 0.5) * 0.1,
        longitude: 77.5946 + (Math.random() - 0.5) * 0.1,
        timestamp: new Date().toISOString()
      } : null
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      hasLocation: false,
      locationAccuracy: 'None',
      timestamp: new Date().toISOString(),
      device: 'Unknown',
      suspicious: true
    };
  }
};

// Calculate verification score for a crop post
export const calculateVerificationScore = (post: any): { score: number; factors: string[] } => {
  let score = 0;
  let factors: string[] = [];

  // Image factors (40 points total)
  if (post.primary_image_url) {
    score += 20;
    factors.push('Has primary image');
  }
  if (post.image_urls && post.image_urls.length > 1) {
    score += 10;
    factors.push('Multiple images');
  }
  if (post.image_urls && post.image_urls.length > 2) {
    score += 10;
    factors.push('Comprehensive photos');
  }

  // Location factors (25 points total)
  if (post.location && post.location.latitude && post.location.longitude) {
    score += 25;
    factors.push('Geolocation provided');
  } else if (post.location && post.location.address && post.location.address !== 'Unknown') {
    score += 15;
    factors.push('Address provided');
  }

  // Contact factors (20 points total)
  if (post.contact_phone) {
    score += 15;
    factors.push('Contact phone provided');
  }
  if (post.farmer_phone) {
    score += 5;
    factors.push('Farmer phone verified');
  }

  // Content factors (15 points total)
  if (post.description && post.description.length > 50) {
    score += 10;
    factors.push('Detailed description');
  }
  if (post.variety_name) {
    score += 5;
    factors.push('Crop variety specified');
  }

  return { score, factors };
};

// Get rejected posts for re-evaluation
export const getRejectedPostsForReevaluation = async () => {
  try {
    const { data, error } = await supabase
      .from('crop_posts')
      .select(`
        *,
        farmer:farmer_id (
          name,
          phone
        )
      `)
      .eq('status', 'rejected')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const transformedPosts = data?.map(post => ({
      ...post,
      farmer_name: post.farmer?.name,
      farmer_phone: post.farmer?.phone
    })) || [];

    return { data: transformedPosts, error: null };
  } catch (error) {
    console.error('Error fetching rejected posts:', error);
    return { data: [], error };
  }
};

// Send bulk notifications to users
export const sendBulkNotification = async (
  userIds: string[],
  title: string,
  message: string,
  type: string = 'general',
  data?: any
): Promise<{ success: boolean; message: string }> => {
  try {
    const notifications = userIds.map(userId => ({
      user_id: userId,
      type,
      title,
      message,
      data: data || {}
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: `Notifications sent to ${userIds.length} users`
    };
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    return {
      success: false,
      message: 'Failed to send notifications'
    };
  }
};
