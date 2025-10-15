import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Crop, 
  Plus, 
  Eye, 
  MessageCircle, 
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  LogOut,
  Globe,
  Menu,
  Search
} from 'lucide-react';
import { getFarmerCropPosts } from '../services/cropPostService';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'buyer' | 'admin';
}

const FarmerDashboardSimple: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cropPosts, setCropPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [language, setLanguage] = useState<'english' | 'hindi' | 'tamil'>('english');
  const [showMenu, setShowMenu] = useState(false);

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

  const handleLogout = async () => {
    try {
      localStorage.removeItem('demo_user');
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  const translations = {
    english: {
      welcome: 'Welcome',
      dashboard: 'Dashboard',
      createPost: 'Create Crop Post',
      myPosts: 'My Posts',
      cropAdvice: 'Crop Advice',
      totalPosts: 'Total Posts',
      approvedPosts: 'Approved',
      pendingPosts: 'Pending',
      totalValue: 'Total Value',
      recentPosts: 'Recent Posts',
      status: 'Status',
      price: 'Price',
      quantity: 'Quantity',
      view: 'View',
      noPosts: 'No posts yet',
      createFirst: 'Create your first crop post',
      findPrice: 'Find Price',
      checkPrices: 'Check today\'s market prices'
    },
    hindi: {
      welcome: 'स्वागत है',
      dashboard: 'डैशबोर्ड',
      createPost: 'फसल पोस्ट बनाएं',
      myPosts: 'मेरी पोस्ट्स',
      cropAdvice: 'फसल सलाह',
      totalPosts: 'कुल पोस्ट्स',
      approvedPosts: 'अनुमोदित',
      pendingPosts: 'लंबित',
      totalValue: 'कुल मूल्य',
      recentPosts: 'हाल की पोस्ट्स',
      status: 'स्थिति',
      price: 'मूल्य',
      quantity: 'मात्रा',
      view: 'देखें',
      noPosts: 'अभी तक कोई पोस्ट नहीं',
      createFirst: 'अपनी पहली फसल पोस्ट बनाएं',
      findPrice: 'मूल्य खोजें',
      checkPrices: 'आज के बाजार भाव देखें'
    },
    tamil: {
      welcome: 'வரவேற்கிறோம்',
      dashboard: 'டாஷ்போர்டு',
      createPost: 'பயிர் இடுகையை உருவாக்கவும்',
      myPosts: 'எனது இடுகைகள்',
      cropAdvice: 'பயிர் ஆலோசனை',
      totalPosts: 'மொத்த இடுகைகள்',
      approvedPosts: 'அனுமதிக்கப்பட்டது',
      pendingPosts: 'நிலுவையில்',
      totalValue: 'மொத்த மதிப்பு',
      recentPosts: 'சமீபத்திய இடுகைகள்',
      status: 'நிலை',
      price: 'விலை',
      quantity: 'அளவு',
      view: 'பார்க்க',
      noPosts: 'இன்னும் இடுகைகள் இல்லை',
      createFirst: 'உங்கள் முதல் பயிர் இடுகையை உருவாக்கவும்',
      findPrice: 'விலை கண்டுபிடி',
      checkPrices: 'இன்றைய சந்தை விலைகளை பார்க்கவும்'
    }
  };

  const t = translations[language];

  // Mock live market prices data - Limited to 7-8 for scrolling ticker
  const liveMarketPrices = [
    { crop: 'Rice (Basmati)', price: '₹3,500', change: '+2.5%', trend: 'up' },
    { crop: 'Wheat', price: '₹2,200', change: '+1.2%', trend: 'up' },
    { crop: 'Tomato', price: '₹45', change: '-3.1%', trend: 'down' },
    { crop: 'Onion', price: '₹35', change: '+0.8%', trend: 'up' },
    { crop: 'Potato', price: '₹28', change: '+1.5%', trend: 'up' },
    { crop: 'Sugarcane', price: '₹3,200', change: '+0.5%', trend: 'up' },
    { crop: 'Cotton', price: '₹6,800', change: '-1.2%', trend: 'down' },
    { crop: 'Maize', price: '₹2,100', change: '+2.8%', trend: 'up' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">🌱</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t.dashboard}</h1>
                <p className="text-gray-600">{t.welcome}, {user?.name}</p>
              </div>
            </div>
            
            {/* Language Toggle & Logout */}
            <div className="flex items-center space-x-3">
              {/* Language Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {language === 'english' ? 'EN' : language === 'hindi' ? 'हिं' : 'த'}
                  </span>
                  <Menu className="w-4 h-4" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-emerald-100 py-1 z-50">
                    <button
                      onClick={() => { setLanguage('english'); setShowMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 ${language === 'english' ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => { setLanguage('hindi'); setShowMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 ${language === 'hindi' ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}
                    >
                      हिंदी
                    </button>
                    <button
                      onClick={() => { setLanguage('tamil'); setShowMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 ${language === 'tamil' ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}
                    >
                      தமிழ்
                    </button>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Market Prices Scrolling Ticker */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-6 overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...liveMarketPrices, ...liveMarketPrices].map((item, index) => (
            <div key={index} className="flex items-center mx-12 text-white">
              <span className="font-semibold text-xl mr-3">{item.crop}</span>
              <span className="text-2xl font-bold mr-3">{item.price}</span>
              <span className={`text-base px-3 py-2 rounded-full ${
                item.trend === 'up' 
                  ? 'bg-green-400 text-green-900' 
                  : 'bg-red-400 text-red-900'
              }`}>
                {item.change}
              </span>
              <span className="text-emerald-200 mx-6 text-2xl">•</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t.totalPosts}</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Crop className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t.approvedPosts}</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.approvedPosts}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t.pendingPosts}</p>
                <p className="text-3xl font-bold text-amber-600">{stats.pendingPosts}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t.totalValue}</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Simplified Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/crop-post" className="group">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100 hover:border-emerald-300 transition-all duration-200 hover:shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.createPost}</h3>
              <p className="text-sm text-gray-600">List your crops for sale</p>
            </div>
          </Link>

          <Link to="/my-posts" className="group">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100 hover:border-emerald-300 transition-all duration-200 hover:shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.myPosts}</h3>
              <p className="text-sm text-gray-600">View and manage your listings</p>
            </div>
          </Link>

          <Link to="/find-price" className="group">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100 hover:border-emerald-300 transition-all duration-200 hover:shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.findPrice}</h3>
              <p className="text-sm text-gray-600">{t.checkPrices}</p>
            </div>
          </Link>

          <Link to="/crop-advice" className="group">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100 hover:border-emerald-300 transition-all duration-200 hover:shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.cropAdvice}</h3>
              <p className="text-sm text-gray-600">Get expert farming advice</p>
            </div>
          </Link>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
          <div className="p-6 border-b border-emerald-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{t.recentPosts}</h2>
              <Link 
                to="/my-posts"
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {postsLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your posts...</p>
              </div>
            ) : cropPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Crop className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.noPosts}</h3>
                <p className="text-gray-600 mb-6">{t.createFirst}</p>
                <Link to="/crop-post">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
                    Post Your First Crop
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cropPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                        <Crop className="w-6 h-6 text-emerald-600" />
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
                        <span className="ml-1 capitalize">{t[post.status as keyof typeof t] || post.status}</span>
                      </span>
                      <Link to={`/crop-post/${post.id}`}>
                        <button className="p-2 hover:bg-white rounded-xl transition-colors">
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

export default FarmerDashboardSimple;
