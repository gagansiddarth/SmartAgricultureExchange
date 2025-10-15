import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import pages
import LoginSimple from './pages/LoginSimple';
import RegisterSimple from './pages/RegisterSimple';
import DashboardSimple from './pages/DashboardSimple';
import FarmerDashboard from './pages/FarmerDashboardSimple';
import AdminDashboard from './pages/AdminDashboardNew';
import BuyerDashboard from './pages/BuyerDashboard';
import BuyerChat from './pages/BuyerChat';
import BuyerOffer from './pages/BuyerOffer';
import BuyerDeals from './pages/BuyerDeals';
import CropPost from './pages/CropPost';
import MyPosts from './pages/MyPosts';
import CropPostDetail from './pages/CropPostDetail';
import FindPrice from './pages/FindPrice';
import CropAdvice from './pages/CropAdvice';

// Home Page Component - Light Peach Theme with Fixed Layout
const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        {/* Background Gradient - Light Peach */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50"></div>
        
        {/* Navigation */}
        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">🌱</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">AgriExchange</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
              >
                Sign In
              </Link>
              <Link to="/register">
                <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Smart Agriculture
                </span>
                <br />
                <span className="text-gray-700">Exchange</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                Connect farmers directly with buyers. No middlemen. Better prices. 
                Transparent transactions. Built for the future of agriculture.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4">
                <Link to="/register">
                  <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                    Start Trading
                  </button>
                </Link>
                <Link to="/login">
                  <button className="border-2 border-orange-300 hover:border-orange-400 text-gray-800 hover:text-gray-900 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Cards - Positioned at bottom */}
        <div className="relative z-10 pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-orange-100">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-orange-600 text-2xl">🌾</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Direct Connection</h3>
                <p className="text-gray-600 text-sm">Connect directly with farmers and buyers without intermediaries</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-orange-100">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-orange-600 text-2xl">📱</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Mobile First</h3>
                <p className="text-gray-600 text-sm">Access from anywhere with our mobile-optimized platform</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-orange-100">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-orange-600 text-2xl">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure & Verified</h3>
                <p className="text-gray-600 text-sm">All transactions are secure with comprehensive verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Built for Modern Agriculture</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering farmers and buyers with technology-driven solutions for transparent, efficient trading.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200 border border-orange-100">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Real-time Analytics</h3>
              <p className="text-gray-600">Track market trends and optimize your trading decisions</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200 border border-orange-100">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Direct Communication</h3>
              <p className="text-gray-600">Chat directly with farmers and buyers for better deals</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200 border border-orange-100">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Global Reach</h3>
              <p className="text-gray-600">Connect with buyers and farmers from across regions</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200 border border-orange-100">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Instant Trading</h3>
              <p className="text-gray-600">Make offers and close deals in real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Transform Agriculture?</h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of farmers and buyers already using our platform to create better trading experiences.
          </p>
          <Link to="/register">
            <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl">
              Get Started Today
        </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">🌱</span>
              </div>
              <span className="text-lg font-semibold">AgriExchange</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 AgriExchange. Transforming agriculture through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginSimple />} />
          <Route path="/register" element={<RegisterSimple />} />
          <Route path="/dashboard" element={<DashboardSimple />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/buyer-deals" element={<BuyerDeals />} />
          <Route path="/buyer-chat/:farmerId" element={<BuyerChat />} />
          <Route path="/buyer-offer/:postId" element={<BuyerOffer />} />
          <Route path="/crop-post" element={<CropPost />} />
          <Route path="/crop-post/:id" element={<CropPostDetail />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/find-price" element={<FindPrice />} />
          <Route path="/crop-advice" element={<CropAdvice />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
