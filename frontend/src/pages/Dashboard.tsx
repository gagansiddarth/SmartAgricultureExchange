import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Crop, ShoppingCart, MessageCircle, BarChart3, Shield, Users, FileText, TrendingUp,
  Plus, Eye, AlertTriangle, CheckCircle, DollarSign,
  Activity, PieChart, Settings, Bell, Download, Search as SearchIcon
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Role-specific dashboard cards
  const getDashboardCards = () => {
    if (user?.role === 'farmer') {
      return [
        {
          icon: <Crop className="w-8 h-8 text-green-600" />,
          title: 'My Crop Posts',
          count: '3',
          description: 'Manage your crop listings',
          color: 'bg-green-50 border-green-200'
        },
        {
          icon: <ShoppingCart className="w-8 h-8 text-blue-600" />,
          title: 'Active Deals',
          count: '2',
          description: 'Track your transactions',
          color: 'bg-blue-50 border-blue-200'
        },
        {
          icon: <MessageCircle className="w-8 h-8 text-purple-600" />,
          title: 'Messages',
          count: '5',
          description: 'Chat with buyers',
          color: 'bg-purple-50 border-purple-200'
        },
        {
          icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
          title: 'Earnings',
          count: '₹45,000',
          description: 'This month',
          color: 'bg-orange-50 border-orange-200'
        }
      ];
    } else if (user?.role === 'buyer') {
      return [
        {
          icon: <Crop className="w-8 h-8 text-green-600" />,
          title: 'Available Crops',
          count: '127',
          description: 'Browse crop listings',
          color: 'bg-green-50 border-green-200'
        },
        {
          icon: <ShoppingCart className="w-8 h-8 text-blue-600" />,
          title: 'My Orders',
          count: '8',
          description: 'Track your purchases',
          color: 'bg-blue-50 border-blue-200'
        },
        {
          icon: <MessageCircle className="w-8 h-8 text-purple-600" />,
          title: 'Negotiations',
          count: '12',
          description: 'Chat with farmers',
          color: 'bg-purple-50 border-purple-200'
        },
        {
          icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
          title: 'Savings',
          count: '₹12,000',
          description: 'Direct purchases',
          color: 'bg-orange-50 border-orange-200'
        }
      ];
    } else if (user?.role === 'admin') {
      return [
        {
          icon: <FileText className="w-8 h-8 text-green-600" />,
          title: 'Pending Reviews',
          count: '23',
          description: 'Posts awaiting approval',
          color: 'bg-green-50 border-green-200'
        },
        {
          icon: <Users className="w-8 h-8 text-blue-600" />,
          title: 'Total Users',
          count: '1,247',
          description: 'Farmers and buyers',
          color: 'bg-blue-50 border-blue-200'
        },
        {
          icon: <ShoppingCart className="w-8 h-8 text-purple-600" />,
          title: 'Active Deals',
          count: '156',
          description: 'Ongoing transactions',
          color: 'bg-purple-50 border-purple-200'
        },
        {
          icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
          title: 'Platform Revenue',
          count: '₹2.4L',
          description: 'This month',
          color: 'bg-orange-50 border-orange-200'
        }
      ];
    }
    return [];
  };


  // Farmer Interface - Natural Earth Tones with White Background
  const FarmerDashboard = () => (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Natural Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-50 to-yellow-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full blur-2xl opacity-40"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Natural Header with Earth Tones */}
        <div className="text-center mb-16">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-md border-4 border-green-50 animate-bounce">
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
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 text-center shadow-md transform transition-all duration-300 hover:scale-102 border-2 border-green-100">
              <div className="text-5xl font-bold text-green-700 mb-2">3</div>
              <div className="text-green-600 font-medium">Active Harvests</div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-4">
                <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
          <div className="group">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-8 text-center shadow-md transform transition-all duration-300 hover:scale-102 border-2 border-amber-100">
              <div className="text-5xl font-bold text-amber-700 mb-2">₹45K</div>
              <div className="text-amber-600 font-medium">This Season</div>
              <div className="w-full bg-amber-200 rounded-full h-2 mt-4">
                <div className="bg-amber-500 h-2 rounded-full w-4/5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Natural Action Buttons */}
        <div className="max-w-lg mx-auto space-y-6">
          <Link to="/crop-post" className="group block">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-6 px-8 rounded-2xl flex items-center justify-center text-xl font-semibold shadow-md transform transition-all duration-300 hover:scale-102 hover:shadow-green-500/25 hover:from-green-600 hover:to-emerald-700 border border-green-400">
              <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
              Plant New Seeds
              <div className="ml-3 w-2 h-2 bg-green-200 rounded-full animate-ping opacity-70"></div>
            </div>
          </Link>
          <button className="group w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-6 px-8 rounded-2xl flex items-center justify-center text-xl font-semibold shadow-md transform transition-all duration-300 hover:scale-102 hover:shadow-amber-500/25 hover:from-amber-600 hover:to-yellow-600 border border-amber-400">
            <Eye className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
            View My Garden
          </button>
          <button className="group w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-6 px-8 rounded-2xl flex items-center justify-center text-xl font-semibold shadow-md transform transition-all duration-300 hover:scale-102 hover:shadow-green-500/25 hover:from-green-700 hover:to-emerald-800 border border-green-500">
            <MessageCircle className="w-6 h-6 mr-3 group-hover:animate-pulse" />
            Farmer Chat (5)
          </button>
        </div>

        {/* Natural Activity Feed */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-green-800">
            Garden Updates
          </h3>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl shadow-sm transform transition-all duration-300 hover:scale-102 hover:shadow-md border-2 border-green-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <div className="font-semibold text-green-800 text-lg">Rice harvest blessed by rain</div>
                  <div className="text-green-600 font-medium">2 hours ago</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl shadow-sm transform transition-all duration-300 hover:scale-102 hover:shadow-md border-2 border-amber-100">
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
          </div>
        </div>
      </div>
    </div>
  );

  // Buyer Interface - Professional Blue Theme with White Background
  const BuyerDashboard = () => (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50 to-transparent rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-50 to-transparent rounded-full blur-3xl opacity-60"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-8 py-12">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 shadow-md border-2 border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center mr-4 shadow-sm border border-blue-200">
                  <ShoppingCart className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-blue-800">
                    Procurement Hub
                  </h1>
                  <p className="text-blue-600 text-lg">Premium agricultural sourcing platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-sm text-blue-600 font-medium">Active Orders</div>
                <div className="text-3xl font-bold text-blue-700">8</div>
                <div className="w-16 bg-blue-500/30 rounded-full h-1 mt-2">
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-1 rounded-full w-4/5 animate-pulse"></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-blue-600 font-medium">Total Saved</div>
                <div className="text-3xl font-bold text-emerald-600">₹12K</div>
                <div className="w-16 bg-emerald-500/30 rounded-full h-1 mt-2">
                  <div className="bg-gradient-to-r from-emerald-400 to-green-400 h-1 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Search Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-12 shadow-md border-2 border-blue-100">
          <div className="flex gap-6">
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-xl"></div>
              <input
                type="text"
                placeholder="Search premium crops, verified farmers, or locations..."
                className="relative w-full pl-12 pr-6 py-4 bg-white border border-blue-200 rounded-xl text-blue-800 placeholder-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg font-medium shadow-sm"
              />
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-6 h-6" />
            </div>
            <Link to="/search" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-semibold text-lg transform hover:scale-105">
              Search
            </Link>
          </div>
        </div>

        {/* Premium Category Grid */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-12 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg mr-3 flex items-center justify-center">
              <span className="text-white text-sm font-bold">🏢</span>
            </div>
            Procurement Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/search" className="group">
              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-700/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 text-center hover:from-blue-600/30 hover:to-indigo-700/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🌾</div>
                <div className="font-bold text-white text-lg mb-1">Cereals</div>
                <div className="text-blue-300 text-sm">127 premium listings</div>
                <div className="w-full bg-blue-500/20 rounded-full h-1 mt-3">
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-1 rounded-full w-4/5"></div>
                </div>
              </div>
            </Link>
            <Link to="/search" className="group">
              <div className="bg-gradient-to-br from-emerald-600/20 to-green-700/20 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-6 text-center hover:from-emerald-600/30 hover:to-green-700/30 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🥕</div>
                <div className="font-bold text-white text-lg mb-1">Vegetables</div>
                <div className="text-emerald-300 text-sm">89 organic listings</div>
                <div className="w-full bg-emerald-500/20 rounded-full h-1 mt-3">
                  <div className="bg-gradient-to-r from-emerald-400 to-green-400 h-1 rounded-full w-3/4"></div>
                </div>
              </div>
            </Link>
            <Link to="/search" className="group">
              <div className="bg-gradient-to-br from-orange-600/20 to-red-700/20 backdrop-blur-xl border border-orange-500/30 rounded-xl p-6 text-center hover:from-orange-600/30 hover:to-red-700/30 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/25">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🌶️</div>
                <div className="font-bold text-white text-lg mb-1">Spices</div>
                <div className="text-orange-300 text-sm">45 premium varieties</div>
                <div className="w-full bg-orange-500/20 rounded-full h-1 mt-3">
                  <div className="bg-gradient-to-r from-orange-400 to-red-400 h-1 rounded-full w-2/3"></div>
                </div>
              </div>
            </Link>
            <Link to="/search" className="group">
              <div className="bg-gradient-to-br from-purple-600/20 to-indigo-700/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 text-center hover:from-purple-600/30 hover:to-indigo-700/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🏭</div>
                <div className="font-bold text-white text-lg mb-1">Cash Crops</div>
                <div className="text-purple-300 text-sm">67 bulk listings</div>
                <div className="w-full bg-purple-500/20 rounded-full h-1 mt-3">
                  <div className="bg-gradient-to-r from-purple-400 to-indigo-400 h-1 rounded-full w-5/6"></div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Premium Featured Listings */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg mr-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">⭐</span>
              </div>
              Featured Premium Listings
            </h2>
            <Link to="/search" className="text-blue-400 hover:text-cyan-400 font-semibold text-lg transition-colors duration-300 hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group">
              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-700/20 backdrop-blur-xl border border-blue-500/30 rounded-xl overflow-hidden hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🌾</span>
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                    PREMIUM
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white text-lg mb-2">Premium Basmati Rice</h3>
                  <p className="text-blue-300 text-sm mb-3">Karnal, Haryana • Verified Farmer</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-400">₹3,200</span>
                    <span className="text-slate-400 text-sm">per quintal</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-emerald-600/20 to-green-700/20 backdrop-blur-xl border border-emerald-500/30 rounded-xl overflow-hidden hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105">
                <div className="h-40 bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center relative overflow-hidden">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🥕</span>
                  <div className="absolute top-2 right-2 bg-green-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                    ORGANIC
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white text-lg mb-2">Fresh Tomatoes</h3>
                  <p className="text-emerald-300 text-sm mb-3">Kolar, Karnataka • Certified Organic</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-400">₹2,500</span>
                    <span className="text-slate-400 text-sm">per quintal</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-orange-600/20 to-red-700/20 backdrop-blur-xl border border-orange-500/30 rounded-xl overflow-hidden hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                <div className="h-40 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center relative overflow-hidden">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🌶️</span>
                  <div className="absolute top-2 right-2 bg-red-400 text-white px-2 py-1 rounded-full text-xs font-bold">
                    HOT
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white text-lg mb-2">Guntur Chilli</h3>
                  <p className="text-orange-300 text-sm mb-3">Guntur, Andhra Pradesh • High Pungency</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-400">₹8,000</span>
                    <span className="text-slate-400 text-sm">per quintal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Admin Interface - Soft Professional Command Center (Muted Purples + Grays)
  const AdminDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Soft Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-purple-100/20 to-indigo-100/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>
      
      <div className="relative z-10 container mx-auto px-8 py-12">
        {/* Soft Command Center Header */}
        <div className="bg-gradient-to-r from-slate-100/80 to-purple-100/80 backdrop-blur-2xl rounded-3xl p-8 mb-12 shadow-lg border border-purple-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-300 via-purple-400 to-indigo-400"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-cyan-300 rounded-2xl flex items-center justify-center shadow-md">
                  <Shield className="w-10 h-10 text-purple-700" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-300 rounded-full animate-ping opacity-60"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-purple-300 rounded-full animate-ping delay-500 opacity-60"></div>
              </div>
              <div>
                <h1 className="text-5xl font-bold text-slate-700 mb-2">
                  Command Center
                </h1>
                <p className="text-slate-600 text-xl font-medium">Advanced platform analytics & control</p>
                <div className="flex items-center mt-2 space-x-4 text-sm">
                  <span className="flex items-center text-cyan-600">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                    System Online
                  </span>
                  <span className="flex items-center text-purple-600">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                    All Services Active
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 flex items-center font-semibold transform hover:scale-105">
                <Download className="w-5 h-5 mr-2" />
                Export Data
              </button>
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center font-semibold transform hover:scale-105">
                <Settings className="w-5 h-5 mr-2" />
                System Config
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="group">
            <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-orange-300 font-medium">Pending Reviews</div>
                  <div className="text-3xl font-bold text-white animate-pulse">23</div>
                  <div className="text-xs text-orange-400">+3 from yesterday</div>
                </div>
              </div>
              <div className="w-full bg-orange-500/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="group">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-300 font-medium">Total Users</div>
                  <div className="text-3xl font-bold text-white animate-pulse">1,247</div>
                  <div className="text-xs text-blue-400">+47 this week</div>
                </div>
              </div>
              <div className="w-full bg-blue-500/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full w-5/6 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="group">
            <div className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-emerald-300 font-medium">Active Deals</div>
                  <div className="text-3xl font-bold text-white animate-pulse">156</div>
                  <div className="text-xs text-emerald-400">+12 today</div>
                </div>
              </div>
              <div className="w-full bg-emerald-500/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full w-4/5 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="group">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-purple-300 font-medium">Revenue</div>
                  <div className="text-3xl font-bold text-white animate-pulse">₹2.4L</div>
                  <div className="text-xs text-purple-400">+15% this month</div>
                </div>
              </div>
              <div className="w-full bg-purple-500/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Reviews Queue */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/60 to-purple-900/60 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg mr-3 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Review Queue
              </h2>
              <button className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300 hover:underline">
                View All →
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-500/10 to-red-600/10 backdrop-blur-xl border border-orange-500/30 rounded-xl p-6 hover:shadow-orange-500/25 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-lg">Basmati Rice - Rajesh Kumar</h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded-full border border-orange-500/30">PENDING</span>
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-slate-300 mb-4">500 quintals • ₹3,200 per quintal • Karnal, Haryana</p>
                <div className="flex gap-3">
                  <button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 font-semibold transform hover:scale-105">
                    ✓ Approve
                  </button>
                  <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 font-semibold transform hover:scale-105">
                    ✗ Reject
                  </button>
                  <button className="border border-cyan-500/50 text-cyan-300 px-6 py-2 rounded-lg hover:bg-cyan-500/10 transition-all duration-300 font-semibold">
                    View Details
                  </button>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500/10 to-red-600/10 backdrop-blur-xl border border-orange-500/30 rounded-xl p-6 hover:shadow-orange-500/25 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-lg">Wheat - Suresh Patel</h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded-full border border-orange-500/30">PENDING</span>
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-slate-300 mb-4">800 quintals • ₹2,200 per quintal • Meerut, UP</p>
                <div className="flex gap-3">
                  <button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 font-semibold transform hover:scale-105">
                    ✓ Approve
                  </button>
                  <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 font-semibold transform hover:scale-105">
                    ✗ Reject
                  </button>
                  <button className="border border-cyan-500/50 text-cyan-300 px-6 py-2 rounded-lg hover:bg-cyan-500/10 transition-all duration-300 font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/60 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl border border-cyan-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg mr-3 flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              Control Panel
            </h2>
            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center font-bold text-lg transform hover:scale-105">
                <FileText className="w-5 h-5 mr-3" />
                Review Posts
              </button>
              <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center font-bold text-lg transform hover:scale-105">
                <Users className="w-5 h-5 mr-3" />
                Manage Users
              </button>
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center font-bold text-lg transform hover:scale-105">
                <BarChart3 className="w-5 h-5 mr-3" />
                Analytics
              </button>
              <button className="w-full bg-gradient-to-r from-slate-500 to-gray-600 text-white py-4 px-6 rounded-xl hover:from-slate-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-slate-500/25 flex items-center justify-center font-bold text-lg transform hover:scale-105">
                <Bell className="w-5 h-5 mr-3" />
                Notifications
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/60 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl border border-cyan-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg mr-3 flex items-center justify-center">
                <PieChart className="w-4 h-4 text-white" />
              </div>
              User Analytics
            </h2>
            <div className="h-64 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-xl flex items-center justify-center border border-purple-500/30">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <PieChart className="w-8 h-8 text-white" />
                </div>
                <p className="text-purple-300 font-semibold">Advanced Charts Loading...</p>
                <p className="text-slate-400 text-sm">Real-time data visualization</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/60 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl border border-cyan-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg mr-3 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              Revenue Analytics
            </h2>
            <div className="h-64 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl flex items-center justify-center border border-cyan-500/30">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <p className="text-cyan-300 font-semibold">Live Revenue Tracking...</p>
                <p className="text-slate-400 text-sm">Real-time financial metrics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render appropriate dashboard based on role
  if (user?.role === 'farmer') {
    return <FarmerDashboard />;
  } else if (user?.role === 'buyer') {
    return <BuyerDashboard />;
  } else if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Default fallback
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg mb-8">
          <p className="text-center">
            <strong>Demo Mode:</strong> This is a demonstration of the Smart Agriculture Exchange platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

