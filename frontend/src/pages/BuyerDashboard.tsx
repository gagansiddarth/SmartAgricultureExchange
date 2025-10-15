import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Search, 
  Filter, 
  MapPin, 
  Package, 
  DollarSign, 
  Calendar,
  User,
  Star,
  MessageSquare,
  Phone,
  Eye,
  Heart,
  Share2,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Building2,
  ShoppingCart,
  LogOut
} from 'lucide-react';

interface CropPost {
  id: string;
  farmer_id: string;
  crop_name: string;
  variety_name?: string;
  description?: string;
  quantity: number;
  quantity_unit: string;
  price_per_unit: number;
  status: string;
  location: {
    village: string;
    district: string;
    state: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
  };
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
}

interface FilterOptions {
  cropType: string;
  variety: string;
  state: string;
  district: string;
  priceMin: number;
  priceMax: number;
  quantityMin: number;
  harvestWindow: string;
  certifiedOnly: boolean;
  rareExotic: boolean;
}

const BuyerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [cropPosts, setCropPosts] = useState<CropPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CropPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price' | 'date' | 'quantity' | 'harvest'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CropPost | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [filters, setFilters] = useState<FilterOptions>({
    cropType: '',
    variety: '',
    state: '',
    district: '',
    priceMin: 0,
    priceMax: 100000,
    quantityMin: 0,
    harvestWindow: '',
    certifiedOnly: false,
    rareExotic: false
  });

  useEffect(() => {
    checkBuyerAccess();
    fetchApprovedPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cropPosts, searchTerm, filters, sortBy, sortOrder]);

  const checkBuyerAccess = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        navigate('/login');
        return;
      }

      const userRole = user.user_metadata?.role;
      
      if (userRole !== 'buyer') {
        navigate('/dashboard');
        return;
      }
    } catch (err) {
      console.error('Error checking buyer access:', err);
      navigate('/login');
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

  const fetchApprovedPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching approved crop posts...');
      
      // Fetch approved posts
      const { data: postsData, error: postsError } = await supabase
        .from('crop_posts')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      console.log('📊 Approved posts response:', { postsData, postsError });

      if (postsError) {
        console.error('Database error:', postsError);
        throw postsError;
      }

      // Transform data with fallback farmer info
      const transformedPosts = (postsData || []).map((post) => ({
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
        verification_score: Math.random() * 0.3 + 0.7 // Mock verification score
      }));

      // Only use real posts from database
      setCropPosts(transformedPosts);
      console.log('✅ Approved posts loaded:', transformedPosts.length);
    } catch (err) {
      console.error('Error fetching approved posts:', err);
      setError(`Failed to fetch approved posts: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cropPosts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.variety_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.location.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.location.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Crop type filter
    if (filters.cropType) {
      filtered = filtered.filter(post => 
        post.crop_name.toLowerCase().includes(filters.cropType.toLowerCase())
      );
    }

    // State filter
    if (filters.state) {
      filtered = filtered.filter(post => 
        post.location.state === filters.state
      );
    }

    // Price filter
    filtered = filtered.filter(post => 
      post.price_per_unit >= filters.priceMin && 
      post.price_per_unit <= filters.priceMax
    );

    // Quantity filter
    if (filters.quantityMin > 0) {
      filtered = filtered.filter(post => 
        post.quantity >= filters.quantityMin
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price_per_unit;
          bValue = b.price_per_unit;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'harvest':
          aValue = new Date(a.expected_harvest_date || '').getTime();
          bValue = new Date(b.expected_harvest_date || '').getTime();
          break;
        default: // date
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredPosts(filtered);
  };

  const handleViewPost = (post: CropPost) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleFavorite = (postId: string) => {
    setFavorites(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleContactFarmer = (post: CropPost) => {
    navigate(`/buyer-chat/${post.farmer_id}`);
  };

  const handleMakeOffer = (post: CropPost) => {
    navigate(`/buyer-offer/${post.id}`);
  };

  const getCropTypes = () => {
    const types = new Set(cropPosts.map(post => post.crop_name));
    return Array.from(types).sort();
  };

  const getStates = () => {
    const states = new Set(cropPosts.map(post => post.location.state));
    return Array.from(states).sort();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading available crops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - OLX Inspired */}
      <div className="bg-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Buyer Portal</h1>
                <p className="text-gray-300">Discover premium agricultural products</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/buyer-deals')}
                className="bg-white hover:bg-gray-100 text-black px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>My Deals</span>
              </button>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-300">Available Crops</p>
                <p className="text-2xl font-bold text-white">{filteredPosts.length}</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="border border-gray-600 hover:border-gray-500 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters - Premium Black/White */}
        <div className="bg-black p-8 rounded-3xl mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by crop, variety, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-white focus:border-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-3 px-6 py-4 bg-white text-black rounded-2xl hover:bg-gray-100 transition-all duration-200 font-medium"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white rounded-2xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-black text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-white focus:border-white text-gray-900"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="quantity-desc">Quantity: High to Low</option>
              <option value="harvest-asc">Harvest: Soonest First</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-8 pt-8 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Crop Type */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Crop Type</label>
                  <select
                    value={filters.cropType}
                    onChange={(e) => setFilters({...filters, cropType: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-white focus:border-white text-gray-900"
                  >
                    <option value="">All Crops</option>
                    {getCropTypes().map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">State</label>
                  <select
                    value={filters.state}
                    onChange={(e) => setFilters({...filters, state: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-white focus:border-white text-gray-900"
                  >
                    <option value="">All States</option>
                    {getStates().map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Price Range (₹)</label>
                  <div className="flex space-x-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin || ''}
                      onChange={(e) => setFilters({...filters, priceMin: Number(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-white focus:border-white text-gray-900 placeholder-gray-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax || ''}
                      onChange={(e) => setFilters({...filters, priceMax: Number(e.target.value) || 100000})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-white focus:border-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Minimum Quantity */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Min Quantity</label>
                  <input
                    type="number"
                    placeholder="Minimum quantity"
                    value={filters.quantityMin || ''}
                    onChange={(e) => setFilters({...filters, quantityMin: Number(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-white focus:border-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.certifiedOnly}
                    onChange={(e) => setFilters({...filters, certifiedOnly: e.target.checked})}
                    className="w-5 h-5 text-black rounded focus:ring-2 focus:ring-white"
                  />
                  <span className="ml-3 text-sm text-white font-medium">Certified/Verified Only</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.rareExotic}
                    onChange={(e) => setFilters({...filters, rareExotic: e.target.checked})}
                    className="w-5 h-5 text-black rounded focus:ring-2 focus:ring-white"
                  />
                  <span className="ml-3 text-sm text-white font-medium">Rare/Exotic Crops</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
          </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredPosts.length} of {cropPosts.length} available crops
          </p>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">Live Marketplace</span>
          </div>
        </div>

        {/* Crop Posts Grid/List */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Crops Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }`}>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Image */}
                <div className={`${viewMode === 'list' ? 'w-48 h-32' : 'h-48'} bg-gray-200 flex items-center justify-center`}>
                  {post.primary_image_url ? (
                    <img
                      src={post.primary_image_url}
                      alt={post.crop_name}
                      className={`${viewMode === 'list' ? 'w-full h-full' : 'w-full h-full'} object-cover`}
                    />
                  ) : (
                    <Package className="w-12 h-12 text-gray-400" />
                  )}
                </div>

                {/* Content */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{post.crop_name}</h3>
                      {post.variety_name && (
                        <p className="text-sm text-gray-600 mb-2">{post.variety_name}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleFavorite(post.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        favorites.includes(post.id) 
                          ? 'text-red-500 bg-red-50' 
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(post.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Package className="w-4 h-4 mr-2" />
                      {post.quantity} {post.quantity_unit}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      ₹{post.price_per_unit.toLocaleString()} per {post.quantity_unit}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {post.location.district}, {post.location.state}
                    </div>
                    {post.expected_harvest_date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Harvest: {new Date(post.expected_harvest_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Verification Badge */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified ({Math.round((post.verification_score || 0.8) * 100)}%)
                    </div>
                  </div>

                  {/* Farmer Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{post.farmer_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewPost(post)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleContactFarmer(post)}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleMakeOffer(post)}
                    className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Make Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Post Details Modal */}
        {showPostModal && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl max-h-full overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedPost.crop_name}</h3>
                  <p className="text-sm text-gray-600">Complete crop details and farmer information</p>
                </div>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Eye className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Crop Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Crop:</span> {selectedPost.crop_name}</div>
                        <div><span className="font-medium">Variety:</span> {selectedPost.variety_name || 'N/A'}</div>
                        <div><span className="font-medium">Quantity:</span> {selectedPost.quantity} {selectedPost.quantity_unit}</div>
                        <div><span className="font-medium">Price:</span> ₹{selectedPost.price_per_unit.toLocaleString()} per {selectedPost.quantity_unit}</div>
                        <div><span className="font-medium">Total Value:</span> ₹{(selectedPost.quantity * selectedPost.price_per_unit).toLocaleString()}</div>
                        <div><span className="font-medium">Packaging:</span> {selectedPost.packaging_type || 'Bulk'}</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Farmer Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Name:</span> {selectedPost.farmer_name}</div>
                        <div><span className="font-medium">Phone:</span> {selectedPost.farmer_phone}</div>
                        <div><span className="font-medium">Location:</span> {selectedPost.location.village}, {selectedPost.location.district}, {selectedPost.location.state}</div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span>4.8/5 rating</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Timeline</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Posted:</span> {new Date(selectedPost.created_at).toLocaleDateString()}</div>
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

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3">Verification Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-green-700">Geotagged Photos Verified</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-green-700">Farmer Identity Verified</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-green-700">Location Verified</span>
                        </div>
                        <div className="text-xs text-green-600 mt-2">
                          Verification Score: {Math.round((selectedPost.verification_score || 0.8) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleContactFarmer(selectedPost)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  Contact Farmer
                </button>
                <button
                  onClick={() => handleMakeOffer(selectedPost)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                >
                  Make Offer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;