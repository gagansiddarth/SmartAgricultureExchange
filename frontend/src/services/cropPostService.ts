import { supabase } from '../lib/supabase';

export interface CropPost {
  id: string;
  farmer_id: string;
  crop_name: string;
  variety_name?: string;
  crop_type: string;
  description?: string;
  sowing_date?: string;
  expected_harvest_date?: string;
  expected_yield?: number;
  yield_unit: string;
  quantity: number;
  quantity_unit: string;
  price_per_unit: number;
  min_price?: number;
  packaging_type: string;
  contact_phone?: string;
  location: {
    village: string;
    district: string;
    state: string;
    pincode: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  primary_image_url?: string;
  image_urls: string[];
  status: 'pending' | 'approved' | 'rejected' | 'sold' | 'expired' | 'withdrawn';
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface CropPostWithFarmer extends CropPost {
  farmer_name: string;
  farmer_phone?: string;
}

export interface CreateCropPostData {
  cropType: string;
  variety: string;
  sowingDate: string;
  expectedHarvestDate: string;
  expectedYield: number | '';
  yieldUnit: string;
  description: string;
  minPrice: number | '';
  quantity: number | '';
  quantityUnit: string;
  packaging: string;
  contactPhone: string;
  images: File[];
  location: {
    latitude: number | null;
    longitude: number | null;
    address: string;
    village: string;
    district: string;
    state: string;
    pincode: string;
  };
}

export interface CreateCropPostResponse {
  success: boolean;
  message: string;
  data?: CropPost;
  error?: string;
}

// Upload images to Supabase Storage
const uploadImages = async (images: File[], farmerId: string): Promise<string[]> => {
  const uploadedUrls: string[] = [];
  
  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    const fileExt = file.name.split('.').pop();
    const fileName = `${farmerId}/${Date.now()}-${i}.${fileExt}`;
    
    try {
      const { data, error } = await supabase.storage
        .from('crop-images')
        .upload(fileName, file);
      
      if (error) {
        console.error('Error uploading image:', error);
        continue;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('crop-images')
        .getPublicUrl(fileName);
      
      uploadedUrls.push(urlData.publicUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  }
  
  return uploadedUrls;
};

// Create crop post in database
export const createCropPost = async (formData: CreateCropPostData): Promise<CreateCropPostResponse> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return {
        success: false,
        message: 'Please login to create crop posts',
        error: 'User not authenticated'
      };
    }

    // Upload images first (if any and if storage is available)
    let imageUrls: string[] = [];
    if (formData.images.length > 0) {
      try {
        imageUrls = await uploadImages(formData.images, user.id);
        
        if (imageUrls.length === 0) {
          console.warn('No images uploaded, but continuing with crop post creation');
        }
      } catch (imageError) {
        console.warn('Image upload failed, but continuing with crop post creation:', imageError);
        // Continue without images if upload fails
      }
    }

    // Validate required fields - handle both minPrice and expectedPrice
    const priceValue = formData.minPrice || (formData as any).expectedPrice;
    if (!priceValue || isNaN(Number(priceValue))) {
      return {
        success: false,
        message: 'Please enter a valid minimum price.',
        error: 'Invalid price'
      };
    }

    if (!formData.quantity || isNaN(Number(formData.quantity))) {
      return {
        success: false,
        message: 'Please enter a valid quantity.',
        error: 'Invalid quantity'
      };
    }

    // Prepare crop post data for new schema
    const cropPostData = {
      farmer_id: user.id,
      crop_name: formData.cropType,
      variety_name: formData.variety,
      crop_type: formData.cropType,
      description: formData.description,
      sowing_date: formData.sowingDate || (formData as any).sowDate || null,
      expected_harvest_date: formData.expectedHarvestDate || null,
      expected_yield: formData.expectedYield ? Number(formData.expectedYield) : null,
      yield_unit: formData.yieldUnit || 'kg/acre',
      quantity: Number(formData.quantity),
      quantity_unit: formData.quantityUnit || 'quintals',
      price_per_unit: Number(priceValue),
      min_price: Number(priceValue),
      packaging_type: formData.packaging || 'bulk',
      contact_phone: formData.contactPhone || (formData as any).phone || null,
      location: formData.location || {
        village: 'Unknown',
        district: 'Unknown', 
        state: 'Unknown',
        pincode: '000000',
        address: 'Unknown'
      },
      primary_image_url: imageUrls[0] || null,
      image_urls: imageUrls,
      status: 'pending' as const,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };

    console.log('Creating crop post with data:', cropPostData);

    // Insert crop post into database
    const { data, error } = await supabase
      .from('crop_posts')
      .insert([cropPostData])
      .select()
      .single();

    if (error) {
      console.error('Error creating crop post:', error);
      return {
        success: false,
        message: `Failed to create crop post: ${error.message}`,
        error: error.message
      };
    }

    // Create notification for admins
    await createNotificationForAdmins({
      type: 'new_crop_post',
      title: 'New Crop Post Requires Review',
      message: `${formData.cropType} - ${formData.variety} posted by farmer needs admin review`,
      data: { crop_post_id: data.id }
    });

    return {
      success: true,
      message: 'Crop post created successfully! It will be reviewed and approved soon.',
      data: data
    };

  } catch (error) {
    console.error('Error in createCropPost:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Get crop posts by farmer
export const getFarmerCropPosts = async (farmerId?: string): Promise<CropPost[]> => {
  try {
    let query = supabase
      .from('crop_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (farmerId) {
      query = query.eq('farmer_id', farmerId);
    } else {
      // Get current user's posts
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        query = query.eq('farmer_id', user.id);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching crop posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getFarmerCropPosts:', error);
    return [];
  }
};

// Get crop posts with farmer details using the custom function
export const getCropPostsWithFarmer = async (status?: string): Promise<CropPostWithFarmer[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_crop_posts_with_farmer', {
        post_status: status || null,
        limit_count: 100,
        offset_count: 0
      });

    if (error) {
      console.error('Error fetching crop posts with farmer:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCropPostsWithFarmer:', error);
    return [];
  }
};

// Get approved crop posts for buyers
export const getApprovedCropPosts = async (limit: number = 50, offset: number = 0): Promise<CropPostWithFarmer[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_crop_posts_with_farmer', {
        post_status: 'approved',
        limit_count: limit,
        offset_count: offset
      });

    if (error) {
      console.error('Error fetching approved crop posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getApprovedCropPosts:', error);
    return [];
  }
};

// Get pending crop posts for admin review
export const getPendingCropPosts = async (): Promise<CropPostWithFarmer[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_crop_posts_with_farmer', {
        post_status: 'pending',
        limit_count: 100,
        offset_count: 0
      });

    if (error) {
      console.error('Error fetching pending crop posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPendingCropPosts:', error);
    return [];
  }
};

// Update crop post status (admin function)
export const updateCropPostStatus = async (
  cropPostId: string, 
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

    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    const { error } = await supabase
      .from('crop_posts')
      .update(updateData)
      .eq('id', cropPostId);

    if (error) {
      console.error('Error updating crop post status:', error);
      return {
        success: false,
        message: 'Failed to update crop post status',
        error: error.message
      };
    }

    // Get farmer info for notification
    const { data: cropPostData } = await supabase
      .from('crop_posts')
      .select(`
        farmer_id,
        crop_name,
        variety_name
      `)
      .eq('id', cropPostId)
      .single();

    if (cropPostData) {
      // Create notification for farmer
      await createNotification({
        user_id: cropPostData.farmer_id,
        type: 'crop_post_reviewed',
        title: `Your crop post has been ${status}`,
        message: `${cropPostData.crop_name} - ${cropPostData.variety_name} has been ${status} by admin`,
        data: { crop_post_id: cropPostId, status }
      });
    }

    return {
      success: true,
      message: `Crop post ${status} successfully`
    };
  } catch (error) {
    console.error('Error in updateCropPostStatus:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Delete crop post
export const deleteCropPost = async (cropPostId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('crop_posts')
      .delete()
      .eq('id', cropPostId)
      .eq('farmer_id', user.id); // Ensure user can only delete their own posts

    if (error) {
      console.error('Error deleting crop post:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteCropPost:', error);
    return false;
  }
};

// Helper function to create notifications
const createNotification = async (notification: {
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
}) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert([notification]);

    if (error) {
      console.error('Error creating notification:', error);
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Helper function to create notifications for all admins
const createNotificationForAdmins = async (notification: {
  type: string;
  title: string;
  message: string;
  data?: any;
}) => {
  try {
    // Get all admin users
    const { data: admins, error: adminError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('role', 'admin');

    if (adminError || !admins) {
      console.error('Error fetching admins:', adminError);
      return;
    }

    // Create notifications for all admins
    const notifications = admins.map(admin => ({
      user_id: admin.id,
      ...notification
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      console.error('Error creating admin notifications:', error);
    }
  } catch (error) {
    console.error('Error creating admin notifications:', error);
  }
};

// Get admin dashboard statistics
export const getAdminDashboardStats = async () => {
  try {
    const { data, error } = await supabase
      .from('admin_dashboard_stats')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching admin stats:', error);
      return {
        total_posts: 0,
        pending_posts: 0,
        approved_posts: 0,
        rejected_posts: 0,
        active_farmers: 0,
        farmers_with_approved_posts: 0
      };
    }

    return data;
  } catch (error) {
    console.error('Error in getAdminDashboardStats:', error);
    return {
      total_posts: 0,
      pending_posts: 0,
      approved_posts: 0,
      rejected_posts: 0,
      active_farmers: 0,
      farmers_with_approved_posts: 0
    };
  }
};