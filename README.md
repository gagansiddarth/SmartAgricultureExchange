# Smart Agriculture Exchange

A minimal, low-friction marketplace that lets farmers publish verified crop listings (geotagged + photo) and brands/government buyers discover and buy directly — with verification, deal orchestration, updates and trust-building.

## 🚀 Phase 1 Implementation Status

### ✅ Completed
- [x] Project structure setup
- [x] Frontend (React + Vite + TypeScript)
- [x] Backend (Node.js + Express + TypeScript)
- [x] Database schema (PostgreSQL + PostGIS)
- [x] Authentication system (OTP-based)
- [x] Basic routing and navigation
- [x] Multi-language support (English/Hindi)
- [x] Responsive UI with Tailwind CSS

### 🔄 In Progress
- [ ] Farmer crop post creation
- [ ] Image upload with EXIF capture
- [ ] Automated verification checks
- [ ] Admin approval workflow
- [ ] Buyer search functionality
- [ ] Real-time chat system
- [ ] Deal finalization
- [ ] SMS and email notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for forms
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **PostgreSQL** with PostGIS extension
- **JWT** for authentication
- **Socket.io** for real-time chat
- **Multer** for file uploads
- **Sharp** for image processing
- **Twilio** for SMS (OTP)
- **Nodemailer** for email

### Database
- **PostgreSQL 14+** with PostGIS extension
- **Redis** for caching (optional)

## 📋 Prerequisites

Before running the application, make sure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher) with PostGIS extension
- **Redis** (optional, for caching)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SmartAgricultureEchange
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install:all
```

### 3. Database Setup

#### Install PostgreSQL with PostGIS
```bash
# macOS (using Homebrew)
brew install postgresql postgis

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib postgis

# Start PostgreSQL service
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux
```

#### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE smart_agriculture_exchange;

# Connect to the new database
\c smart_agriculture_exchange

# Enable PostGIS extension
CREATE EXTENSION postgis;

# Exit psql
\q
```

#### Initialize Database Schema
```bash
# Run the SQL script to create tables
psql -U postgres -d smart_agriculture_exchange -f database/init.sql
```

### 4. Environment Configuration

#### Backend Environment
```bash
# Copy environment template
cp backend/env.example backend/.env

# Edit backend/.env with your configuration
nano backend/.env
```

Required environment variables:
```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_agriculture_exchange
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Twilio Configuration (for OTP)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Frontend Environment
```bash
# Copy environment template
cp frontend/env.example frontend/.env

# Edit frontend/.env
nano frontend/.env
```

Required environment variables:
```env
VITE_API_URL=http://localhost:3001/api
```

### 5. Run the Application

#### Development Mode (Both Frontend & Backend)
```bash
# Start both frontend and backend concurrently
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Backend Health Check: http://localhost:3001/health

#### Run Separately
```bash
# Terminal 1: Backend only
cd backend
npm run dev

# Terminal 2: Frontend only
cd frontend
npm run dev
```

## 📱 Features

### Farmer Portal (PWA)
- **OTP-based Authentication** - Simple phone + OTP login
- **Crop Post Creation** - Upload photos with geotagging
- **Crop Advice** - Get expert advice on farming
- **Multi-language Support** - English, Hindi, Tamil, Telugu
- **Offline Capability** - Works without internet connection
- **Mobile-first Design** - Optimized for mobile devices

### Buyer Portal
- **Advanced Search** - Filter by crop type, location, price
- **Verified Listings** - Only verified crop posts
- **Direct Communication** - Chat with farmers
- **Deal Management** - Track offers and deals

### Admin Portal
- **Post Verification** - Manual review of flagged posts
- **Analytics Dashboard** - Track marketplace metrics
- **User Management** - Manage farmers and buyers
- **Deal Monitoring** - Oversee all transactions

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Prevent abuse and spam
- **Input Validation** - Server-side validation
- **Image Verification** - EXIF data validation
- **Role-based Access Control** - Secure admin functions
- **HTTPS Ready** - SSL/TLS configuration

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Email/password login

### Farmer Routes
- `POST /api/farmer/crop-posts` - Create crop post
- `GET /api/farmer/crop-posts` - Get my posts
- `PUT /api/farmer/crop-posts/:id` - Update post
- `DELETE /api/farmer/crop-posts/:id` - Delete post

### Buyer Routes
- `GET /api/buyer/search` - Search crop posts
- `GET /api/buyer/crop-posts/:id` - Get post details
- `POST /api/buyer/offers` - Make offer
- `GET /api/buyer/offers` - Get my offers

### Admin Routes
- `GET /api/admin/posts/pending` - Get pending posts
- `POST /api/admin/posts/:id/approve` - Approve post
- `POST /api/admin/posts/:id/reject` - Reject post
- `GET /api/admin/analytics` - Get analytics

## 🧪 Testing

```bash
# Run backend tests (when implemented)
cd backend
npm test

# Run frontend tests (when implemented)
cd frontend
npm test
```

## 📦 Building for Production

```bash
# Build both frontend and backend
npm run build

# Build individually
npm run build:frontend
npm run build:backend
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build:frontend`
2. Deploy the `frontend/dist` folder to your hosting platform

### Backend (DigitalOcean/AWS/GCP)
1. Build the backend: `npm run build:backend`
2. Set up PostgreSQL database with PostGIS
3. Configure environment variables
4. Deploy the `backend/dist` folder to your server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🗺️ Roadmap

### Phase 2 (Polish)
- [ ] Advanced localization (3+ languages)
- [ ] Offline PWA sync
- [ ] Image thumbnails and CDN
- [ ] Basic analytics dashboard
- [ ] Bank/escrow integration

### Phase 3 (Scale & Trust)
- [ ] ML-based crop recognition
- [ ] Advanced fraud detection
- [ ] Logistics integration
- [ ] Immutable traceability
- [ ] Rating system

---

**Built with ❤️ for the farming community**
