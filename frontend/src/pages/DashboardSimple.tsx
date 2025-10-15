import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

const DashboardSimple: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: number;
    
    const getUser = async () => {
      try {
        // First check for demo user in localStorage (fallback)
        const demoUser = localStorage.getItem('demo_user');
        if (demoUser) {
          console.log('🎭 Found demo user in localStorage:', demoUser);
          const userData = JSON.parse(demoUser);
          clearTimeout(timeoutId); // Clear the timeout
          setLoading(false);
          
          // Redirect based on demo user role
          if (userData.role === 'farmer') {
            console.log('🌱 Redirecting to farmer dashboard (demo)...');
            navigate('/farmer-dashboard', { replace: true });
            return;
          }
          if (userData.role === 'buyer') {
            console.log('🏢 Redirecting to buyer dashboard (demo)...');
            navigate('/buyer-dashboard', { replace: true });
            return;
          }
          if (userData.role === 'admin') {
            console.log('👑 Redirecting to admin dashboard (demo)...');
            navigate('/admin-dashboard', { replace: true });
            return;
          }
        }

        console.log('🔍 Fetching user data from Supabase...');
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('❌ Supabase auth error:', error);
          clearTimeout(timeoutId);
          setLoading(false);
          setError('Authentication error. Please try logging in again.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        if (!user) {
          console.log('❌ No Supabase user found');
          clearTimeout(timeoutId);
          setLoading(false);
          setError('No user session found. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        console.log('✅ Supabase user found:', user);
        console.log('👤 User metadata:', user.user_metadata);
        
        const userRole = user.user_metadata?.role;
        console.log('🎭 User role:', userRole);
        
        // Clear timeout and set loading to false immediately
        clearTimeout(timeoutId);
        setLoading(false);
        
        // Redirect based on role
        if (userRole === 'farmer') {
          console.log('🌱 Redirecting to farmer dashboard...');
          navigate('/farmer-dashboard', { replace: true });
          return;
        }

        if (userRole === 'buyer') {
          console.log('🏢 Redirecting to buyer dashboard...');
          navigate('/buyer-dashboard', { replace: true });
          return;
        }

        if (userRole === 'admin') {
          console.log('👑 Redirecting to admin dashboard...');
          navigate('/admin-dashboard', { replace: true });
          return;
        }

        // If no role or unrecognized role, show the simple dashboard
        console.log('📊 Showing simple dashboard (no specific role)');
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name,
          role: userRole
        });
        
      } catch (err) {
        console.error('❌ Error fetching user:', err);
        clearTimeout(timeoutId);
        setLoading(false);
        setError('An error occurred while loading your dashboard.');
      }
    };

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      console.log('⏰ Loading timeout reached, showing fallback');
      setLoading(false);
      setError('Loading took too long. Please try logging in again.');
    }, 3000); // Reduced to 3 seconds

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event, session ? 'session exists' : 'no session');
      if (event === 'SIGNED_OUT' || !session) {
        clearTimeout(timeoutId);
        navigate('/login');
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #eff6ff 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Loading your dashboard...</p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            This may take a few seconds
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #eff6ff 100%)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Loading Error</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{error}</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go Back to Login
          </button>
        </div>
      </div>
    );
  }

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'farmer': return '#16a34a';
      case 'buyer': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'farmer': return '🌱';
      case 'buyer': return '🏢';
      default: return '👤';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #eff6ff 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              Smart Agriculture Exchange
            </h1>
            <p style={{ color: '#6b7280' }}>
              Welcome back, {user?.name || 'User'}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Logout
          </button>
        </div>

        {/* User Info Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              fontSize: '2rem',
              backgroundColor: '#f3f4f6',
              padding: '1rem',
              borderRadius: '50%'
            }}>
              {getRoleIcon(user?.role)}
            </div>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.25rem'
              }}>
                {user?.name || 'User'}
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                {user?.email}
              </p>
              <span style={{
                backgroundColor: getRoleColor(user?.role),
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}>
                {user?.role || 'User'}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {user?.role === 'farmer' ? (
                <>
                  <button style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}>
                    🌱 Post New Crop
                  </button>
                  <button style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}>
                    📊 View My Posts
                  </button>
                </>
              ) : (
                <>
                  <button style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}>
                    🔍 Browse Crops
                  </button>
                  <button style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}>
                    💼 My Orders
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Statistics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <span style={{ color: '#6b7280' }}>Total Posts</span>
                <span style={{ fontWeight: '600', color: '#1f2937' }}>0</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <span style={{ color: '#6b7280' }}>Active Orders</span>
                <span style={{ fontWeight: '600', color: '#1f2937' }}>0</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <span style={{ color: '#6b7280' }}>Total Revenue</span>
                <span style={{ fontWeight: '600', color: '#1f2937' }}>₹0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          marginTop: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Recent Activity
          </h3>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📝</div>
            <p>No recent activity to show</p>
            <p style={{ fontSize: '0.875rem' }}>
              Start by {user?.role === 'farmer' ? 'posting your crops' : 'browsing available crops'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSimple;
