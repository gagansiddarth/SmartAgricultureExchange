import React from 'react';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #eff6ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '1200px' }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem',
          lineHeight: '1.1'
        }}>
          <span style={{ color: '#16a34a' }}>Smart Agriculture</span>
          <br />
          Exchange
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#6b7280',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          Connect farmers directly with buyers. No middlemen. Better prices. Transparent transactions.
        </p>
        <div style={{ marginBottom: '4rem' }}>
          <button style={{
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '12px 32px',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: '500',
            border: 'none',
            marginRight: '1rem',
            cursor: 'pointer'
          }}>
            Get Started
          </button>
          <button style={{
            backgroundColor: 'white',
            color: '#16a34a',
            border: '2px solid #16a34a',
            padding: '12px 32px',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Sign In
          </button>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#dcfce7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              fontSize: '1.5rem'
            }}>
              🌱
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              Direct Connection
            </h3>
            <p style={{ color: '#6b7280' }}>
              Connect directly with farmers and buyers
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#dcfce7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              fontSize: '1.5rem'
            }}>
              📱
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              Mobile First
            </h3>
            <p style={{ color: '#6b7280' }}>
              Access from anywhere with mobile optimization
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#dcfce7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              fontSize: '1.5rem'
            }}>
              🔒
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              Secure
            </h3>
            <p style={{ color: '#6b7280' }}>
              All transactions are secure and verified
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#dcfce7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              fontSize: '1.5rem'
            }}>
              📊
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              Analytics
            </h3>
            <p style={{ color: '#6b7280' }}>
              Track your sales and market trends
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
