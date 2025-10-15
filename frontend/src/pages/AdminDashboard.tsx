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
import { Shield } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const renderContent = () => {
    // This function is no longer used - content is rendered directly in JSX
    return null;
  };

  const unusedRenderContent = () => {
    switch (location.pathname) {
      case '/admin-dashboard':
        return (
          <div>
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-blue-700 mb-1">Total Posts</h3>
                      <p className="text-3xl font-bold text-blue-900">12</p>
                      <p className="text-xs text-blue-600 mt-1">3 pending review</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📄</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-green-700 mb-1">Active Farmers</h3>
                      <p className="text-3xl font-bold text-green-900">8</p>
                      <p className="text-xs text-green-600 mt-1">5 with approved posts</p>
                    </div>
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">👥</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-purple-700 mb-1">Total Deals</h3>
                      <p className="text-3xl font-bold text-purple-900">4</p>
                      <p className="text-xs text-purple-600 mt-1">2 completed</p>
                    </div>
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">💼</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-amber-700 mb-1">Total Revenue</h3>
                      <p className="text-3xl font-bold text-amber-900">₹45K</p>
                      <p className="text-xs text-amber-600 mt-1">From completed deals</p>
                    </div>
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">💰</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="flex items-center justify-center space-x-2 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors duration-200">
                    <span className="text-orange-600">📝</span>
                    <span className="text-orange-700 font-medium">Review Posts</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-200">
                    <span className="text-blue-600">👥</span>
                    <span className="text-blue-700 font-medium">Manage Users</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors duration-200">
                    <span className="text-green-600">📊</span>
                    <span className="text-green-700 font-medium">View Analytics</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors duration-200">
                    <span className="text-purple-600">🗺️</span>
                    <span className="text-purple-700 font-medium">Supply Maps</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case '/admin-dashboard/review':
        return <AdminReviewQueue />;
      case '/admin-dashboard/deals':
        return <AdminDealsManagement />;
      case '/admin-dashboard/analytics':
        return <div className="p-8 text-center text-gray-500">Analytics Dashboard - Coming Soon</div>;
      case '/admin-dashboard/supply-map':
        return <div className="p-8 text-center text-gray-500">Supply Maps - Coming Soon</div>;
      case '/admin-dashboard/users':
        return <div className="p-8 text-center text-gray-500">User Management - Coming Soon</div>;
      case '/admin-dashboard/notifications':
        return <div className="p-8 text-center text-gray-500">Notifications - Coming Soon</div>;
      case '/admin-dashboard/operations':
        return <div className="p-8 text-center text-gray-500">Operations Tools - Coming Soon</div>;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Admin Command Center</h1>
                <p className="text-slate-600">Manage and review crop posts</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            <a
              href="/admin-dashboard"
              className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                location.pathname === '/admin-dashboard'
                  ? 'border-purple-500 text-purple-700 bg-purple-50'
                  : 'border-transparent text-gray-600 hover:text-purple-700 hover:border-purple-300'
              }`}
            >
              <span className="text-lg">📊</span>
              <span className="font-medium">Overview</span>
            </a>
            <a
              href="/admin-dashboard/review"
              className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                location.pathname === '/admin-dashboard/review'
                  ? 'border-purple-500 text-purple-700 bg-purple-50'
                  : 'border-transparent text-gray-600 hover:text-purple-700 hover:border-purple-300'
              }`}
            >
              <span className="text-lg">📝</span>
              <span className="font-medium">Review Queue</span>
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">3</span>
            </a>
            <a
              href="/admin-dashboard/deals"
              className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                location.pathname === '/admin-dashboard/deals'
                  ? 'border-purple-500 text-purple-700 bg-purple-50'
                  : 'border-transparent text-gray-600 hover:text-purple-700 hover:border-purple-300'
              }`}
            >
              <span className="text-lg">💼</span>
              <span className="font-medium">Deals Management</span>
            </a>
            <a
              href="/admin-dashboard/analytics"
              className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                location.pathname === '/admin-dashboard/analytics'
                  ? 'border-purple-500 text-purple-700 bg-purple-50'
                  : 'border-transparent text-gray-600 hover:text-purple-700 hover:border-purple-300'
              }`}
            >
              <span className="text-lg">📈</span>
              <span className="font-medium">Analytics</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {location.pathname === '/admin-dashboard' && <AdminOverview />}
        {location.pathname === '/admin-dashboard/review' && <AdminReviewQueue />}
        {location.pathname === '/admin-dashboard/rejected' && <AdminRejectedPosts />}
        {location.pathname === '/admin-dashboard/deals' && <AdminDealsManagement />}
        {location.pathname === '/admin-dashboard/analytics' && <AdminAnalytics />}
        {location.pathname === '/admin-dashboard/supply-map' && (
          <div className="p-8 text-center text-gray-500">Supply Maps - Coming Soon</div>
        )}
        {location.pathname === '/admin-dashboard/users' && (
          <div className="p-8 text-center text-gray-500">User Management - Coming Soon</div>
        )}
        {location.pathname === '/admin-dashboard/notifications' && (
          <div className="p-8 text-center text-gray-500">Notifications - Coming Soon</div>
        )}
        {location.pathname === '/admin-dashboard/operations' && <AdminOperations />}
      </div>
    </div>
  );
};

export default AdminDashboard;