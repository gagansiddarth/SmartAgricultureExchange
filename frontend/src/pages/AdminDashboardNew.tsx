import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminNavigation from '../components/admin/AdminNavigation';
import AdminOverview from './admin/AdminOverview';
import AdminReviewQueue from './admin/AdminReviewQueue';
import AdminRejectedPosts from './admin/AdminRejectedPosts';
import AdminDealsManagement from './admin/AdminDealsManagement';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminOperations from './admin/AdminOperations';
import { 
  Shield, 
  LogOut, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X
} from 'lucide-react';

const AdminDashboardNew: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        navigate('/login');
        return;
      }

      // Check if user is admin from metadata (since profiles don't exist yet)
      const userRole = user.user_metadata?.role;
      
      if (userRole !== 'admin') {
        navigate('/dashboard');
        return;
      }
    } catch (err) {
      console.error('Error checking admin access:', err);
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getCurrentPageTitle = () => {
    switch (location.pathname) {
      case '/admin-dashboard': return 'Overview';
      case '/admin-dashboard/review': return 'Review Queue';
      case '/admin-dashboard/rejected': return 'Rejected Posts';
      case '/admin-dashboard/deals': return 'Deals Management';
      case '/admin-dashboard/analytics': return 'Analytics';
      case '/admin-dashboard/operations': return 'Operations';
      default: return 'Admin Dashboard';
    }
  };

  const getCurrentPageDescription = () => {
    switch (location.pathname) {
      case '/admin-dashboard': return 'Platform overview and key metrics';
      case '/admin-dashboard/review': return 'Review and approve crop posts';
      case '/admin-dashboard/rejected': return 'Manage rejected posts and re-evaluations';
      case '/admin-dashboard/deals': return 'Monitor and manage platform deals';
      case '/admin-dashboard/analytics': return 'Platform analytics and insights';
      case '/admin-dashboard/operations': return 'System operations and tools';
      default: return 'Admin control center';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Premium Purple Theme */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{getCurrentPageTitle()}</h1>
                <p className="text-purple-200 text-lg">{getCurrentPageDescription()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-3 text-white hover:bg-white/10 rounded-2xl transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-3 text-white hover:bg-white/10 rounded-2xl transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 backdrop-blur-sm border border-white/20 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Premium Design */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white shadow-2xl lg:shadow-lg transition-transform duration-300 ease-in-out`}>
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
                  <p className="text-sm text-gray-600">Platform Management</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-6">
              <nav className="space-y-2">
                <a
                  href="/admin-dashboard"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    location.pathname === '/admin-dashboard'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-purple-600 text-sm">📊</span>
                  </div>
                  <span className="font-medium">Overview</span>
                </a>

                <a
                  href="/admin-dashboard/review"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    location.pathname === '/admin-dashboard/review'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                    <span className="text-orange-600 text-sm">📝</span>
                  </div>
                  <span className="font-medium">Review Queue</span>
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">5</span>
                </a>

                <a
                  href="/admin-dashboard/rejected"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    location.pathname === '/admin-dashboard/rejected'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                    <span className="text-red-600 text-sm">🔄</span>
                  </div>
                  <span className="font-medium">Rejected Posts</span>
                </a>

                <a
                  href="/admin-dashboard/deals"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    location.pathname === '/admin-dashboard/deals'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-green-600 text-sm">💼</span>
                  </div>
                  <span className="font-medium">Deals Management</span>
                </a>

                <a
                  href="/admin-dashboard/analytics"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    location.pathname === '/admin-dashboard/analytics'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📈</span>
                  </div>
                  <span className="font-medium">Analytics</span>
                </a>

                <a
                  href="/admin-dashboard/operations"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    location.pathname === '/admin-dashboard/operations'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-gray-600 text-sm">⚙️</span>
                  </div>
                  <span className="font-medium">Operations</span>
                </a>
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 border-t border-gray-100">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-sm">👑</span>
                  </div>
                  <span className="font-semibold text-gray-900">Super Admin</span>
                </div>
                <p className="text-sm text-gray-600">Full platform access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="p-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{getCurrentPageTitle()}</h2>
                  <p className="text-gray-600 mt-1">{getCurrentPageDescription()}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {location.pathname === '/admin-dashboard' && <AdminOverview />}
              {location.pathname === '/admin-dashboard/review' && <AdminReviewQueue />}
              {location.pathname === '/admin-dashboard/rejected' && <AdminRejectedPosts />}
              {location.pathname === '/admin-dashboard/deals' && <AdminDealsManagement />}
              {location.pathname === '/admin-dashboard/analytics' && <AdminAnalytics />}
              {location.pathname === '/admin-dashboard/operations' && <AdminOperations />}
              {location.pathname === '/admin-dashboard/supply-map' && (
                <div className="p-12 text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🗺️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Supply Maps</h3>
                  <p className="text-gray-600">Coming soon - Interactive supply chain visualization</p>
                </div>
              )}
              {location.pathname === '/admin-dashboard/users' && (
                <div className="p-12 text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">User Management</h3>
                  <p className="text-gray-600">Coming soon - Comprehensive user administration</p>
                </div>
              )}
              {location.pathname === '/admin-dashboard/notifications' && (
                <div className="p-12 text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Notifications</h3>
                  <p className="text-gray-600">Coming soon - Platform-wide notification management</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardNew;
