import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    database: 'Supabase (Demo Mode)'
  });
});

// Demo OTP endpoints
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  
  // Demo mode - accept all demo phone numbers
  const demoPhones = ['+1234567890', '+9876543210', '+5555555555'];
  
  if (demoPhones.includes(phone)) {
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully (Demo Mode)',
      phone: phone
    });
  }
  
  return res.status(400).json({
    success: false,
    message: 'Phone number not found in demo accounts'
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  
  // Demo mode - accept any OTP for demo phones
  const demoPhones = ['+1234567890', '+9876543210', '+5555555555'];
  
  if (!demoPhones.includes(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Phone number not found in demo accounts'
    });
  }
  
  // Demo user data based on phone number
  let demoUser: any;
  
  if (phone === '+1234567890') {
    // Farmer Account
    demoUser = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Rajesh Kumar',
      phone: phone,
      email: 'rajesh@demo.com',
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
  } else if (phone === '+9876543210') {
    // Brand/Buyer Account
    demoUser = {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Green Foods Ltd',
      phone: phone,
      email: 'procurement@greenfoods.com',
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
  } else if (phone === '+5555555555') {
    // Company Admin Account
    demoUser = {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Admin User',
      phone: phone,
      email: 'admin@smartagri.com',
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
  
  res.status(200).json({
    success: true,
    crops: sampleCrops,
    total: sampleCrops.length
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Supabase-enabled Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Demo login endpoints ready`);
  console.log(`🌾 Crop data endpoint ready`);
});
