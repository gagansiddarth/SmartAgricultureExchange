import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  MessageSquare, 
  DollarSign, 
  Users, 
  Calendar, 
  MapPin, 
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Eye,
  Phone,
  Mail,
  TrendingUp
} from 'lucide-react';

interface Deal {
  id: string;
  post_id: string;
  buyer_id: string;
  farmer_id: string;
  offer_price: number;
  offer_quantity: number;
  status: 'initiated' | 'accepted' | 'in_progress' | 'completed' | 'disputed' | 'cancelled';
  farmer_name?: string;
  buyer_name?: string;
  crop_name?: string;
  variety_name?: string;
  created_at: string;
  updated_at: string;
  messages_count?: number;
  location?: any;
}

const AdminDealsManagement: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'initiated' | 'accepted' | 'in_progress' | 'completed' | 'disputed'>('all');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    fetchDeals();
  }, [filterStatus]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('deals')
        .select(`
          *,
          farmer:farmer_id (
            name,
            phone,
            email
          ),
          buyer:buyer_id (
            name,
            phone,
            email
          ),
          crop_post:post_id (
            crop_name,
            variety_name,
            location,
            primary_image_url
          )
        `)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Transform data to match our interface
      const transformedDeals = data?.map(deal => ({
        ...deal,
        farmer_name: deal.farmer?.name,
        buyer_name: deal.buyer?.name,
        crop_name: deal.crop_post?.crop_name,
        variety_name: deal.crop_post?.variety_name,
        location: deal.crop_post?.location,
        primary_image_url: deal.crop_post?.primary_image_url
      })) || [];

      setDeals(transformedDeals);
    } catch (err) {
      console.error('Error fetching deals:', err);
      setError('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initiated': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'disputed': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'initiated': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <TrendingUp className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'disputed': return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const calculateTotalValue = () => {
    return deals
      .filter(deal => deal.status === 'completed')
      .reduce((sum, deal) => sum + deal.offer_price, 0);
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
          <h2 className="text-2xl font-bold text-slate-800">Deals Management</h2>
          <p className="text-slate-600">Monitor and manage all deals between farmers and buyers</p>
        </div>
        <button
          onClick={fetchDeals}
          className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-700 mb-1">Total Deals</h3>
              <p className="text-3xl font-bold text-blue-900">{deals.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-700 mb-1">Completed</h3>
              <p className="text-3xl font-bold text-green-900">{deals.filter(d => d.status === 'completed').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-yellow-700 mb-1">In Progress</h3>
              <p className="text-3xl font-bold text-yellow-900">{deals.filter(d => d.status === 'in_progress').length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-amber-700 mb-1">Total Value</h3>
              <p className="text-3xl font-bold text-amber-900">₹{calculateTotalValue().toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-amber-500" />
          </div>
        </div>
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

      {/* Filter Buttons */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              filterStatus === 'all' 
                ? 'bg-purple-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Deals ({deals.length})
          </button>
          <button 
            onClick={() => setFilterStatus('initiated')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              filterStatus === 'initiated' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Initiated ({deals.filter(d => d.status === 'initiated').length})
          </button>
          <button 
            onClick={() => setFilterStatus('accepted')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              filterStatus === 'accepted' 
                ? 'bg-green-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Accepted ({deals.filter(d => d.status === 'accepted').length})
          </button>
          <button 
            onClick={() => setFilterStatus('in_progress')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              filterStatus === 'in_progress' 
                ? 'bg-yellow-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In Progress ({deals.filter(d => d.status === 'in_progress').length})
          </button>
          <button 
            onClick={() => setFilterStatus('completed')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              filterStatus === 'completed' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed ({deals.filter(d => d.status === 'completed').length})
          </button>
          <button 
            onClick={() => setFilterStatus('disputed')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              filterStatus === 'disputed' 
                ? 'bg-red-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Disputed ({deals.filter(d => d.status === 'disputed').length})
          </button>
        </div>
      </div>

      {/* Deals List */}
      {deals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl mb-2">No deals found</p>
          <p>No deals match your current filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                      {deal.crop_name} - {deal.variety_name || 'N/A'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Deal ID: {deal.id.slice(0, 8)}...
                    </p>
                  </div>
                  <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(deal.status)}`}>
                    {getStatusIcon(deal.status)}
                    <span>{deal.status.replace('_', ' ').toUpperCase()}</span>
                  </span>
                </div>

                {/* Deal Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-green-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="text-sm">₹{deal.offer_price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <Package className="w-4 h-4 mr-2" />
                    <span className="text-sm">{deal.offer_quantity} units</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{new Date(deal.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <span className="text-sm">{deal.messages_count || 0} messages</span>
                  </div>
                </div>

                {/* Participants */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Farmer</h4>
                      <p className="text-sm text-gray-600">{deal.farmer_name || 'Unknown'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Buyer</h4>
                      <p className="text-sm text-gray-600">{deal.buyer_name || 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                {deal.location && (
                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Location</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {deal.location.village}, {deal.location.district}, {deal.location.state}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedDeal(deal)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      View Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deal Detail Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Deal Details</h3>
                <button
                  onClick={() => setSelectedDeal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <AlertTriangle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Deal information would be displayed here */}
              <p className="text-gray-600">Deal details for {selectedDeal.crop_name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDealsManagement;
