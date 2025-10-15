import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const LoginSimple: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Handle messages from registration
  useEffect(() => {
    const state = location.state as any;
    if (state?.message) {
      setSuccessMessage(state.message);
      if (state.email) {
        setEmail(state.email);
      }
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.log('Supabase not configured, using demo login');
        
        // Demo login for testing
        if (email === 'farmer@demo.com' && password === 'password') {
          // Store demo user in localStorage
          localStorage.setItem('demo_user', JSON.stringify({
            id: 'demo-farmer-1',
            email: 'farmer@demo.com',
            name: 'Demo Farmer',
            role: 'farmer'
          }));
          navigate('/dashboard');
          return;
        }
        
        if (email === 'buyer@demo.com' && password === 'password') {
          localStorage.setItem('demo_user', JSON.stringify({
            id: 'demo-buyer-1',
            email: 'buyer@demo.com',
            name: 'Demo Buyer',
            role: 'buyer'
          }));
          navigate('/dashboard');
          return;
        }
        
        if (email === 'admin@demo.com' && password === 'password') {
          localStorage.setItem('demo_user', JSON.stringify({
            id: 'demo-admin-1',
            email: 'admin@demo.com',
            name: 'Demo Admin',
            role: 'admin'
          }));
          navigate('/dashboard');
          return;
        }
        
        setError('Invalid credentials. Use farmer@demo.com, buyer@demo.com, or admin@demo.com with password "password"');
        return;
      }

      // Supabase login
      console.log('🔐 Attempting Supabase login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Supabase login error:', error);
        setError(error.message);
      } else {
        console.log('✅ Supabase login successful:', data);
        console.log('👤 User data:', data.user);
        console.log('📋 User metadata:', data.user?.user_metadata);
        
        // Check if user has a role, if not, set a default one
        const userRole = data.user?.user_metadata?.role;
        if (!userRole) {
          console.log('⚠️ No role found, setting default role based on email');
          // Set role based on email for demo users
          let defaultRole = 'user';
          if (email.includes('farmer')) defaultRole = 'farmer';
          else if (email.includes('buyer')) defaultRole = 'buyer';
          else if (email.includes('admin')) defaultRole = 'admin';
          
          // Update user metadata
          try {
            const { error: updateError } = await supabase.auth.updateUser({
              data: { role: defaultRole }
            });
            if (updateError) {
              console.error('❌ Error updating user role:', updateError);
            } else {
              console.log('✅ User role updated to:', defaultRole);
            }
          } catch (updateErr) {
            console.error('❌ Error updating user role:', updateErr);
          }
        }
        
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center p-5">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-orange-100 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">🌱</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">AgriExchange</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your Smart Agriculture Exchange account
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg mb-4 text-sm">
              ✅ {successMessage}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-3 border border-orange-200 rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-3 border border-orange-200 rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-base font-medium border-none mb-4 transition-all duration-200 ${
              loading 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white cursor-pointer transform hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
              Sign up
            </Link>
          </p>
          <Link to="/" className="text-gray-600 hover:text-gray-800 text-sm mt-4 inline-block transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSimple;
