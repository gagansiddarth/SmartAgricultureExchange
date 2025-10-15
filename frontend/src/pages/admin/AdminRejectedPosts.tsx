import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare,
  Calendar,
  User,
  MapPin,
  Package,
  DollarSign,
  AlertTriangle,
  Loader2,
  FileText,
  Image as ImageIcon,
  Clock,
  RotateCcw
} from 'lucide-react';

interface RejectedPost {
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
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
}

const AdminRejectedPosts: React.FC = () => {
  const [rejectedPosts, setRejectedPosts] = useState<RejectedPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<RejectedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReEvaluationModal, setShowReEvaluationModal] = useState(false);
  const [reEvaluationNotes, setReEvaluationNotes] = useState('');
  const [newStatus, setNewStatus] = useState<'approved' | 'pending'>('approved');

  useEffect(() => {
    fetchRejectedPosts();
  }, []);

  const fetchRejectedPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching rejected posts...');
      
      // Fetch rejected posts
      const { data: postsData, error: postsError } = await supabase
        .from('crop_posts')
        .select('*')
        .eq('status', 'rejected')
        .order('reviewed_at', { ascending: false });

      console.log('📊 Rejected posts response:', { postsData, postsError });

      if (postsError) {
        console.error('Database error:', postsError);
        throw postsError;
      }

      // Transform data with fallback farmer info
      const transformedPosts = (postsData || []).map((post, index) => ({
        ...post,
        farmer_name: `Farmer ${post.farmer_id.slice(0, 8)}`,
        farmer_phone: '+91XXXXXXXXXX',
        image_urls: post.image_urls || [],
        location: post.location || {
          village: 'Unknown Village',
          district: 'Unknown District',
          state: 'Unknown State',
          pincode: '000000'
        },
        rejection_reason: post.admin_notes || 'No reason provided'
      }));

      console.log('✅ Rejected posts found:', transformedPosts.length);
      setRejectedPosts(transformedPosts);
    } catch (err) {
      console.error('Error fetching rejected posts:', err);
      setError(`Failed to fetch rejected posts: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReEvaluate = async (postId: string) => {
    if (!selectedPost) return;

    setActionLoading(postId);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const updateData: any = {
        status: newStatus,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        admin_notes: reEvaluationNotes.trim() || null
      };

      console.log(`Re-evaluating post ${postId} to status: ${newStatus}`, updateData);

      const { error: updateError } = await supabase
        .from('crop_posts')
        .update(updateData)
        .eq('id', postId);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw updateError;
      }

      // Create notification for farmer
      try {
        await supabase
          .from('notifications')
          .insert({
            user_id: selectedPost.farmer_id,
            type: 'crop_post_reevaluated',
            title: `Your crop post has been ${newStatus === 'approved' ? 'approved' : 're-submitted for review'}`,
            message: `${selectedPost.crop_name} - ${selectedPost.variety_name || 'N/A'} has been re-evaluated by admin`,
            data: { crop_post_id: postId, status: newStatus }
          });
      } catch (notificationError) {
        console.log('Could not create notification:', notificationError);
      }

      // Refresh posts
      await fetchRejectedPosts();
      
      // Close modals and reset state
      setReEvaluationNotes('');
      setSelectedPost(null);
      setShowReEvaluationModal(false);
      setShowDetailsModal(false);
      
      console.log(`✅ Successfully re-evaluated post ${postId} to ${newStatus}`);
    } catch (err) {
      console.error('Error re-evaluating post:', err);
      setError(`Failed to re-evaluate post: ${err.message || 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const openReEvaluationModal = (post: RejectedPost) => {
    setSelectedPost(post);
    setReEvaluationNotes('');
    setNewStatus('approved');
    setShowReEvaluationModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-gray-600">Loading rejected posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rejected Posts Review</h2>
          <p className="text-slate-600">Review and re-evaluate previously rejected crop posts</p>
        </div>
        <button
          onClick={fetchRejectedPosts}
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
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rejected</p>
              <p className="text-3xl font-bold text-red-600">{rejectedPosts.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Awaiting Review</p>
              <p className="text-3xl font-bold text-orange-600">{rejectedPosts.filter(p => !p.reviewed_at).length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recently Rejected</p>
              <p className="text-3xl font-bold text-purple-600">
                {rejectedPosts.filter(p => {
                  const rejectedDate = new Date(p.reviewed_at || p.created_at);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return rejectedDate >= weekAgo;
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Rejected Posts List */}
      {rejectedPosts.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Rejected Posts</h3>
          <p className="text-gray-600">All posts are currently approved or pending review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {rejectedPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{post.crop_name}</h3>
                    {post.variety_name && (
                      <p className="text-sm text-gray-600 mb-2">{post.variety_name}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        {post.quantity} {post.quantity_unit}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ₹{post.price_per_unit}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-2">
                      <XCircle className="w-3 h-3 mr-1" />
                      Rejected
                    </span>
                    <div className="text-xs text-gray-500">
                      {new Date(post.reviewed_at || post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Rejection Reason */}
                <div className="bg-red-50 p-3 rounded-lg mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Rejection Reason</p>
                      <p className="text-sm text-red-700">{post.rejection_reason}</p>
                    </div>
                  </div>
                </div>

                {/* Farmer Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.farmer_name || 'Unknown'}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {post.location?.district}, {post.location?.state}
                  </div>
                </div>

                {/* Image Preview */}
                <div className="mb-4">
                  {post.primary_image_url ? (
                    <img
                      src={post.primary_image_url}
                      alt={post.crop_name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPost(post);
                      setShowDetailsModal(true);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  <button
                    onClick={() => openReEvaluationModal(post)}
                    disabled={actionLoading === post.id}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm disabled:opacity-50"
                  >
                    {actionLoading === post.id ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4 mr-1" />
                    )}
                    Re-evaluate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-full overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Rejected Post Details</h3>
                <p className="text-sm text-gray-600">Review all information before re-evaluation</p>
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

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-3">Rejection Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Reason:</span> {selectedPost.rejection_reason}</div>
                      <div><span className="font-medium">Rejected By:</span> {selectedPost.reviewed_by || 'Unknown'}</div>
                      <div><span className="font-medium">Rejected At:</span> {new Date(selectedPost.reviewed_at || selectedPost.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Additional Details */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Farmer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {selectedPost.farmer_name || 'Unknown'}</div>
                      <div><span className="font-medium">Phone:</span> {selectedPost.farmer_phone || 'N/A'}</div>
                      <div><span className="font-medium">Contact:</span> {selectedPost.contact_phone || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Description</h4>
                    <p className="text-sm text-gray-600">
                      {selectedPost.description || 'No description provided'}
                    </p>
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
                  openReEvaluationModal(selectedPost);
                }}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Re-evaluate Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Re-evaluation Modal */}
      {showReEvaluationModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-green-100">
                  <RotateCcw className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Re-evaluate Crop Post</h3>
                  <p className="text-sm text-gray-600">
                    Change the status of this rejected post
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
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as 'approved' | 'pending')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="approved">Approve Post</option>
                  <option value="pending">Send Back for Review</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Re-evaluation Notes
                </label>
                <textarea
                  value={reEvaluationNotes}
                  onChange={(e) => setReEvaluationNotes(e.target.value)}
                  placeholder="Explain why you're changing the status of this post..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowReEvaluationModal(false);
                    setSelectedPost(null);
                    setReEvaluationNotes('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={actionLoading === selectedPost.id}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReEvaluate(selectedPost.id)}
                  disabled={actionLoading === selectedPost.id}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center disabled:opacity-50"
                >
                  {actionLoading === selectedPost.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Re-evaluate to ${newStatus === 'approved' ? 'Approved' : 'Pending'}`
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

export default AdminRejectedPosts;
