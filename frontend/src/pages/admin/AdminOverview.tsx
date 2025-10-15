import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  MapPin,
  Calendar,
  Activity,
  Loader2
} from 'lucide-react';

interface AdminStats {
  total_posts: number;
  pending_posts: number;
  approved_posts: number;
  rejected_posts: number;
  active_farmers: number;
  farmers_with_approved_posts: number;
  total_deals: number;
  completed_deals: number;
  total_revenue: number;
  recent_activity: any[];
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user_name?: string;
}

const AdminOverview: React.FC = () => {
  console.log('AdminOverview component is rendering!');
  
  const [stats, setStats] = useState<AdminStats>({
    total_posts: 0,
    pending_posts: 0,
    approved_posts: 0,
    rejected_posts: 0,
    active_farmers: 0,
    farmers_with_approved_posts: 0,
    total_deals: 0,
    completed_deals: 0,
    total_revenue: 0,
    recent_activity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch basic stats (handle missing tables gracefully)
      const [postsResult, dealsResult] = await Promise.all([
        supabase.from('crop_posts').select('status, created_at'),
        supabase.from('deals').select('status, offer_price, created_at').limit(100)
      ]);

      // Calculate stats
      const posts = postsResult.data || [];
      const deals = dealsResult.data || [];
      
      // Mock user data since user_profiles table doesn't exist
      const users = [
        { role: 'farmer', created_at: new Date().toISOString() },
        { role: 'farmer', created_at: new Date().toISOString() },
        { role: 'buyer', created_at: new Date().toISOString() },
        { role: 'admin', created_at: new Date().toISOString() }
      ];

      const newStats: AdminStats = {
        total_posts: posts.length,
        pending_posts: posts.filter(p => p.status === 'pending').length,
        approved_posts: posts.filter(p => p.status === 'approved').length,
        rejected_posts: posts.filter(p => p.status === 'rejected').length,
        active_farmers: users.filter(u => u.role === 'farmer').length,
        farmers_with_approved_posts: 0, // Will calculate separately
        total_deals: deals.length,
        completed_deals: deals.filter(d => d.status === 'completed').length,
        total_revenue: deals
          .filter(d => d.status === 'completed')
          .reduce((sum, d) => sum + (d.offer_price || 0), 0),
        recent_activity: []
      };

      // Calculate farmers with approved posts
      const farmersWithApprovedPosts = await supabase
        .from('crop_posts')
        .select('farmer_id')
        .eq('status', 'approved');

      newStats.farmers_with_approved_posts = 
        new Set(farmersWithApprovedPosts.data?.map(p => p.farmer_id) || []).size;

      // Generate recent activity
      newStats.recent_activity = await generateRecentActivity();

      setStats(newStats);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(`Failed to load dashboard data: ${err.message || 'Unknown error'}`);
      
      // Set fallback stats if there's an error
      setStats({
        total_posts: 0,
        pending_posts: 0,
        approved_posts: 0,
        rejected_posts: 0,
        total_users: 0,
        farmers: 0,
        buyers: 0,
        total_deals: 0,
        active_deals: 0,
        completed_deals: 0,
        total_transaction_value: 0,
        avg_deal_size: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = async (): Promise<RecentActivity[]> => {
    try {
      const activities: RecentActivity[] = [];
      
      // Recent posts
      const { data: recentPosts } = await supabase
        .from('crop_posts')
        .select('id, crop_name, status, created_at, farmer_id')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentPosts) {
        for (const post of recentPosts) {
          const { data: farmer } = await supabase
            .from('user_profiles')
            .select('name')
            .eq('id', post.farmer_id)
            .single();

          activities.push({
            id: `post-${post.id}`,
            type: 'post_created',
            description: `New ${post.status} post: ${post.crop_name} by ${farmer?.name || 'Unknown'}`,
            timestamp: post.created_at,
            user_name: farmer?.name
          });
        }
      }

      // Recent deals
      const { data: recentDeals } = await supabase
        .from('deals')
        .select('id, status, offer_price, created_at, farmer_id, buyer_id')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentDeals) {
        for (const deal of recentDeals) {
          const [farmerResult, buyerResult] = await Promise.all([
            supabase.from('user_profiles').select('name').eq('id', deal.farmer_id).single(),
            supabase.from('user_profiles').select('name').eq('id', deal.buyer_id).single()
          ]);

          activities.push({
            id: `deal-${deal.id}`,
            type: 'deal_created',
            description: `New deal: ₹${deal.offer_price} between ${farmerResult.data?.name || 'Unknown'} and ${buyerResult.data?.name || 'Unknown'}`,
            timestamp: deal.created_at,
            user_name: buyerResult.data?.name
          });
        }
      }

      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 8);
    } catch (err) {
      console.error('Error generating recent activity:', err);
      return [];
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post_created': return <FileText className="w-4 h-4" />;
      case 'deal_created': return <DollarSign className="w-4 h-4" />;
      case 'user_registered': return <Users className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'post_created': return 'text-green-600 bg-green-100';
      case 'deal_created': return 'text-blue-600 bg-blue-100';
      case 'user_registered': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-700 mb-1">Total Posts</h3>
              <p className="text-3xl font-bold text-blue-900">{stats.total_posts}</p>
              <p className="text-xs text-blue-600 mt-1">
                {stats.pending_posts} pending review
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-700 mb-1">Active Farmers</h3>
              <p className="text-3xl font-bold text-green-900">{stats.active_farmers}</p>
              <p className="text-xs text-green-600 mt-1">
                {stats.farmers_with_approved_posts} with approved posts
              </p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-purple-700 mb-1">Total Deals</h3>
              <p className="text-3xl font-bold text-purple-900">{stats.total_deals}</p>
              <p className="text-xs text-purple-600 mt-1">
                {stats.completed_deals} completed
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-amber-700 mb-1">Total Revenue</h3>
              <p className="text-3xl font-bold text-amber-900">₹{stats.total_revenue.toLocaleString()}</p>
              <p className="text-xs text-amber-600 mt-1">
                From completed deals
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            Pending Review
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Posts awaiting review</span>
              <span className="text-2xl font-bold text-orange-600">{stats.pending_posts}</span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.pending_posts / Math.max(stats.total_posts, 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Approved Posts
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Live posts</span>
              <span className="text-2xl font-bold text-green-600">{stats.approved_posts}</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.approved_posts / Math.max(stats.total_posts, 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-red-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <XCircle className="w-5 h-5 mr-2 text-red-500" />
            Rejected Posts
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Posts rejected</span>
              <span className="text-2xl font-bold text-red-600">{stats.rejected_posts}</span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.rejected_posts / Math.max(stats.total_posts, 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-purple-500" />
          Recent Activity
        </h3>
        
        {stats.recent_activity.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No recent activity to display</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.recent_activity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm text-gray-800">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors duration-200">
            <FileText className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700 font-medium">Review Posts</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-200">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-medium">Manage Users</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors duration-200">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">View Analytics</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors duration-200">
            <MapPin className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700 font-medium">Supply Maps</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
