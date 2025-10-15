import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft,
  Package,
  DollarSign,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Phone,
  Truck,
  CreditCard,
  FileText,
  Star,
  Eye,
  MoreVertical,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  LogOut
} from 'lucide-react';

interface Deal {
  id: string;
  crop_post_id: string;
  farmer_id: string;
  buyer_id: string;
  crop_name: string;
  variety_name?: string;
  offer_price: number;
  offer_quantity: number;
  total_amount: number;
  status: 'initiated' | 'accepted' | 'in_progress' | 'completed' | 'disputed' | 'cancelled';
  delivery_method: 'pickup' | 'delivery';
  payment_terms: 'advance' | 'on_delivery' | 'escrow';
  advance_amount?: number;
  pickup_date?: string;
  delivery_address?: string;
  farmer_name: string;
  farmer_phone: string;
  location: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}

const BuyerDeals: React.FC = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [deals, selectedStatus, searchTerm, sortBy, sortOrder]);

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

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock deals data for demonstration
      const mockDeals: Deal[] = [
        {
          id: 'deal-1',
          crop_post_id: 'post-1',
          farmer_id: 'farmer-1',
          buyer_id: 'buyer-1',
          crop_name: 'Basmati Rice',
          variety_name: 'Pusa Basmati 1121',
          offer_price: 3500,
          offer_quantity: 25,
          total_amount: 87500,
          status: 'accepted',
          delivery_method: 'pickup',
          payment_terms: 'advance',
          advance_amount: 17500,
          pickup_date: '2024-12-20',
          farmer_name: 'Rajesh Kumar',
          farmer_phone: '+919876543210',
          location: 'Karnal, Haryana',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString(),
          notes: 'Premium quality basmati rice'
        },
        {
          id: 'deal-2',
          crop_post_id: 'post-2',
          farmer_id: 'farmer-2',
          buyer_id: 'buyer-1',
          crop_name: 'Wheat',
          variety_name: 'HD-3086',
          offer_price: 2200,
          offer_quantity: 40,
          total_amount: 88000,
          status: 'in_progress',
          delivery_method: 'delivery',
          payment_terms: 'escrow',
          pickup_date: '2024-11-25',
          delivery_address: '123 Business Park, Mumbai',
          farmer_name: 'Suresh Patel',
          farmer_phone: '+919876543211',
          location: 'Meerut, Uttar Pradesh',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 7200000).toISOString(),
          notes: 'High protein content wheat'
        },
        {
          id: 'deal-3',
          crop_post_id: 'post-3',
          farmer_id: 'farmer-3',
          buyer_id: 'buyer-1',
          crop_name: 'Sugarcane',
          variety_name: 'Co-86032',
          offer_price: 1800,
          offer_quantity: 100,
          total_amount: 180000,
          status: 'completed',
          delivery_method: 'pickup',
          payment_terms: 'on_delivery',
          pickup_date: '2024-10-30',
          farmer_name: 'Amit Singh',
          farmer_phone: '+919876543212',
          location: 'Coimbatore, Tamil Nadu',
          created_at: new Date(Date.now() - 259200000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          notes: 'High sugar content sugarcane'
        }
      ];

      setDeals(mockDeals);
    } catch (error) {
      console.error('Error fetching deals:', error);
      setError('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...deals];

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(deal => deal.status === selectedStatus);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(deal => 
        deal.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.total_amount;
          bValue = b.total_amount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default: // date
          aValue = new Date(a.updated_at).getTime();
          bValue = new Date(b.updated_at).getTime();
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredDeals(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initiated': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'initiated': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Truck className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'disputed': return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getDealStats = () => {
    const stats = {
      total: deals.length,
      active: deals.filter(d => ['initiated', 'accepted', 'in_progress'].includes(d.status)).length,
      completed: deals.filter(d => d.status === 'completed').length,
      totalValue: deals.reduce((sum, deal) => sum + deal.total_amount, 0)
    };
    return stats;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your deals...</p>
        </div>
      </div>
    );
  }

  const stats = getDealStats();

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Black/White Theme */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/buyer-dashboard')}
                className="p-3 hover:bg-gray-800 rounded-2xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Deals</h1>
                <p className="text-gray-300">Track and manage your agricultural deals</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">Total Value</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalValue)}</p>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards - Black/White Theme */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Deals</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <Package className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>

          <div className="bg-black p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Active Deals</p>
                <p className="text-3xl font-bold text-white">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>

          <div className="bg-black p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Completed</p>
                <p className="text-3xl font-bold text-white">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>

          <div className="bg-black p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Value</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(stats.totalValue)}</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search deals by crop, farmer, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="initiated">Initiated</option>
                <option value="accepted">Accepted</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="disputed">Disputed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Value</option>
                <option value="amount-asc">Lowest Value</option>
                <option value="status-asc">Status A-Z</option>
              </select>
            </div>
          </div>
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

        {/* Deals List */}
        {filteredDeals.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Deals Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search criteria or filters.' 
                : 'You haven\'t made any deals yet. Start by browsing crops and making offers.'
              }
            </p>
            <button
              onClick={() => navigate('/buyer-dashboard')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Browse Crops
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDeals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{deal.crop_name}</h3>
                        {deal.variety_name && (
                          <span className="text-sm text-gray-600">({deal.variety_name})</span>
                        )}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                          {getStatusIcon(deal.status)}
                          <span className="ml-1 capitalize">{deal.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          <span>{deal.farmer_name}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{deal.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {deal.pickup_date 
                              ? new Date(deal.pickup_date).toLocaleDateString()
                              : 'TBD'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">{formatCurrency(deal.total_amount)}</p>
                      <p className="text-sm text-gray-600">
                        {deal.offer_quantity} units @ {formatCurrency(deal.offer_price)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Package className="w-4 h-4 mr-2" />
                        <span>Quantity</span>
                      </div>
                      <p className="font-medium text-gray-800">{deal.offer_quantity} units</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Truck className="w-4 h-4 mr-2" />
                        <span>Delivery</span>
                      </div>
                      <p className="font-medium text-gray-800 capitalize">{deal.delivery_method}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span>Payment</span>
                      </div>
                      <p className="font-medium text-gray-800 capitalize">{deal.payment_terms.replace('_', ' ')}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Updated</span>
                      </div>
                      <p className="font-medium text-gray-800">
                        {new Date(deal.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {deal.notes && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Notes:</span> {deal.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => navigate(`/buyer-chat/${deal.farmer_id}`)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Chat</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors">
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors">
                        <FileText className="w-4 h-4" />
                        <span>Details</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {deal.status === 'accepted' && (
                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          Confirm Pickup
                        </button>
                      )}
                      {deal.status === 'in_progress' && (
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          Track Delivery
                        </button>
                      )}
                      {deal.status === 'completed' && (
                        <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          View Receipt
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
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

export default BuyerDeals;
