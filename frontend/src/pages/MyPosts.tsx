import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Package, 
  MapPin, 
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { getFarmerCropPosts, deleteCropPost } from '../services/cropPostService';

interface CropPost {
  id: string;
  crop_name: string;
  variety_name?: string;
  description?: string;
  quantity: number;
  quantity_unit: string;
  price_per_unit: number;
  status: 'pending' | 'approved' | 'rejected' | 'sold' | 'expired' | 'withdrawn';
  primary_image_url?: string;
  image_urls: string[];
  location: any;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<CropPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const posts = await getFarmerCropPosts();
      setPosts(posts);
    } catch (err) {
      setError('Failed to fetch your crop posts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this crop post?')) {
      return;
    }

    try {
      setDeleteLoading(postId);
      const success = await deleteCropPost(postId);
      if (success) {
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        setError('Failed to delete crop post.');
      }
    } catch (err) {
      setError('Failed to delete crop post.');
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'sold': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'sold': return <DollarSign className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const filteredPosts = posts.filter(post => 
    filterStatus === 'all' || post.status === filterStatus
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-green-700 text-lg font-semibold">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/farmer-dashboard"
                className="text-green-600 hover:text-green-800 transition-colors duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">My Crop Posts</h1>
                <p className="text-slate-600">Manage and track your crop listings</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchPosts}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <Link
                to="/crop-post"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>New Post</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-green-700 mb-1">Total Posts</h2>
                <p className="text-3xl font-bold text-green-900">{posts.length}</p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-orange-700 mb-1">Pending Review</h2>
                <p className="text-3xl font-bold text-orange-900">{posts.filter(p => p.status === 'pending').length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-green-700 mb-1">Approved</h2>
                <p className="text-3xl font-bold text-green-900">{posts.filter(p => p.status === 'approved').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-blue-700 mb-1">Sold</h2>
                <p className="text-3xl font-bold text-blue-900">{posts.filter(p => p.status === 'sold').length}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-green-100">
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                filterStatus === 'all' 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Posts ({posts.length})
            </button>
            <button 
              onClick={() => setFilterStatus('pending')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                filterStatus === 'pending' 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({posts.filter(p => p.status === 'pending').length})
            </button>
            <button 
              onClick={() => setFilterStatus('approved')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                filterStatus === 'approved' 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({posts.filter(p => p.status === 'approved').length})
            </button>
            <button 
              onClick={() => setFilterStatus('rejected')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                filterStatus === 'rejected' 
                  ? 'bg-red-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({posts.filter(p => p.status === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-xl mb-2">
              {filterStatus === 'all' ? 'No crop posts found.' : `No ${filterStatus} posts found.`}
            </p>
            <p className="mb-6">Start by creating your first crop post!</p>
            <Link
              to="/crop-post"
              className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-md p-6 border border-green-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex space-x-4">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    {post.primary_image_url ? (
                      <img 
                        src={post.primary_image_url} 
                        alt={post.crop_name}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-800 truncate">
                        {post.crop_name}
                      </h3>
                      <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(post.status)}`}>
                        {getStatusIcon(post.status)}
                        <span>{post.status.toUpperCase()}</span>
                      </span>
                    </div>
                    
                    {post.variety_name && (
                      <p className="text-slate-600 text-sm mb-2">Variety: {post.variety_name}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-green-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span className="text-sm">₹{post.price_per_unit}/{post.quantity_unit}</span>
                      </div>
                      <div className="flex items-center text-blue-600">
                        <Package className="w-4 h-4 mr-1" />
                        <span className="text-sm">{post.quantity} {post.quantity_unit}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-sm">{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      {post.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm truncate">{post.location.village}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/crop-post/${post.id}`)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      {post.status === 'pending' && (
                        <button
                          onClick={() => navigate(`/crop-post?edit=${post.id}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleteLoading === post.id}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center disabled:opacity-50"
                      >
                        {deleteLoading === post.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;