import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Crop, 
  Plus, 
  Eye, 
  MessageCircle, 
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  MapPin,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  User,
  Star
} from 'lucide-react';
import { getFarmerCropPosts } from '../services/cropPostService';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'buyer' | 'admin';
}

const FarmerDashboardNew: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cropPosts, setCropPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || 'Farmer',
          role: authUser.user_metadata?.role || 'farmer'
        });
        
        // Fetch farmer's crop posts
        fetchCropPosts(authUser.id);
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const fetchCropPosts = async (userId: string) => {
    try {
      setPostsLoading(true);
      const posts = await getFarmerCropPosts(userId);
      setCropPosts(posts);
    } catch (error) {
      console.error('Error fetching crop posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const stats = {
    totalPosts: cropPosts.length,
    approvedPosts: cropPosts.filter(post => post.status === 'approved').length,
    pendingPosts: cropPosts.filter(post => post.status === 'pending').length,
    totalValue: cropPosts.reduce((sum, post) => sum + (post.quantity * post.price_per_unit), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">🌱</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
                <p className="text-gray-600 text-lg">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <Crop className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approvedPosts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingPosts}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Value</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/crop-post" className="group">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:border-green-300 transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Post New Crop</h3>
                        <p className="text-sm text-gray-600">List your crops for sale</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to="/my-posts" className="group">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">My Posts</h3>
                        <p className="text-sm text-gray-600">View and manage your listings</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:border-purple-300 transition-all duration-200 hover:shadow-lg cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Analytics</h3>
                      <p className="text-sm text-gray-600">View your performance</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 hover:border-orange-300 transition-all duration-200 hover:shadow-lg cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Messages</h3>
                      <p className="text-sm text-gray-600">Chat with buyers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-600">Verified Farmer</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-2xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">4.8 Rating</p>
                    <p className="text-sm text-gray-600">Based on 24 reviews</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Active Location</p>
                    <p className="text-sm text-gray-600">Verified & Geotagged</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Recent Crop Posts</h2>
              <Link 
                to="/my-posts"
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {postsLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your posts...</p>
              </div>
            ) : cropPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Crop className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Crop Posts Yet</h3>
                <p className="text-gray-600 mb-6">Start by posting your first crop to connect with buyers</p>
                <Link to="/crop-post">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
                    Post Your First Crop
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cropPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                        <Crop className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{post.crop_name}</h4>
                        <p className="text-sm text-gray-600">
                          {post.quantity} {post.quantity_unit} • ₹{post.price_per_unit} per {post.quantity_unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                        {getStatusIcon(post.status)}
                        <span className="ml-1 capitalize">{post.status}</span>
                      </span>
                      <Link to={`/crop-post/${post.id}`}>
                        <button className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboardNew;
