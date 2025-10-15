import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SupabaseService } from '../services/supabaseService';
import { sendOTPService } from '../services/otpService';
import { sendEmailService } from '../services/emailService';

// Generate JWT token
const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const payload = { userId, role };
  const options: jwt.SignOptions = { expiresIn: process.env.JWT_EXPIRE || '7d' as string };
  
  return jwt.sign(payload, secret, options);
};

// Send OTP for phone verification
export const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;

    // For demo mode, allow all demo phone numbers
    const demoPhones = ['+1234567890', '+9876543210', '+5555555555'];
    if (demoPhones.includes(phone)) {
      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully (Demo Mode)',
        phone: phone
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In production, you would store this in Supabase and send via SMS
    // For now, we'll just return success for demo purposes
    console.log(`Demo OTP for ${phone}: ${otpCode}`);

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      phone: phone
    });
  } catch (error: any) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    });
  }
};

// Verify OTP and login/register user
export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, otp } = req.body;

    // Demo mode - accept specific OTPs for demo accounts
    const validOTPs = ['123456', '000000', '111111', '222222', '333333'];
    
    if (!validOTPs.includes(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Demo user data based on phone number
    let demoUser;
    const normalizedPhone = phone.replace(/[\+\s\-\(\)]/g, '');

    if (normalizedPhone === '1234567890' || phone === '+1234567890' || phone === '1234567890') {
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
    } else if (normalizedPhone === '9876543210' || phone === '+9876543210' || phone === '9876543210') {
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
    } else if (normalizedPhone === '5555555555' || phone === '+5555555555' || phone === '5555555555') {
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
    } else {
      // Default to buyer for any other number
      demoUser = {
        id: 'demo-buyer-default',
        name: 'Demo Buyer',
        phone: phone,
        email: 'buyer@demo.com',
        role: 'buyer',
        village: 'Demo City',
        district: 'Demo District',
        state: 'Demo State',
        languages: ['en'],
        is_verified: true
      };
    }

    // In production, you would:
    // 1. Verify OTP from database
    // 2. Check if user exists in Supabase
    // 3. Create user if they don't exist
    // 4. Generate JWT token

    // For demo mode, just generate token with demo user data
    const token = generateToken(demoUser.id, demoUser.role);

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: demoUser
    });
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // For demo mode, return demo user data
    const demoUsers = {
      '550e8400-e29b-41d4-a716-446655440001': {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Rajesh Kumar',
        phone: '+1234567890',
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
      },
      '550e8400-e29b-41d4-a716-446655440002': {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Green Foods Ltd',
        phone: '+9876543210',
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
      },
      '550e8400-e29b-41d4-a716-446655440003': {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Admin User',
        phone: '+5555555555',
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
      }
    };

    const user = (demoUsers as any)[userId];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error: any) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    const updates = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // In production, you would update the user in Supabase
    // For demo mode, just return success
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: { ...updates, id: userId }
    });
  } catch (error: any) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Logout (just return success since JWT is stateless)
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};
