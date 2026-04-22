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

/**
 * Get status display text and color
 */
const getStatusInfo = (status) => {
  const statusMap = {
    'MANAGER_PENDING': { text: 'Pending Review', color: '#F59E0B' },
    'MANAGER_APPROVED': { text: 'Manager Approved', color: '#10B981' },
    'MANAGER_REJECTED': { text: 'Manager Rejected', color: '#EF4444' },
    'ADMIN_COMPLETED': { text: 'Registration Complete', color: '#10B981' },
  };
  return statusMap[status] || { text: status, color: '#6B7280' };
};

/**
 * Send registration status update email
 * @param {string} toEmail
 * @param {string} stallName
 * @param {string} status
 * @param {string} [note]
 * @param {string} [vendorPassword]  plain-text password (only for ADMIN_COMPLETED)
 */
const sendRegistrationStatusEmail = async (toEmail, stallName, status, note = '', vendorPassword = '') => {
  try {
    const transporter = createTransporter();
    const statusInfo = getStatusInfo(status);

    // Credentials block – only shown for ADMIN_COMPLETED when a password is supplied
    const credentialsBlock = (status === 'ADMIN_COMPLETED' && vendorPassword)
      ? `
        <div style="background:#EFF6FF;border:1.5px solid #BFDBFE;border-radius:10px;padding:20px 24px;margin:24px 0;">
          <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#1E40AF;text-transform:uppercase;letter-spacing:.05em;">Your Login Credentials</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="padding:6px 0;color:#64748B;width:120px;">Email</td>
              <td style="padding:6px 0;font-weight:600;color:#111827;font-family:monospace;">${toEmail}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748B;">Password</td>
              <td style="padding:6px 0;font-weight:700;color:#2563EB;font-family:monospace;font-size:16px;letter-spacing:.05em;">${vendorPassword}</td>
            </tr>
          </table>
          <p style="margin:14px 0 0;font-size:12px;color:#EF4444;">⚠ Please change your password after your first login.</p>
        </div>
      `
      : '';

    const mailOptions = {
      from: `"IU EatSoft" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Stall Registration Update - ${statusInfo.text}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563EB;">Stall Registration Update</h2>
          <p>Your registration for <strong>${stallName}</strong> has been updated.</p>
          
          <div style="background: ${statusInfo.color}15; border-left: 4px solid ${statusInfo.color}; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">Current Status:</p>
            <h3 style="margin: 0; color: ${statusInfo.color};">${statusInfo.text}</h3>
          </div>
          
          ${note ? `
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #374151;"><strong>Note:</strong> ${note}</p>
          </div>
          ` : ''}

          ${credentialsBlock}
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            ${status === 'ADMIN_COMPLETED' 
              ? 'You can now login to your vendor account and start managing your stall!' 
              : 'You will receive another email when there is a new update on your application.'}
          </p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            If you have any questions, please contact our support team.<br>
            Thank you for choosing IU EatSoft!
          </p>
        </div>
      `,
      text: `Your registration for ${stallName} has been updated. Status: ${statusInfo.text}.${note ? ` Note: ${note}` : ''}${vendorPassword ? ` Your login credentials — Email: ${toEmail} | Password: ${vendorPassword}` : ''}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Status update sent to ${toEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email] Failed to send status update:', error);
    throw error;
  }
};

module.exports = { sendOTPEmail, sendRegistrationStatusEmail };
