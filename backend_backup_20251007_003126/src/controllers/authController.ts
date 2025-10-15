import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../utils/database';
import { sendOTPService } from '../services/otpService';
import { sendEmailService } from '../services/emailService';

// Generate JWT token
const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const payload = { userId, role };
  const options: jwt.SignOptions = { expiresIn: process.env.JWT_EXPIRE || '7d' };
  
  return jwt.sign(payload, secret, options);
};

// Send OTP for phone verification
export const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await query(
      'INSERT INTO otp_verification (phone, otp_code, expires_at) VALUES ($1, $2, $3)',
      [phone, otpCode, expiresAt]
    );

    // Send OTP via SMS (using Twilio or similar service)
    await sendOTPService(phone, otpCode);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: 600 // 10 minutes in seconds
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    next(error);
  }
};

// Verify OTP
export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, otp } = req.body;

    // Check if OTP exists and is valid
    const otpResult = await query(
      'SELECT * FROM otp_verification WHERE phone = $1 AND otp_code = $2 AND expires_at > NOW() AND is_used = false ORDER BY created_at DESC LIMIT 1',
      [phone, otp]
    );

    if (otpResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP'
      });
    }

    // Mark OTP as used
    await query(
      'UPDATE otp_verification SET is_used = true WHERE id = $1',
      [otpResult.rows[0].id]
    );

    // Check if user exists
    const userResult = await query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    );

    if (userResult.rows.length === 0) {
      // User doesn't exist, return success with flag to indicate registration needed
      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        needsRegistration: true
      });
    }

    // User exists, generate token and return user data
    const user = userResult.rows[0];
    const token = generateToken(user.id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        village: user.village,
        district: user.district,
        state: user.state,
        languages: user.languages,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    next(error);
  }
};

// Register new user
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, role, email, village, district, state, languages, bank_details } = req.body;

    // Check if user already exists
    const existingUser = await query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'User with this phone number already exists'
      });
    }

    // Create new user
    const userResult = await query(
      `INSERT INTO users (name, phone, role, email, village, district, state, languages, bank_details, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
       RETURNING id, name, phone, email, role, village, district, state, languages, is_verified`,
      [name, phone, role, email, village, district, state, JSON.stringify(languages || ['en']), JSON.stringify(bank_details || {})]
    );

    const user = userResult.rows[0];
    const token = generateToken(user.id, user.role);

    // Send welcome email if email is provided
    if (email) {
      await sendEmailService(
        email,
        'Welcome to Smart Agriculture Exchange',
        `Welcome ${name}! Your account has been created successfully.`
      );
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        village: user.village,
        district: user.district,
        state: user.state,
        languages: user.languages,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    console.error('Register user error:', error);
    next(error);
  }
};

// Login with email/password
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const userResult = await query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const user = userResult.rows[0];

    // Check password (for users with password_hash)
    if (user.password_hash) {
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
    }

    const token = generateToken(user.id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        village: user.village,
        district: user.district,
        state: user.state,
        languages: user.languages,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    console.error('Login user error:', error);
    next(error);
  }
};
