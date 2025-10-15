import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, 
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
  Eye,
  Image as ImageIcon
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
  sowing_date?: string;
  expected_harvest_date?: string;
  expected_yield?: number;
  yield_unit?: string;
  packaging_type?: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

const CropPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<CropPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const posts = await getFarmerCropPosts();
      const foundPost = posts.find(p => p.id === id);
      
      if (foundPost) {
        setPost(foundPost);
      } else {
        setError('Crop post not found.');
      }
    } catch (err) {
      setError('Failed to fetch crop post details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this crop post?')) {
      return;
    }

    try {
      setDeleteLoading(true);
      const success = await deleteCropPost(post.id);
      if (success) {
        navigate('/my-posts');
      } else {
        setError('Failed to delete crop post.');
      }
    } catch (err) {
      setError('Failed to delete crop post.');
      console.error(err);
    } finally {
      setDeleteLoading(false);
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
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'approved': return <CheckCircle className="w-5 h-5" />;
      case 'rejected': return <XCircle className="w-5 h-5" />;
      case 'sold': return <DollarSign className="w-5 h-5" />;
      case 'expired': return <AlertTriangle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-green-700 text-lg font-semibold">Loading crop post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 text-lg font-semibold mb-4">{error || 'Crop post not found'}</p>
          <Link
            to="/my-posts"
            className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to My Posts
          </Link>
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
                to="/my-posts"
                className="text-green-600 hover:text-green-800 transition-colors duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Crop Post Details</h1>
                <p className="text-slate-600">{post.crop_name} - {post.variety_name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {post.status === 'pending' && (
                <button
                  onClick={() => navigate(`/crop-post?edit=${post.id}`)}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
              >
                {deleteLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-6">
            {/* Primary Image */}
            {post.primary_image_url && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Primary Image
                </h3>
                <img 
                  src={post.primary_image_url} 
                  alt={post.crop_name}
                  className="w-full h-64 object-cover rounded-lg shadow-sm"
                />
              </div>
            )}

            {/* All Images */}
            {post.image_urls && post.image_urls.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  All Images ({post.image_urls.length})
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {post.image_urls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={url} 
                        alt={`${post.crop_name} - Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!post.primary_image_url && (!post.image_urls || post.image_urls.length === 0)) && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-green-100 text-center">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No images uploaded for this crop post</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Post Status</h3>
                <span className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(post.status)}`}>
                  {getStatusIcon(post.status)}
                  <span>{post.status.toUpperCase()}</span>
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Created: {new Date(post.created_at).toLocaleString()}</p>
                {post.updated_at !== post.created_at && (
                  <p>Updated: {new Date(post.updated_at).toLocaleString()}</p>
                )}
                {post.expires_at && (
                  <p>Expires: {new Date(post.expires_at).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            {/* Crop Information */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Crop Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Crop Name:</span>
                  <span className="font-medium">{post.crop_name}</span>
                </div>
                {post.variety_name && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Variety:</span>
                    <span className="font-medium">{post.variety_name}</span>
                  </div>
                )}
                {post.description && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description:</span>
                    <span className="font-medium text-right max-w-xs">{post.description}</span>
                  </div>
                )}
                {post.packaging_type && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Packaging:</span>
                    <span className="font-medium">{post.packaging_type}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing & Quantity */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Pricing & Quantity
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per unit:</span>
                  <span className="font-medium text-green-600">₹{post.price_per_unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{post.quantity} {post.quantity_unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-medium text-green-600">₹{post.quantity * post.price_per_unit}</span>
                </div>
                {post.expected_yield && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Yield:</span>
                    <span className="font-medium">{post.expected_yield} {post.yield_unit || 'kg/acre'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            {(post.sowing_date || post.expected_harvest_date) && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  {post.sowing_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sowing Date:</span>
                      <span className="font-medium">{new Date(post.sowing_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {post.expected_harvest_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Harvest:</span>
                      <span className="font-medium">{new Date(post.expected_harvest_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location & Contact */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location & Contact
              </h3>
              <div className="space-y-3">
                {post.location && (
                  <>
                    {post.location.village && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Village:</span>
                        <span className="font-medium">{post.location.village}</span>
                      </div>
                    )}
                    {post.location.district && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">District:</span>
                        <span className="font-medium">{post.location.district}</span>
                      </div>
                    )}
                    {post.location.state && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">State:</span>
                        <span className="font-medium">{post.location.state}</span>
                      </div>
                    )}
                    {post.location.pincode && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pincode:</span>
                        <span className="font-medium">{post.location.pincode}</span>
                      </div>
                    )}
                  </>
                )}
                {post.contact_phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Contact:</span>
                    <a 
                      href={`tel:${post.contact_phone}`}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-800 transition-colors duration-200"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="font-medium">{post.contact_phone}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropPostDetail;
