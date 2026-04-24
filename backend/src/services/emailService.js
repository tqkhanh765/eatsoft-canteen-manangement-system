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
 * Send 2FA verification email specifically for Admin login.
 * Uses a distinct security-themed template so it cannot be confused
 * with the generic password-reset OTP email.
 */
const sendAdmin2FAEmail = async (toEmail, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"IU EatSoft Security" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: '🔐 Admin Login Verification – IU EatSoft',
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0;">

          <!-- Header banner -->
          <div style="background:linear-gradient(135deg,#1E3A8A 0%,#2563EB 100%);padding:36px 40px;text-align:center;">
            <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;margin-bottom:16px;">🛡️</div>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.01em;">
              Admin Login Verification
            </h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">
              IU EatSoft · Administrator Portal
            </p>
          </div>

          <!-- Body -->
          <div style="padding:36px 40px;">
            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
              A sign-in attempt to the <strong>Admin Portal</strong> was detected for this account.
              Use the verification code below to complete your login.
            </p>

            <!-- OTP box -->
            <div style="background:#EFF6FF;border:1.5px solid #BFDBFE;border-radius:10px;padding:28px;text-align:center;margin:24px 0;">
              <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#1E40AF;text-transform:uppercase;letter-spacing:0.1em;">
                Your One-Time Verification Code
              </p>
              <div style="font-size:42px;font-weight:800;letter-spacing:14px;color:#1D4ED8;font-family:'Courier New',monospace;margin:4px 0;">
                ${otp}
              </div>
              <p style="margin:12px 0 0;font-size:13px;color:#3B82F6;">
                ⏱ Expires in <strong>10 minutes</strong>
              </p>
            </div>

            <!-- Security notice -->
            <div style="background:#FFF7ED;border-left:4px solid #F97316;border-radius:6px;padding:14px 18px;margin:20px 0;">
              <p style="margin:0;font-size:13px;color:#92400E;line-height:1.6;">
                <strong>⚠ Security Notice:</strong> If you did not attempt to log in to the Admin Portal,
                your credentials may be compromised. Please change your password immediately and contact
                the system administrator.
              </p>
            </div>

            <p style="font-size:13px;color:#6B7280;line-height:1.6;margin:0;">
              This code is single-use and valid for one login session only.<br>
              <strong>Never share this code with anyone — EatSoft staff will never ask for it.</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94A3B8;">
              © IU EatSoft Canteen Management System &nbsp;·&nbsp; Administrator Security Alert<br>
              This is an automated security email. Please do not reply.
            </p>
          </div>
        </div>
      `,
      text: `ADMIN LOGIN VERIFICATION – IU EatSoft\n\nYour one-time verification code: ${otp}\n\nThis code expires in 10 minutes and can only be used once.\n\nIf you did not attempt to log in to the Admin Portal, please change your password immediately.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Admin 2FA OTP sent to ${toEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email] Failed to send Admin 2FA OTP:', error);
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

module.exports = { sendOTPEmail, sendAdmin2FAEmail, sendRegistrationStatusEmail };
