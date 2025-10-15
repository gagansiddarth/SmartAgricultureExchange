import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import * as authControllerSupabase from './controllers/authControllerSupabase';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Smart Agriculture Exchange API',
    version: '1.0.0',
    database: 'Supabase (Demo Mode)'
  });
});

// API Routes
const authRouter = express.Router();

// OTP endpoints
authRouter.post('/send-otp', authControllerSupabase.sendOTP);
authRouter.post('/verify-otp', authControllerSupabase.verifyOTP);

// Profile endpoints
authRouter.get('/profile', authControllerSupabase.getProfile);
authRouter.put('/profile', authControllerSupabase.updateProfile);

// Auth endpoints
authRouter.post('/logout', authControllerSupabase.logout);

app.use('/api/auth', authRouter);

// Demo endpoints for testing Supabase integration
app.get('/api/demo/users', async (req, res) => {
  try {
    // This would normally fetch from Supabase
    const demoUsers = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Rajesh Kumar',
        phone: '+1234567890',
        role: 'farmer',
        village: 'Krishnapur',
        district: 'Krishna',
        state: 'Andhra Pradesh'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Green Foods Ltd',
        phone: '+9876543210',
        role: 'buyer',
        village: 'Mumbai',
        district: 'Mumbai',
        state: 'Maharashtra'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Admin User',
        phone: '+5555555555',
        role: 'admin',
        village: 'Bangalore',
        district: 'Bangalore Urban',
        state: 'Karnataka'
      }
    ];

    res.json({
      success: true,
      data: demoUsers,
      message: 'Demo users retrieved (Supabase integration ready)'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Smart Agriculture Exchange API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
  console.log(`🎭 Demo endpoints: http://localhost:${PORT}/api/demo/*`);
  console.log(`💾 Database: Supabase (Demo Mode)`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;
