import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOTPService = async (phone: string, otp: string): Promise<void> => {
  try {
    // In development, just log the OTP
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 OTP for ${phone}: ${otp}`);
      return;
    }

    // Send SMS via Twilio
    await client.messages.create({
      body: `Your Smart Agriculture Exchange OTP is: ${otp}. This code will expire in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    console.log(`✅ OTP sent successfully to ${phone}`);
  } catch (error) {
    console.error('❌ Failed to send OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

export const sendSMSService = async (phone: string, message: string): Promise<void> => {
  try {
    // In development, just log the message
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 SMS to ${phone}: ${message}`);
      return;
    }

    // Send SMS via Twilio
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    console.log(`✅ SMS sent successfully to ${phone}`);
  } catch (error) {
    console.error('❌ Failed to send SMS:', error);
    throw new Error('Failed to send SMS');
  }
};
