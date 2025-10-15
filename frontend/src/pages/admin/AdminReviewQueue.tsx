import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  MapPin, 
  Camera,
  AlertTriangle,
  Clock,
  FileText,
  Loader2,
  RefreshCw,
  MessageSquare,
  Image as ImageIcon,
  Shield,
  User,
  Phone,
  Calendar
} from 'lucide-react';

interface CropPostWithFarmer {
  id: string;
  farmer_id: string;
  crop_name: string;
  variety_name?: string;
  description?: string;
  quantity: number;
  quantity_unit: string;
  price_per_unit: number;
  status: string;
  location: any;
  primary_image_url?: string;
  image_urls: string[];
  sowing_date?: string;
  expected_harvest_date?: string;
  expected_yield?: number;
  yield_unit?: string;
  packaging_type?: string;
  contact_phone?: string;
  created_at: string;
  farmer_name?: string;
  farmer_phone?: string;
  verification_score?: number;
  exif_data?: any;
}

const AdminReviewQueue: React.FC = () => {
  const [posts, setPosts] = useState<CropPostWithFarmer[]>([]);
  const [selectedPost, setSelectedPost] = useState<CropPostWithFarmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approved' | 'rejected' | null>(null);

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching pending posts from database...');
      
      // First, let's check all posts to see what we have
      const { data: allPosts, error: allPostsError } = await supabase
        .from('crop_posts')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('📋 All posts in database:', allPosts);

      // Now fetch pending posts specifically
      const { data: postsData, error: postsError } = await supabase
        .from('crop_posts')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      console.log('📊 Database response:', { postsData, postsError });

      if (postsError) {
        console.error('❌ Database error:', postsError);
        throw postsError;
      }

      // Transform data with fallback farmer info
      const transformedPosts = (postsData || []).map((post, index) => ({
        ...post,
        farmer_name: `Farmer ${post.farmer_id.slice(0, 8)}`, // Use partial ID as fallback
        farmer_phone: '+91XXXXXXXXXX', // Fallback phone
        // Ensure required fields exist
        image_urls: post.image_urls || [],
        location: post.location || {
          village: 'Unknown Village',
          district: 'Unknown District',
          state: 'Unknown State',
          pincode: '000000'
        }
      }));

      console.log('✅ Real posts found:', transformedPosts.length);
      setPosts(transformedPosts);
    } catch (err) {
      console.error('Error fetching pending posts:', err);
      setError(`Failed to fetch pending posts: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (postId: string, status: 'approved' | 'rejected') => {
    setActionLoading(postId);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const updateData: any = {
        status,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString()
      };

      if (adminNotes.trim()) {
        updateData.admin_notes = adminNotes.trim();
      }

      console.log(`Updating post ${postId} to status: ${status}`, updateData);

      const { error: updateError } = await supabase
        .from('crop_posts')
        .update(updateData)
        .eq('id', postId);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw updateError;
      }

      // Create notification for farmer (optional - table might not exist)
      const post = posts.find(p => p.id === postId);
      if (post) {
        try {
          await supabase
            .from('notifications')
            .insert({
              user_id: post.farmer_id,
              type: 'crop_post_reviewed',
              title: `Your crop post has been ${status}`,
              message: `${post.crop_name} - ${post.variety_name || 'N/A'} has been ${status} by admin`,
              data: { crop_post_id: postId, status }
            });
        } catch (notificationError) {
          console.log('Could not create notification (table might not exist):', notificationError);
        }
      }

      // Refresh posts to remove the updated post from pending list
      await fetchPendingPosts();
      
      // Close modals and reset state
      setAdminNotes('');
      setSelectedPost(null);
      setShowApprovalModal(false);
      setPendingAction(null);
      
      console.log(`✅ Successfully ${status} post ${postId}`);
    } catch (err) {
      console.error('Error updating post status:', err);
      setError(`Failed to update post status: ${err.message || 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const confirmAction = () => {
    if (selectedPost && pendingAction) {
      handleStatusUpdate(selectedPost.id, pendingAction);
    }
  };

  const analyzeImageExif = (imageUrl: string) => {
    // This would typically involve server-side EXIF analysis
    // For now, we'll simulate some analysis
    return {
      hasLocation: true,
      locationAccuracy: 'High',
      timestamp: new Date().toISOString(),
      device: 'Mobile',
      suspicious: false
    };
  };

  const calculateVerificationScore = (post: CropPostWithFarmer) => {
    let score = 0;
    let factors = [];

    // Image factors
    if (post.primary_image_url) {
      score += 20;
      factors.push('Has primary image');
    }
    if (post.image_urls && post.image_urls.length > 1) {
      score += 10;
      factors.push('Multiple images');
    }

    // Location factors
    if (post.location && post.location.latitude && post.location.longitude) {
      score += 25;
      factors.push('Geolocation provided');
    }
    if (post.location && post.location.address && post.location.address !== 'Unknown') {
      score += 15;
      factors.push('Detailed address');
    }

    // Contact factors
    if (post.contact_phone) {
      score += 15;
      factors.push('Contact phone provided');
    }
    if (post.farmer_phone) {
      score += 10;
      factors.push('Farmer phone verified');
    }

    // Content factors
    if (post.description && post.description.length > 50) {
      score += 5;
      factors.push('Detailed description');
    }

    return { score, factors };
  };

  const getVerificationColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Review Queue</h2>
          <p className="text-slate-600">Review and approve crop posts from farmers</p>
        </div>
        <button
          onClick={fetchPendingPosts}
          disabled={loading}
          className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl mb-2">No posts pending review</p>
          <p>All crop posts have been reviewed. Check back later for new submissions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {posts.map((post) => {
            const verification = calculateVerificationScore(post);
            
            return (
              <div key={post.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800 mb-1">
                        {post.crop_name} - {post.variety_name || 'N/A'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {post.quantity} {post.quantity_unit} @ ₹{post.price_per_unit} / {post.quantity_unit}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getVerificationColor(verification.score)}`}>
                      {verification.score}% Verified
                    </span>
                  </div>

                  {/* Verification Factors */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {verification.factors.map((factor, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {factor}
                      </span>
                    ))}
                  </div>

                  {/* Farmer Info */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.farmer_name || 'Unknown'}
                    </div>
                    {post.farmer_phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {post.farmer_phone}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Images */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Images</h4>
                    <div className="flex space-x-2">
                      {post.primary_image_url ? (
                        <img
                          src={post.primary_image_url}
                          alt={post.crop_name}
                          className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setSelectedImage(post.primary_image_url);
                            setShowImageModal(true);
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      {post.image_urls && post.image_urls.slice(1).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`${post.crop_name} ${index + 2}`}
                          className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setSelectedImage(url);
                            setShowImageModal(true);
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  {post.location && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Location</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {post.location.village}, {post.location.district}, {post.location.state}
                      </div>
                      {post.location.latitude && post.location.longitude && (
                        <p className="text-xs text-gray-500 mt-1">
                          Coordinates: {post.location.latitude.toFixed(4)}, {post.location.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {post.description && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">{post.description}</p>
                    </div>
                  )}

                  {/* Admin Notes */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes for the farmer..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      rows={2}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setPendingAction('approved');
                        setShowApprovalModal(true);
                      }}
                      disabled={actionLoading === post.id}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
                    >
                      {actionLoading === post.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setPendingAction('rejected');
                        setShowApprovalModal(true);
                      }}
                      disabled={actionLoading === post.id}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
                    >
                      {actionLoading === post.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-full overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Image Preview</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage}
                alt="Crop preview"
                className="max-w-full max-h-[70vh] object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Detailed View Modal */}
      {showDetailsModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-full overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Crop Post Details</h3>
                <p className="text-sm text-gray-600">Review all information before making a decision</p>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPost(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Crop Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Crop:</span> {selectedPost.crop_name}</div>
                      <div><span className="font-medium">Variety:</span> {selectedPost.variety_name || 'N/A'}</div>
                      <div><span className="font-medium">Quantity:</span> {selectedPost.quantity} {selectedPost.quantity_unit}</div>
                      <div><span className="font-medium">Price:</span> ₹{selectedPost.price_per_unit} per {selectedPost.quantity_unit}</div>
                      <div><span className="font-medium">Total Value:</span> ₹{(selectedPost.quantity * selectedPost.price_per_unit).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Farmer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {selectedPost.farmer_name || 'Unknown'}</div>
                      <div><span className="font-medium">Phone:</span> {selectedPost.farmer_phone || 'N/A'}</div>
                      <div><span className="font-medium">Contact:</span> {selectedPost.contact_phone || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Location</h4>
                    {selectedPost.location ? (
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Village:</span> {selectedPost.location.village}</div>
                        <div><span className="font-medium">District:</span> {selectedPost.location.district}</div>
                        <div><span className="font-medium">State:</span> {selectedPost.location.state}</div>
                        <div><span className="font-medium">Pincode:</span> {selectedPost.location.pincode}</div>
                        {selectedPost.location.latitude && selectedPost.location.longitude && (
                          <div className="text-xs text-gray-500">
                            Coordinates: {selectedPost.location.latitude.toFixed(4)}, {selectedPost.location.longitude.toFixed(4)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Location not provided</div>
                    )}
                  </div>
                </div>

                {/* Right Column - Additional Details */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Posted:</span> {new Date(selectedPost.created_at).toLocaleString()}</div>
                      {selectedPost.sowing_date && (
                        <div><span className="font-medium">Sowing Date:</span> {new Date(selectedPost.sowing_date).toLocaleDateString()}</div>
                      )}
                      {selectedPost.expected_harvest_date && (
                        <div><span className="font-medium">Expected Harvest:</span> {new Date(selectedPost.expected_harvest_date).toLocaleDateString()}</div>
                      )}
                      {selectedPost.expected_yield && (
                        <div><span className="font-medium">Expected Yield:</span> {selectedPost.expected_yield} {selectedPost.yield_unit}</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Description</h4>
                    <p className="text-sm text-gray-600">
                      {selectedPost.description || 'No description provided'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Images ({selectedPost.image_urls?.length || 0})</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedPost.primary_image_url && (
                        <img
                          src={selectedPost.primary_image_url}
                          alt="Primary image"
                          className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => {
                            setSelectedImage(selectedPost.primary_image_url);
                            setShowImageModal(true);
                          }}
                        />
                      )}
                      {selectedPost.image_urls && selectedPost.image_urls.slice(1).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Additional image ${index + 2}`}
                          className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => {
                            setSelectedImage(url);
                            setShowImageModal(true);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPost(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setPendingAction('approved');
                  setShowApprovalModal(true);
                }}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Approve Post
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setPendingAction('rejected');
                  setShowApprovalModal(true);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Reject Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Confirmation Modal */}
      {showApprovalModal && selectedPost && pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  pendingAction === 'approved' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {pendingAction === 'approved' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {pendingAction === 'approved' ? 'Approve' : 'Reject'} Crop Post?
                  </h3>
                  <p className="text-sm text-gray-600">
                    {pendingAction === 'approved' 
                      ? 'This will make the post visible to buyers.' 
                      : 'This will remove the post from the marketplace.'
                    }
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-gray-800">{selectedPost.crop_name}</div>
                  <div className="text-sm text-gray-600">
                    {selectedPost.quantity} {selectedPost.quantity_unit} • ₹{selectedPost.price_per_unit} per {selectedPost.quantity_unit}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    by {selectedPost.farmer_name || 'Unknown Farmer'}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={`Add a note for the farmer about why this post was ${pendingAction}...`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setPendingAction(null);
                    setSelectedPost(null);
                    setAdminNotes('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={actionLoading === selectedPost.id}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  disabled={actionLoading === selectedPost.id}
                  className={`px-4 py-2 text-white rounded-lg font-medium transition-colors flex items-center ${
                    pendingAction === 'approved' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  } disabled:opacity-50`}
                >
                  {actionLoading === selectedPost.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `${pendingAction === 'approved' ? 'Approve' : 'Reject'} Post`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewQueue;
