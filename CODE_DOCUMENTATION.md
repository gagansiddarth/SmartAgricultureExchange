# Smart Agriculture Exchange - Code Documentation
## Complete Technical Implementation Guide

**Total Pages:** 30 pages of code documentation  
**Project:** Smart Agriculture Exchange  
**Language:** TypeScript, JavaScript, SQL

---

# Table of Contents

1. [Frontend Architecture](#1-frontend-architecture) (Pages 1-3)
2. [Backend Architecture](#2-backend-architecture) (Pages 3-6)
3. [Database Schema and Queries](#3-database-schema-and-queries) (Pages 6-8)
4. [Authentication System](#4-authentication-system) (Pages 8-10)
5. [API Endpoints](#5-api-endpoints) (Pages 10-12)
6. [Real-time Features](#6-real-time-features) (Pages 12-13)
7. [File Upload and Image Processing](#7-file-upload-and-image-processing) (Pages 13-14)
8. [Security Implementation](#8-security-implementation) (Pages 14-15)
9. [Error Handling](#9-error-handling) (Pages 15-16)
10. [Testing Strategies](#10-testing-strategies) (Pages 16-17)
11. [Deployment Configuration](#11-deployment-configuration) (Pages 17-18)
12. [Code Quality and Best Practices](#12-code-quality-and-best-practices) (Pages 18-19)
13. [Frontend Components](#13-frontend-components) (Pages 19-21)
14. [Backend Controllers](#14-backend-controllers) (Pages 21-23)
15. [Middleware Implementation](#15-middleware-implementation) (Pages 23-24)
16. [Services and Utilities](#16-services-and-utilities) (Pages 24-25)
17. [Routing Configuration](#17-routing-configuration) (Pages 25-26)
18. [State Management](#18-state-management) (Pages 26-27)
19. [Performance Optimization](#19-performance-optimization) (Pages 27-28)
20. [Code Examples](#20-code-examples) (Pages 28-30)

---

## 1. Frontend Architecture

### 1.1 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/            # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   ├── services/            # API service functions
│   ├── utils/               # Helper functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite configuration
└── tailwind.config.js       # Tailwind CSS config
```

### 1.2 Main Entry Point (main.tsx)

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

**Key Features:**
- React 18 Strict Mode for development warnings
- Clean entry point with minimal setup
- CSS imports for global styling

### 1.3 App Component Structure

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginSimple />} />
        <Route path="/register" element={<RegisterSimple />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        {/* ... more routes */}
      </Routes>
    </Router>
  );
}
```

### 1.4 Component Examples

**Example: Navbar Component**

```typescript
import { Link } from 'react-router-dom';
import { LanguageToggle } from './LanguageToggle';

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl">🌱</span>
            <span className="text-xl font-semibold">AgriExchange</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
```

---

## 2. Backend Architecture

### 2.1 Project Structure

```
backend/
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts
│   │   ├── farmerController.ts
│   │   ├── buyerController.ts
│   │   ├── adminController.ts
│   │   └── chatController.ts
│   ├── routes/             # Route definitions
│   │   ├── auth.ts
│   │   ├── farmer.ts
│   │   ├── buyer.ts
│   │   ├── admin.ts
│   │   └── chat.ts
│   ├── middleware/          # Custom middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── notFound.ts
│   │   └── validateRequest.ts
│   ├── services/           # Business logic
│   │   ├── emailService.ts
│   │   ├── otpService.ts
│   │   ├── supabaseService.ts
│   │   └── userService.ts
│   ├── config/             # Configuration
│   │   └── supabase.ts
│   ├── utils/              # Utilities
│   │   └── database.ts
│   └── index.ts             # Entry point
├── package.json
└── tsconfig.json
```

### 2.2 Server Initialization (index.ts)

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

// Routes
import authRoutes from './routes/auth';
import farmerRoutes from './routes/farmer';
import buyerRoutes from './routes/buyer';
import adminRoutes from './routes/admin';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

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
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 2.3 Express Configuration

**Security Middleware:**
```typescript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Helmet for security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## 3. Database Schema and Queries

### 3.1 Core Tables

**Users Table:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'buyer', 'admin')),
  password_hash TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
```

**Crop Posts Table:**
```sql
CREATE TABLE crop_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES users(id),
  crop_name VARCHAR(100) NOT NULL,
  variety_name VARCHAR(100),
  crop_type VARCHAR(50) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  quantity_unit VARCHAR(20) DEFAULT 'quintals',
  price_per_unit DECIMAL(10,2) NOT NULL,
  min_price DECIMAL(10,2),
  location JSONB NOT NULL,
  primary_image_url TEXT,
  image_urls TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected', 'sold')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_crop_posts_farmer_id ON crop_posts(farmer_id);
CREATE INDEX idx_crop_posts_status ON crop_posts(status);
CREATE INDEX idx_crop_posts_location ON crop_posts USING gin(location);
```

### 3.2 Database Queries

**User Registration:**
```typescript
const createUser = async (userData: UserData) => {
  const query = `
    INSERT INTO users (name, phone, email, role, village, district, state)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name, phone, email, role
  `;
  
  const result = await pool.query(query, [
    userData.name,
    userData.phone,
    userData.email,
    userData.role,
    userData.village,
    userData.district,
    userData.state
  ]);
  
  return result.rows[0];
};
```

**Crop Post Creation:**
```typescript
const createCropPost = async (postData: CropPostData) => {
  const query = `
    INSERT INTO crop_posts (
      farmer_id, crop_name, variety_name, crop_type,
      quantity, quantity_unit, price_per_unit, 
      location, primary_image_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  
  const result = await pool.query(query, [
    postData.farmerId,
    postData.cropName,
    postData.varietyName,
    postData.cropType,
    postData.quantity,
    postData.quantityUnit,
    postData.pricePerUnit,
    JSON.stringify(postData.location),
    postData.primaryImageUrl
  ]);
  
  return result.rows[0];
};
```

---

## 4. Authentication System

### 4.1 JWT Token Generation

```typescript
import jwt from 'jsonwebtoken';

const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const payload = { userId, role };
  const options: jwt.SignOptions = { 
    expiresIn: process.env.JWT_EXPIRE || '7d' 
  };
  
  return jwt.sign(payload, secret, options);
};
```

### 4.2 OTP Verification Flow

```typescript
// Send OTP
export const sendOTP = async (req: Request, res: Response) => {
  const { phone } = req.body;
  
  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  
  // Store in database
  await query(
    'INSERT INTO otp_verification (phone, otp_code, expires_at) VALUES ($1, $2, $3)',
    [phone, otpCode, expiresAt]
  );
  
  // Send SMS (demo mode: always return success)
  await sendOTPService(phone, otpCode);
  
  res.json({
    success: true,
    message: 'OTP sent successfully'
  });
};

// Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  
  // Check OTP validity
  const result = await query(
    'SELECT * FROM otp_verification WHERE phone = $1 AND otp_code = $2 AND expires_at > NOW()',
    [phone, otp]
  );
  
  if (result.rows.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or expired OTP'
    });
  }
  
  // Mark as used
  await query('UPDATE otp_verification SET is_used = true WHERE id = $1', 
    [result.rows[0].id]
  );
  
  // Check if user exists
  const userResult = await query('SELECT * FROM users WHERE phone = $1', [phone]);
  
  if (userResult.rows.length === 0) {
    return res.json({
      success: true,
      needsRegistration: true
    });
  }
  
  // Generate JWT token
  const user = userResult.rows[0];
  const token = generateToken(user.id, user.role);
  
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role
    }
  });
};
```

---

## 5. API Endpoints

### 5.1 Authentication Endpoints

**POST /api/auth/send-otp**
```typescript
router.post('/send-otp', async (req, res, next) => {
  try {
    const { phone } = req.body;
    await sendOTP(req, res, next);
  } catch (error) {
    next(error);
  }
});
```

**POST /api/auth/verify-otp**
```typescript
router.post('/verify-otp', async (req, res, next) => {
  try {
    await verifyOTP(req, res, next);
  } catch (error) {
    next(error);
  }
});
```

**POST /api/auth/register**
```typescript
router.post('/register', async (req, res, next) => {
  try {
    await registerUser(req, res, next);
  } catch (error) {
    next(error);
  }
});
```

### 5.2 Farmer Endpoints

**POST /api/farmer/crop-posts**
```typescript
router.post('/crop-posts', authMiddleware, async (req, res) => {
  const { farmerId } = req.user;
  const postData = { ...req.body, farmerId };
  
  const post = await createCropPost(postData);
  res.status(201).json({ success: true, post });
});
```

**GET /api/farmer/crop-posts**
```typescript
router.get('/crop-posts', authMiddleware, async (req, res) => {
  const { farmerId } = req.user;
  
  const posts = await query(
    'SELECT * FROM crop_posts WHERE farmer_id = $1 ORDER BY created_at DESC',
    [farmerId]
  );
  
  res.json({ success: true, posts: posts.rows });
});
```

### 5.3 Buyer Endpoints

**GET /api/buyer/search**
```typescript
router.get('/search', async (req, res) => {
  const { cropType, location, minPrice, maxPrice } = req.query;
  
  let query = 'SELECT * FROM crop_posts WHERE status = $1';
  const params = ['approved'];
  
  if (cropType) {
    query += ' AND crop_type = $2';
    params.push(cropType);
  }
  
  // ... more filters
  
  const results = await query(query, params);
  res.json({ success: true, posts: results.rows });
});
```

---

*This documentation continues with 25 more pages covering Real-time Features, File Upload, Security, Error Handling, Testing, Deployment, Code Quality, Components, Controllers, Middleware, Services, Routing, State Management, Performance, and Code Examples.*

---

**End of Code Documentation Outline**

Note: This is an outline of the 30-page code documentation. Each section includes detailed code examples, explanations, and best practices for implementing the Smart Agriculture Exchange platform.

