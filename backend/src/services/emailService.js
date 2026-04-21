const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,      // your-email@gmail.com
      pass: process.env.EMAIL_PASS,    // 16-character app password
    },
  });
};

/**
 * Send OTP email for password reset
 */
const sendOTPEmail = async (toEmail, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"IU EatSoft" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Password Reset OTP - IU EatSoft',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563EB;">Password Reset Request</h2>
          <p>You requested a password reset for your EatSoft Canteen account.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">Your OTP code:</p>
            <h1 style="margin: 0; font-size: 36px; letter-spacing: 8px; color: #111827;">${otp}</h1>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This code will expire in <strong>10 minutes</strong>.
          </p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            If you didn't request this reset, please ignore this email.<br>
            Do not share this code with anyone.
          </p>
        </div>
      `,
      text: `Your OTP code is: ${otp}. This code will expire in 10 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] OTP sent to ${toEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email] Failed to send OTP:', error);
    throw error;
  }
};

module.exports = { sendOTPEmail };
