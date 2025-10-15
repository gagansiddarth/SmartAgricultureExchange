import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Users, 
  Package,
  DollarSign,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  totalPosts: number;
  pendingPosts: number;
  approvedPosts: number;
  rejectedPosts: number;
  totalFarmers: number;
  totalBuyers: number;
  totalRevenue: number;
  avgPostValue: number;
  postsByCrop: Array<{ crop: string; count: number; value: number }>;
  postsByLocation: Array<{ location: string; count: number; state: string }>;
  postsByMonth: Array<{ month: string; count: number; revenue: number }>;
  topFarmers: Array<{ name: string; posts: number; revenue: number }>;
  recentActivity: Array<{ type: string; description: string; timestamp: string }>;
}

const AdminAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod, selectedCrop]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📊 Fetching analytics data...');

      // Fetch all crop posts
      const { data: posts, error: postsError } = await supabase
        .from('crop_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) {
        throw postsError;
      }

      console.log('📋 Posts fetched:', posts?.length || 0);

      // Calculate analytics
      const data = calculateAnalytics(posts || []);
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(`Failed to fetch analytics: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (posts: any[]): AnalyticsData => {
    // Filter posts by selected period
    const filteredPosts = filterPostsByPeriod(posts, selectedPeriod);

    // Basic stats
    const totalPosts = filteredPosts.length;
    const pendingPosts = filteredPosts.filter(p => p.status === 'pending').length;
    const approvedPosts = filteredPosts.filter(p => p.status === 'approved').length;
    const rejectedPosts = filteredPosts.filter(p => p.status === 'rejected').length;

    // Revenue calculation
    const approvedPostsWithValue = filteredPosts.filter(p => p.status === 'approved');
    const totalRevenue = approvedPostsWithValue.reduce((sum, post) => {
      return sum + (post.quantity * post.price_per_unit);
    }, 0);

    const avgPostValue = approvedPostsWithValue.length > 0 
      ? totalRevenue / approvedPostsWithValue.length 
      : 0;

    // Posts by crop
    const cropStats = new Map<string, { count: number; value: number }>();
    filteredPosts.forEach(post => {
      const crop = post.crop_name || 'Unknown';
      const current = cropStats.get(crop) || { count: 0, value: 0 };
      cropStats.set(crop, {
        count: current.count + 1,
        value: current.value + (post.quantity * post.price_per_unit)
      });
    });

    const postsByCrop = Array.from(cropStats.entries())
      .map(([crop, stats]) => ({ crop, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Posts by location
    const locationStats = new Map<string, { count: number; state: string }>();
    filteredPosts.forEach(post => {
      if (post.location) {
        const district = post.location.district || 'Unknown';
        const state = post.location.state || 'Unknown';
        const key = `${district}, ${state}`;
        const current = locationStats.get(key) || { count: 0, state };
        locationStats.set(key, {
          count: current.count + 1,
          state
        });
      }
    });

    const postsByLocation = Array.from(locationStats.entries())
      .map(([location, stats]) => ({ location, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // Posts by month
    const monthStats = new Map<string, { count: number; revenue: number }>();
    filteredPosts.forEach(post => {
      const month = new Date(post.created_at).toISOString().slice(0, 7); // YYYY-MM
      const current = monthStats.get(month) || { count: 0, revenue: 0 };
      monthStats.set(month, {
        count: current.count + 1,
        revenue: current.revenue + (post.status === 'approved' ? post.quantity * post.price_per_unit : 0)
      });
    });

    const postsByMonth = Array.from(monthStats.entries())
      .map(([month, stats]) => ({ month, ...stats }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months

    // Top farmers (mock data for now)
    const topFarmers = [
      { name: 'Rajesh Kumar', posts: 5, revenue: 150000 },
      { name: 'Suresh Patel', posts: 4, revenue: 120000 },
      { name: 'Amit Singh', posts: 3, revenue: 90000 },
      { name: 'Priya Sharma', posts: 2, revenue: 60000 },
      { name: 'Vikram Reddy', posts: 2, revenue: 55000 }
    ];

    // Recent activity
    const recentActivity = filteredPosts
      .slice(0, 10)
      .map(post => ({
        type: post.status === 'approved' ? 'success' : post.status === 'rejected' ? 'error' : 'pending',
        description: `${post.status === 'approved' ? 'Approved' : post.status === 'rejected' ? 'Rejected' : 'Pending'} ${post.crop_name} post by ${post.farmer_name || 'Unknown Farmer'}`,
        timestamp: post.created_at
      }));

    return {
      totalPosts,
      pendingPosts,
      approvedPosts,
      rejectedPosts,
      totalFarmers: 25, // Mock data
      totalBuyers: 15, // Mock data
      totalRevenue,
      avgPostValue,
      postsByCrop,
      postsByLocation,
      postsByMonth,
      topFarmers,
      recentActivity
    };
  };

  const filterPostsByPeriod = (posts: any[], period: string) => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (period) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return posts;
    }

    return posts.filter(post => new Date(post.created_at) >= cutoffDate);
  };

  const exportData = () => {
    if (!analyticsData) return;

    const csvData = [
      ['Metric', 'Value'],
      ['Total Posts', analyticsData.totalPosts],
      ['Pending Posts', analyticsData.pendingPosts],
      ['Approved Posts', analyticsData.approvedPosts],
      ['Rejected Posts', analyticsData.rejectedPosts],
      ['Total Revenue', analyticsData.totalRevenue],
      ['Average Post Value', analyticsData.avgPostValue],
      ['Total Farmers', analyticsData.totalFarmers],
      ['Total Buyers', analyticsData.totalBuyers],
      ['', ''],
      ['Top Crops', 'Count', 'Value'],
      ...analyticsData.postsByCrop.map(crop => [crop.crop, crop.count, crop.value]),
      ['', ''],
      ['Top Locations', 'Count', 'State'],
      ...analyticsData.postsByLocation.map(loc => [loc.location, loc.count, loc.state])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${selectedPeriod}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h2>
          <p className="text-slate-600">Platform performance and supply chain insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={exportData}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={fetchAnalyticsData}
            className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-3xl font-bold text-slate-800">{analyticsData.totalPosts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-gray-600 ml-1">from last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-800">₹{analyticsData.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+8%</span>
            <span className="text-gray-600 ml-1">from last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Farmers</p>
              <p className="text-3xl font-bold text-slate-800">{analyticsData.totalFarmers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+5%</span>
            <span className="text-gray-600 ml-1">from last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Post Value</p>
              <p className="text-3xl font-bold text-slate-800">₹{Math.round(analyticsData.avgPostValue).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+3%</span>
            <span className="text-gray-600 ml-1">from last period</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts by Crop */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Crops by Volume</h3>
          <div className="space-y-3">
            {analyticsData.postsByCrop.slice(0, 5).map((crop, index) => (
              <div key={crop.crop} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-medium mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{crop.crop}</p>
                    <p className="text-sm text-gray-600">₹{crop.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{crop.count}</p>
                  <p className="text-sm text-gray-600">posts</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Posts by Month */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Posts Over Time</h3>
          <div className="space-y-3">
            {analyticsData.postsByMonth.slice(-6).map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    {new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600">₹{month.revenue.toLocaleString()} revenue</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{month.count}</p>
                  <p className="text-sm text-gray-600">posts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.postsByLocation.slice(0, 9).map((location, index) => (
            <div key={location.location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-purple-600 mr-2" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">{location.location}</p>
                  <p className="text-xs text-gray-600">{location.state}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{location.count}</p>
                <p className="text-xs text-gray-600">posts</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {analyticsData.recentActivity.slice(0, 8).map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'success' ? 'bg-green-100' : 
                activity.type === 'error' ? 'bg-red-100' : 'bg-yellow-100'
              }`}>
                {activity.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : activity.type === 'error' ? (
                  <XCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <Activity className="w-4 h-4 text-yellow-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                <p className="text-xs text-gray-600">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
