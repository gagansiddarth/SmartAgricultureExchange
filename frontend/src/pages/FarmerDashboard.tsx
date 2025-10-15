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
  Calendar
} from 'lucide-react';
import { getFarmerCropPosts } from '../services/cropPostService';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'buyer' | 'admin';
}

const FarmerDashboard: React.FC = () => {
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

  const fetchCropPosts = async (farmerId: string) => {
    try {
      setPostsLoading(true);
      const posts = await getFarmerCropPosts(farmerId);
      setCropPosts(posts);
    } catch (error) {
      console.error('Error fetching crop posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 relative overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Natural Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-100 to-yellow-200 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full blur-2xl opacity-40"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Natural Header with Earth Tones */}
        <div className="text-center mb-16">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-green-50 animate-bounce">
              <div className="w-24 h-24 bg-gradient-to-br from-white to-green-50 rounded-full flex items-center justify-center">
                <Crop className="w-12 h-12 text-green-600 drop-shadow-sm" />
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-ping opacity-50"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-amber-400 rounded-full animate-ping delay-300 opacity-50"></div>
          </div>
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Namaste, {user?.name}
          </h1>
          <p className="text-xl text-green-600 font-medium">Your organic farming journey continues...</p>
        </div>

        {/* Natural Stats Cards */}
        <div className="grid grid-cols-2 gap-8 mb-16 max-w-2xl mx-auto">
          <div className="group">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 text-center shadow-lg transform transition-all duration-300 hover:scale-105 border-2 border-green-100">
              <div className="text-5xl font-bold text-green-700 mb-2">3</div>
              <div className="text-green-600 font-medium">Active Harvests</div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-4">
                <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
          <div className="group">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-8 text-center shadow-lg transform transition-all duration-300 hover:scale-105 border-2 border-amber-100">
              <div className="text-5xl font-bold text-amber-700 mb-2">₹45K</div>
              <div className="text-amber-600 font-medium">This Season</div>
              <div className="w-full bg-amber-200 rounded-full h-2 mt-4">
                <div className="bg-amber-500 h-2 rounded-full w-4/5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Buttons - Following CONTEXT.md specifications */}
        <div className="max-w-lg mx-auto space-y-6">
          {/* Post New Crop - Primary CTA */}
          <Link to="/crop-post" className="group block">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-6 px-8 rounded-2xl flex items-center justify-center text-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-green-500/25 hover:from-green-600 hover:to-emerald-700 border border-green-400">
              <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
              Post New Crop
              <div className="ml-3 w-2 h-2 bg-green-200 rounded-full animate-ping opacity-70"></div>
            </div>
          </Link>

          {/* Get Crop Advice */}
          <Link to="/crop-advice" className="group block">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-6 px-8 rounded-2xl flex items-center justify-center text-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25 hover:from-blue-600 hover:to-cyan-700 border border-blue-400">
              <FileText className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
              Get Crop Advice
            </div>
          </Link>

          {/* My Posts */}
          <Link to="/my-posts" className="group block">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-6 px-8 rounded-2xl flex items-center justify-center text-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-amber-500/25 hover:from-amber-600 hover:to-yellow-600 border border-amber-400">
              <Eye className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
              My Posts
            </div>
          </Link>

          {/* News & Policies */}
          <button className="group w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-6 px-8 rounded-2xl flex items-center justify-center text-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 hover:from-purple-600 hover:to-indigo-600 border border-purple-400">
            <MessageCircle className="w-6 h-6 mr-3 group-hover:animate-pulse" />
            News & Policies
          </button>
        </div>

        {/* Natural Activity Feed */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-green-800">
            Recent Activity
          </h3>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl shadow-sm transform transition-all duration-300 hover:scale-105 hover:shadow-md border-2 border-green-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <div className="font-semibold text-green-800 text-lg">Rice harvest ready for sale</div>
                  <div className="text-green-600 font-medium">2 hours ago</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl shadow-sm transform transition-all duration-300 hover:scale-105 hover:shadow-md border-2 border-amber-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full flex items-center justify-center mr-4">
                  <DollarSign className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <div className="font-semibold text-amber-800 text-lg">Payment received ₹15,000</div>
                  <div className="text-amber-600 font-medium">Yesterday</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl shadow-sm transform transition-all duration-300 hover:scale-105 hover:shadow-md border-2 border-blue-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-cyan-300 rounded-full flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <div className="font-semibold text-blue-800 text-lg">Wheat post under review</div>
                  <div className="text-blue-600 font-medium">3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Crop Posts */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-green-800">
            My Crop Posts
          </h3>
          {postsLoading ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4 animate-spin">🌱</div>
              <p className="text-green-600">Loading your crop posts...</p>
            </div>
          ) : cropPosts.length === 0 ? (
            <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200">
              <div className="text-6xl mb-4">🌾</div>
              <h4 className="text-xl font-semibold text-green-800 mb-2">No Crop Posts Yet</h4>
              <p className="text-green-600 mb-6">Start by posting your first crop to connect with buyers!</p>
              <Link to="/crop-post" className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                <Plus className="w-5 h-5 mr-2" />
                Post Your First Crop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cropPosts.map((post) => (
                <div key={post.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-green-800 truncate">
                      {post.crop_name} - {post.variety_name || 'N/A'}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      post.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      post.status === 'approved' ? 'bg-green-100 text-green-800' :
                      post.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {post.primary_image_url && (
                    <img 
                      src={post.primary_image_url} 
                      alt={post.crop_name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-green-700">
                      <DollarSign className="w-4 h-4 mr-2" />
                      ₹{post.price_per_unit} / {post.quantity_unit}
                    </div>
                    <div className="flex items-center text-green-700">
                      <FileText className="w-4 h-4 mr-2" />
                      {post.quantity} {post.quantity_unit} available
                    </div>
                    <div className="flex items-center text-green-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      Posted: {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Link 
                      to="/my-posts"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-300"
                    >
                      Manage Posts
                    </Link>
                    {post.status === 'approved' && (
                      <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Live
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-green-800">
            Your Farming Journey
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-200">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700 mb-2">5</div>
                <div className="text-green-600 font-medium">Active Fields</div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
              <div className="flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-amber-600" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-700 mb-2">12</div>
                <div className="text-amber-600 font-medium">Harvests This Year</div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700 mb-2">₹2.1L</div>
                <div className="text-blue-600 font-medium">Total Earnings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
