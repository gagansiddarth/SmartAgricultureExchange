import express from 'express';
import { body } from 'express-validator';
import { sendOTP, verifyOTP, registerUser, loginUser } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// Send OTP for phone verification
router.post('/send-otp', 
  [
    body('phone')
      .isMobilePhone('any')
      .withMessage('Please provide a valid phone number')
  ],
  validateRequest,
  sendOTP
);

// Verify OTP and authenticate
router.post('/verify-otp',
  [
    body('phone')
      .isMobilePhone('any')
      .withMessage('Please provide a valid phone number'),
    body('otp')
      .isLength({ min: 4, max: 6 })
      .withMessage('OTP must be 4-6 digits')
  ],
  validateRequest,
  verifyOTP
);

// Register new user (farmer or buyer)
router.post('/register',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('phone')
      .isMobilePhone('any')
      .withMessage('Please provide a valid phone number'),
    body('role')
      .isIn(['farmer', 'buyer'])
      .withMessage('Role must be either farmer or buyer'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('village')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Village name too long'),
    body('district')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('District name too long'),
    body('state')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('State name too long'),
    body('languages')
      .optional()
      .isArray()
      .withMessage('Languages must be an array')
  ],
  validateRequest,
  registerUser
);

// Login with email/password (for buyers and admins)
router.post('/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  loginUser
);

export default router;
