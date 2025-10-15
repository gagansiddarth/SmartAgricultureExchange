import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createUser, getUserByPhone, getUserByEmail } from './services/userService';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    // Simple test without complex imports
    res.status(200).json({
      success: true,
      message: 'Database connection test endpoint ready'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Database connection failed'
    });
  }
});

// Email OTP endpoints for Supabase integration
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  
  // Demo mode - accept demo emails
  const demoEmails = ['farmer@demo.com', 'buyer@demo.com', 'admin@demo.com'];
  
  // Check if it's a demo email or registered user
  if (demoEmails.includes(email)) {
    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email (Demo Mode)',
      email: email
    });
  }
  
  // Check if user exists in database by email
  const user = await getUserByEmail(email);
  if (user) {
    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      email: email
    });
  }
  
  return res.status(400).json({
    success: false,
    message: 'Email not found. Please register first.'
  });
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  
  // Demo mode - accept any OTP for demo emails
  const demoEmails = ['farmer@demo.com', 'buyer@demo.com', 'admin@demo.com'];
  
  let user: any = null;
  
  // Try to fetch user from database first
  if (!demoEmails.includes(email)) {
    user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Email not found. Please register first.'
      });
    }
  }
  
  // Demo user data based on email
  let demoUser: any;
  
  if (user) {
    // Use real user data from database
    demoUser = user;
  } else if (email === 'farmer@demo.com') {
    // Farmer Account
    demoUser = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Rajesh Kumar',
      phone: '+1234567890',
      email: email,
      role: 'farmer',
      village: 'Krishnapur',
      district: 'Krishna',
      state: 'Andhra Pradesh',
      languages: ['en', 'te'],
      is_verified: true,
      bank_details: {
        account_number: '1234567890',
        ifsc_code: 'SBIN0001234',
        bank_name: 'State Bank of India'
      }
    };
  } else if (email === 'buyer@demo.com') {
    // Brand/Buyer Account
    demoUser = {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Green Foods Ltd',
      phone: '+9876543210',
      email: email,
      role: 'buyer',
      village: 'Mumbai',
      district: 'Mumbai',
      state: 'Maharashtra',
      languages: ['en', 'hi'],
      is_verified: true,
      organization_details: {
        company_name: 'Green Foods Ltd',
        gst_number: '27AABCU9603R1ZX',
        business_type: 'Food Processing'
      }
    };
  } else if (email === 'admin@demo.com') {
    // Company Admin Account
    demoUser = {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Admin User',
      phone: '+5555555555',
      email: email,
      role: 'admin',
      village: 'Bangalore',
      district: 'Bangalore Urban',
      state: 'Karnataka',
      languages: ['en'],
      is_verified: true,
      admin_details: {
        department: 'Operations',
        access_level: 'Super Admin'
      }
    };
  }
  
  // Generate a simple JWT-like token (for demo purposes)
  const token = Buffer.from(JSON.stringify({ userId: demoUser.id, role: demoUser.role })).toString('base64');
  
  return res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
    token,
    user: demoUser
  });
});

// User registration endpoint
app.post('/api/auth/register', async (req, res) => {
  const { 
    name, 
    phone, 
    email, 
    role, 
    village, 
    district, 
    state, 
    pincode, 
    languages,
    bank_details,
    organization_details
  } = req.body;

  // Validate required fields
  if (!name || !email || !role) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and role are required'
    });
  }

  // Validate role
  const validRoles = ['farmer', 'buyer'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Role must be either farmer or buyer'
    });
  }

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user object
    const userData = {
      name,
      phone: phone || undefined,
      email: email,
      role: role as 'farmer' | 'buyer',
      village: village || undefined,
      district: district || undefined,
      state: state || undefined,
      pincode: pincode || undefined,
      languages: languages || ['en'],
      bank_details: role === 'farmer' ? (bank_details || undefined) : undefined,
      organization_details: role === 'buyer' ? (organization_details || undefined) : undefined
    };

    // Save user to Supabase
    const result = await createUser(userData);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error || 'Registration failed. Please try again.'
      });
    }

    console.log('User registered successfully:', result.user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: result.user
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

// Get user profile by ID
app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params;
  
  // In production, fetch from Supabase
  // For demo, return a sample user
  const sampleUser = {
    id: userId,
    name: 'Sample User',
    phone: '+1234567890',
    email: 'user@example.com',
    role: 'farmer',
    village: 'Sample Village',
    district: 'Sample District',
    state: 'Sample State',
    languages: ['en'],
    is_verified: false,
    verification_status: 'pending'
  };

  return res.status(200).json({
    success: true,
    user: sampleUser
  });
});

// Update user profile
app.put('/api/user/:userId', (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  // In production, update in Supabase
  // For demo, just return success
  console.log(`Updating user ${userId} with:`, updates);

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: { id: userId, ...updates }
  });
});

// Demo crop posts endpoint
app.get('/api/crops', (req, res) => {
  const sampleCrops = [
    {
      id: '550e8400-e29b-41d4-a716-446655440011',
      farmer_id: '550e8400-e29b-41d4-a716-446655440001',
      crop_name: 'Basmati Rice',
      variety: 'Pusa Basmati 1121',
      quantity: 500,
      unit: 'quintals',
      price_per_unit: 3200,
      description: 'Premium quality basmati rice from organic farming',
      images: ['https://example.com/rice1.jpg', 'https://example.com/rice2.jpg'],
      harvest_date: '2024-01-15',
      available_until: '2024-02-15',
      location: {
        village: 'Krishnapur',
        district: 'Krishna',
        state: 'Andhra Pradesh',
        coordinates: { lat: 16.5080, lng: 80.6310 }
      },
      certification: ['Organic', 'FSSAI Certified'],
      minimum_order: 10,
      status: 'approved',
      quality_grade: 'A',
      moisture_content: 12.5,
      purity_percentage: 99.2,
      primary_image_url: 'https://example.com/basmati-primary.jpg',
      tags: ['basmati', 'rice', 'organic', 'premium'],
      farmer_name: 'Rajesh Kumar'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440012',
      farmer_id: '550e8400-e29b-41d4-a716-446655440001',
      crop_name: 'Wheat',
      variety: 'HD 3086',
      quantity: 300,
      unit: 'quintals',
      price_per_unit: 2200,
      description: 'High quality wheat grain suitable for flour production',
      images: ['https://example.com/wheat1.jpg'],
      harvest_date: '2024-01-20',
      available_until: '2024-03-20',
      location: {
        village: 'Krishnapur',
        district: 'Krishna',
        state: 'Andhra Pradesh',
        coordinates: { lat: 16.5080, lng: 80.6310 }
      },
      certification: ['FSSAI Certified'],
      minimum_order: 20,
      status: 'approved',
      quality_grade: 'A',
      moisture_content: 11.8,
      purity_percentage: 98.5,
      primary_image_url: 'https://example.com/wheat-primary.jpg',
      tags: ['wheat', 'cereal', 'high-protein'],
      farmer_name: 'Rajesh Kumar'
    }
  ];
  
  return res.status(200).json({
    success: true,
    crops: sampleCrops,
    total: sampleCrops.length
  });
});

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Test DB: http://localhost:${PORT}/api/test-db`);
});

export { io };
