-- Smart Agriculture Exchange - Crop Posts Database Schema
-- This schema handles farmer crop posts, admin reviews, and buyer visibility

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create crop_posts table for storing farmer crop listings
CREATE TABLE IF NOT EXISTS crop_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic crop information
    crop_name VARCHAR(100) NOT NULL,
    variety_name VARCHAR(100),
    crop_type VARCHAR(50) NOT NULL,
    description TEXT,
    
    -- Planting and harvest information
    sowing_date DATE,
    expected_harvest_date DATE,
    expected_yield DECIMAL(10,2),
    yield_unit VARCHAR(20) DEFAULT 'kg/acre',
    
    -- Pricing and quantity
    quantity DECIMAL(10,2) NOT NULL,
    quantity_unit VARCHAR(20) NOT NULL DEFAULT 'quintals',
    price_per_unit DECIMAL(10,2) NOT NULL,
    min_price DECIMAL(10,2),
    packaging_type VARCHAR(50) DEFAULT 'bulk',
    
    -- Contact information
    contact_phone VARCHAR(20),
    
    -- Location information
    location JSONB NOT NULL, -- {village, district, state, pincode, address, latitude, longitude}
    
    -- Images
    primary_image_url TEXT,
    image_urls TEXT[] DEFAULT '{}',
    
    -- Status and review
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sold', 'expired', 'withdrawn')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_crop_posts_farmer_id ON crop_posts(farmer_id);
CREATE INDEX IF NOT EXISTS idx_crop_posts_status ON crop_posts(status);
CREATE INDEX IF NOT EXISTS idx_crop_posts_crop_name ON crop_posts USING gin(crop_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_crop_posts_location ON crop_posts USING gin(location);
CREATE INDEX IF NOT EXISTS idx_crop_posts_created_at ON crop_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crop_posts_harvest_date ON crop_posts(expected_harvest_date);

-- Create user_profiles table to store additional user information
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'buyer', 'admin')),
    phone VARCHAR(20),
    location JSONB, -- {village, district, state, pincode, address}
    bio TEXT,
    profile_image_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON user_profiles USING gin(location);

-- Create orders table for buyer-farmer transactions
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_post_id UUID NOT NULL REFERENCES crop_posts(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Order details
    quantity DECIMAL(10,2) NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    
    -- Order status
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    
    -- Delivery information
    delivery_address JSONB,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    
    -- Payment information
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_crop_post_id ON orders(crop_post_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_farmer_id ON orders(farmer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create messages table for communication between users
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_order_id ON messages(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Create reviews table for rating system
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_crop_posts_updated_at BEFORE UPDATE ON crop_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'farmer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to get crop posts with farmer details
CREATE OR REPLACE FUNCTION get_crop_posts_with_farmer(
    post_status VARCHAR DEFAULT NULL,
    limit_count INTEGER DEFAULT 50,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    post_id UUID,
    farmer_name VARCHAR,
    farmer_phone VARCHAR,
    crop_name VARCHAR,
    variety_name VARCHAR,
    quantity DECIMAL,
    quantity_unit VARCHAR,
    price_per_unit DECIMAL,
    location JSONB,
    primary_image_url TEXT,
    status VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cp.id as post_id,
        up.name as farmer_name,
        up.phone as farmer_phone,
        cp.crop_name,
        cp.variety_name,
        cp.quantity,
        cp.quantity_unit,
        cp.price_per_unit,
        cp.location,
        cp.primary_image_url,
        cp.status,
        cp.created_at
    FROM crop_posts cp
    JOIN user_profiles up ON cp.farmer_id = up.id
    WHERE (post_status IS NULL OR cp.status = post_status)
    ORDER BY cp.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security (RLS)
ALTER TABLE crop_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for crop_posts
CREATE POLICY "Users can view approved crop posts" ON crop_posts
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Farmers can view their own crop posts" ON crop_posts
    FOR SELECT USING (auth.uid() = farmer_id);

CREATE POLICY "Admins can view all crop posts" ON crop_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Farmers can insert their own crop posts" ON crop_posts
    FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own pending crop posts" ON crop_posts
    FOR UPDATE USING (
        auth.uid() = farmer_id AND status = 'pending'
    );

CREATE POLICY "Admins can update any crop post status" ON crop_posts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view all user profiles" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

CREATE POLICY "Buyers can create orders" ON orders
    FOR INSERT WITH CHECK (
        auth.uid() = buyer_id AND
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'buyer'
        )
    );

-- Create RLS policies for messages
CREATE POLICY "Users can view messages they sent or received" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Note: Demo user profiles will be created automatically when users register
-- through the handle_new_user() trigger function

-- Create storage bucket for crop images
INSERT INTO storage.buckets (id, name, public) VALUES ('crop-images', 'crop-images', true);

-- Create storage policies
CREATE POLICY "Anyone can view crop images" ON storage.objects
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
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create view for admin dashboard statistics
CREATE VIEW admin_dashboard_stats AS
SELECT 
    COUNT(*) as total_posts,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_posts,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_posts,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_posts,
    COUNT(DISTINCT farmer_id) as active_farmers,
    COUNT(DISTINCT CASE WHEN status = 'approved' THEN farmer_id END) as farmers_with_approved_posts
FROM crop_posts;

-- Grant access to the view
GRANT SELECT ON admin_dashboard_stats TO authenticated;

COMMENT ON TABLE crop_posts IS 'Stores crop posts created by farmers';
COMMENT ON TABLE user_profiles IS 'Extended user profiles with role and location information';
COMMENT ON TABLE orders IS 'Orders placed by buyers for crop posts';
COMMENT ON TABLE messages IS 'Messages between users';
COMMENT ON TABLE reviews IS 'Reviews and ratings for completed orders';
COMMENT ON TABLE notifications IS 'System notifications for users';
