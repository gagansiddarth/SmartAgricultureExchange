import nodemailer from 'nodemailer';

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailService = async (to: string, subject: string, text: string, html?: string): Promise<void> => {
  try {
    // In development, just log the email
    if (process.env.NODE_ENV === 'development') {
      console.log(`📧 Email to ${to}:`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${text}`);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: html || text
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};

export const sendNotificationEmail = async (to: string, type: string, data: any): Promise<void> => {
  try {
    let subject = '';
    let text = '';
    let html = '';

    switch (type) {
      case 'post_approved':
        subject = 'Your Crop Post Has Been Approved';
        text = `Your crop post for ${data.crop_type} has been approved and is now live on the marketplace.`;
        html = `
          <h2>Great news!</h2>
          <p>Your crop post for <strong>${data.crop_type}</strong> has been approved and is now live on the marketplace.</p>
          <p>Expected harvest date: ${data.expected_harvest_date}</p>
        `;
        break;

      case 'post_rejected':
        subject = 'Your Crop Post Needs Attention';
        text = `Your crop post for ${data.crop_type} has been rejected. Reason: ${data.reason}`;
        html = `
          <h2>Your crop post needs attention</h2>
          <p>Your crop post for <strong>${data.crop_type}</strong> has been rejected.</p>
          <p><strong>Reason:</strong> ${data.reason}</p>
          <p>Please review and resubmit your post.</p>
        `;
        break;

      case 'deal_offer':
        subject = 'New Deal Offer on Your Crop Post';
        text = `You have received a new offer for your ${data.crop_type} crop.`;
        html = `
          <h2>New deal offer!</h2>
          <p>You have received a new offer for your <strong>${data.crop_type}</strong> crop.</p>
          <p>Offer price: ₹${data.offer_price} per ${data.quantity_unit}</p>
        `;
        break;

      default:
        subject = 'Smart Agriculture Exchange Notification';
        text = 'You have a new notification from Smart Agriculture Exchange.';
    }

    await sendEmailService(to, subject, text, html);
  } catch (error) {
    console.error('❌ Failed to send notification email:', error);
    throw error;
  }
};
