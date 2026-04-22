const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../services/emailService');

/**
 * Generate JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * POST /api/auth/login
 * Login with email and password.
 * For Admin accounts: credentials are verified but a JWT is NOT issued yet —
 * instead an OTP is sent to the admin's email and a short-lived otpToken is
 * returned for the 2FA step.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Find user by email (include password for comparison and stores for vendors)
    const user = await prisma.user.findUnique({
      where: { email },
      include: { 
        role: true,
        stores: true
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (user.status !== 'Active') {
      return res.status(401).json({
        success: false,
        error: 'Account is inactive. Please contact administrator.',
      });
    }

    const isMatch = user.password === password || await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // ── Admin 2FA gate ──────────────────────────────────────────────────────
    if (user.role?.roleName === 'Admin') {
      const otp      = generateOTP();
      const otpToken = generateRandomToken();

      // Store OTP keyed by email (re-uses existing otpStorage)
      otpStorage.set(`admin_2fa_${email}`, {
        otp,
        otpToken,
        userId: user.userId,
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      });

      try {
        await sendOTPEmail(email, otp);
      } catch (emailErr) {
        console.error('[Admin 2FA] Failed to send OTP:', emailErr);
      }

      return res.json({
        success: true,
        requires2FA: true,
        message: 'OTP sent to your admin email. Please verify to continue.',
        otpToken,        // returned to frontend for the verification step
        email,           // convenience for the frontend form
      });
    }
    // ── End Admin 2FA gate ──────────────────────────────────────────────────

    const token = generateToken(user.userId);
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};


/**
 * POST /api/auth/register
 * Register a new customer account
 */
const register = async (req, res) => {
  try {
    const { userName, email, password, phone } = req.body;

    // Validate input
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password',
      });
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists',
      });
    }

    // Check if phone number already exists (if provided)
    if (phone) {
      const existingPhone = await prisma.user.findFirst({
        where: { phone },
      });

      if (existingPhone) {
        return res.status(409).json({
          success: false,
          error: 'Phone number already exists',
        });
      }
    }

    // Find Customer role
    const customerRole = await prisma.role.findFirst({
      where: { roleName: 'Customer' },
    });

    if (!customerRole) {
      return res.status(500).json({
        success: false,
        error: 'Customer role not found',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (only filling provided fields, others left null)
    const user = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
        phone: phone || null,
        status: 'Active',
        roleId: customerRole.roleId,
      },
      include: { role: true },
    });

    // Return success message (no token, user must login)
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET /api/auth/me
 * Get current logged-in user info
 */
const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await prisma.user.findUnique({
      where: { userId: req.user.userId },
      include: { role: true },
      omit: { password: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * PATCH /api/auth/me
 * Update current logged-in user profile
 */
const updateMe = async (req, res) => {
  try {
    const { userName, email, phone, studentId, universityName, country } = req.body;

    // Validate required fields
    if (!userName || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, and phone number are required',
      });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { userId: req.user.userId },
    });

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if email changed and if new email already exists
    if (email !== currentUser.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          error: 'Email already exists',
        });
      }
    }

    // Check if phone changed and if new phone already exists
    if (phone !== currentUser.phone) {
      const existingPhone = await prisma.user.findFirst({
        where: { phone },
      });
      if (existingPhone) {
        return res.status(409).json({
          success: false,
          error: 'Phone number already exists',
        });
      }
    }

    // Check if studentId changed and if new studentId already exists
    if (studentId && studentId !== currentUser.studentId) {
      const existingStudentId = await prisma.user.findUnique({
        where: { studentId },
      });
      if (existingStudentId) {
        return res.status(409).json({
          success: false,
          error: 'Student ID already exists',
        });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { userId: req.user.userId },
      data: {
        userName,
        email,
        phone,
        studentId: studentId || null,
        universityName: universityName || null,
        country: country || null,
      },
      include: { role: true },
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * In-memory storage for OTP codes (in production, use Redis or database)
 * Structure: { email: { otp: string, otpToken: string, resetToken: string, expires: Date } }
 */
const otpStorage = new Map();

/**
 * Generate random 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate random token
 */
const generateRandomToken = () => {
  return require('crypto').randomBytes(32).toString('hex');
};

/**
 * POST /api/auth/forgot-password
 * Send OTP to user's email for password reset
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email address',
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account found with the corresponding email.',
      });
    }

    // Generate OTP and tokens
    const otp = generateOTP();
    const otpToken = generateRandomToken();

    // Store OTP (expires in 10 minutes)
    otpStorage.set(email, {
      otp,
      otpToken,
      resetToken: null,
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('[Forgot Password] Email sending failed:', emailError);
      // Still return success to prevent email enumeration attacks
      // But you might want to handle this differently in production
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
      otpToken, // Send to frontend for verification step
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * POST /api/auth/verify-otp
 * Verify OTP code
 */
const verifyOTP = async (req, res) => {
  try {
    const { email, otp, otpToken } = req.body;

    if (!email || !otp || !otpToken) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email, OTP, and token',
      });
    }

    // Check if OTP exists and is valid
    const storedData = otpStorage.get(email);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        error: 'OTP expired. Please request a new one.',
      });
    }

    // Check if OTP expired
    if (new Date() > storedData.expires) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        error: 'OTP expired. Please request a new one.',
      });
    }

    // Verify OTP token matches
    if (storedData.otpToken !== otpToken) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request. Please try again.',
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        error: 'Incorrect OTP. Check your email carefully and enter the OTP again.',
      });
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    storedData.resetToken = resetToken;

    res.json({
      success: true,
      message: 'OTP verified successfully',
      resetToken,
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * POST /api/auth/reset-password
 * Reset password with validation
 */
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    if (!email || !newPassword || !resetToken) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email, new password, and reset token',
      });
    }

    // Check if reset token is valid
    const storedData = otpStorage.get(email);

    if (!storedData || storedData.resetToken !== resetToken) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token. Please try again.',
      });
    }

    // Check if OTP expired
    if (new Date() > storedData.expires) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        error: 'Reset token expired. Please request a new OTP.',
      });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        error: 'New password must not be the same as current password',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Clear OTP storage
    otpStorage.delete(email);

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * POST /api/auth/admin-2fa
 * Second step of admin login: verify OTP and return real JWT.
 */
const admin2faVerify = async (req, res) => {
  try {
    const { email, otp, otpToken } = req.body;

    if (!email || !otp || !otpToken) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email, OTP, and token',
      });
    }

    const key = `admin_2fa_${email}`;
    const stored = otpStorage.get(key);

    if (!stored) {
      return res.status(400).json({
        success: false,
        error: 'OTP expired or not found. Please log in again.',
      });
    }

    if (new Date() > stored.expires) {
      otpStorage.delete(key);
      return res.status(400).json({
        success: false,
        error: 'OTP expired. Please log in again.',
      });
    }

    if (stored.otpToken !== otpToken) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request. Please try again.',
      });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({
        success: false,
        error: 'Incorrect OTP. Check your email and try again.',
      });
    }

    // OTP valid — clear it and issue JWT
    otpStorage.delete(key);

    const user = await prisma.user.findUnique({
      where: { userId: stored.userId },
      include: { role: true },
      omit: { password: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const token = generateToken(user.userId);

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user,
    });
  } catch (err) {
    console.error('[Admin 2FA] Verify error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { login, register, getMe, updateMe, forgotPassword, verifyOTP, resetPassword, admin2faVerify };
