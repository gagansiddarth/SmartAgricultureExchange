import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Crop, Users, TrendingUp, Shield } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const features = [
    {
      icon: <Crop className="w-12 h-12 text-emerald-600" />,
      title: t('features.verified_crops'),
      description: t('features.verified_crops_desc')
    },
    {
      icon: <Users className="w-12 h-12 text-slate-600" />,
      title: t('features.direct_connection'),
      description: t('features.direct_connection_desc')
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-indigo-600" />,
      title: t('features.fair_pricing'),
      description: t('features.fair_pricing_desc')
    },
    {
      icon: <Shield className="w-12 h-12 text-amber-600" />,
      title: t('features.secure_transactions'),
      description: t('features.secure_transactions_desc')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Hero Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-100 to-indigo-200 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-full blur-2xl opacity-40"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-green-50 animate-bounce">
              <Crop className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-green-400 rounded-full animate-ping opacity-50"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-ping delay-300 opacity-50"></div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent mb-6">
            {t('app.title')}
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            A minimal, low-friction marketplace that lets farmers publish verified crop listings 
            and brands discover and buy directly — with verification, deal orchestration, and trust-building.
          </p>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6 max-w-2xl mx-auto shadow-sm">
            <p className="text-center font-medium">
              <strong className="text-green-700">🚀 Demo Ready!</strong> Phase 1 foundation is complete. Database connected, servers running, and authentication system ready.
            </p>
          </div>

          {/* Demo Accounts Info */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-8 mb-8 max-w-4xl mx-auto shadow-lg">
            <h3 className="text-xl font-bold text-amber-800 mb-6 text-center">🎭 Demo Accounts Available</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border-2 border-amber-200 shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">🌱</span>
                  <h4 className="font-bold text-green-700 text-lg">Farmer</h4>
                </div>
                <p className="text-sm text-green-600 mb-1 font-medium">Phone: +1234567890</p>
                <p className="text-sm text-green-600 font-medium">OTP: 123456</p>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-amber-200 shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">🏢</span>
                  <h4 className="font-bold text-blue-700 text-lg">Brand/Buyer</h4>
                </div>
                <p className="text-sm text-blue-600 mb-1 font-medium">Phone: +9876543210</p>
                <p className="text-sm text-blue-600 font-medium">OTP: 123456</p>
              </div>
              <div className="bg-white p-6 rounded-xl border-2 border-amber-200 shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">⚙️</span>
                  <h4 className="font-bold text-purple-700 text-lg">Admin</h4>
                </div>
                <p className="text-sm text-purple-600 mb-1 font-medium">Phone: +5555555555</p>
                <p className="text-sm text-purple-600 font-medium">OTP: 123456</p>
              </div>
            </div>
          </div>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-green-500/25 transform hover:scale-105 border border-green-400"
              >
                {t('nav.register')}
              </Link>
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 border border-blue-400"
              >
                {t('nav.login')}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user.role === 'farmer' && (
                <Link 
                  to="/crop-post" 
                  className="btn-primary text-lg px-8 py-4"
                >
                  {t('nav.post_crop')}
                </Link>
              )}
              {user.role === 'buyer' && (
                <Link 
                  to="/search" 
                  className="btn-primary text-lg px-8 py-4"
                >
                  Browse Available Crops
                </Link>
              )}
              <Link 
                to="/dashboard" 
                className="btn-secondary text-lg px-8 py-4"
              >
                {t('nav.dashboard')}
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-gray-200">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center shadow-md">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How it Works Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-green-100 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border-2 border-green-200">
                <span className="text-3xl font-bold text-green-700">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-green-800">Post Your Crop</h3>
              <p className="text-green-600 leading-relaxed">
                Farmers post their crop details with photos and location verification
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border-2 border-blue-200">
                <span className="text-3xl font-bold text-blue-700">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-800">Get Verified</h3>
              <p className="text-blue-600 leading-relaxed">
                Our system verifies the crop authenticity and approves the listing
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-purple-100 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border-2 border-purple-200">
                <span className="text-3xl font-bold text-purple-700">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-purple-800">Connect & Deal</h3>
              <p className="text-purple-600 leading-relaxed">
                Buyers discover crops, connect with farmers, and finalize deals
              </p>
            </div>
          </div>
        </div>

        {/* Demo Status Section */}
        <div className="bg-blue-600 rounded-2xl p-8 text-white text-center mb-8">
          <h2 className="text-3xl font-bold mb-8">Phase 1 Demo Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">✅</div>
              <div className="text-blue-100">Database Connected</div>
              <div className="text-sm text-blue-200">PostgreSQL + Schema Ready</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">✅</div>
              <div className="text-blue-100">Backend Running</div>
              <div className="text-sm text-blue-200">Node.js + Express API</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">✅</div>
              <div className="text-blue-100">Frontend Ready</div>
              <div className="text-sm text-blue-200">React + Tailwind CSS</div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-green-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-8">Join the Smart Agriculture Revolution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Active Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-green-100">Verified Buyers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-green-100">Successful Deals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
