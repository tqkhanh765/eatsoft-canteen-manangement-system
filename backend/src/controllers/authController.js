const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
 * Login with email and password
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Find user by email (include password for comparison)
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if account is active
    if (user.status !== 'Active') {
      return res.status(401).json({
        success: false,
        error: 'Account is inactive. Please contact administrator.',
      });
    }

    // Verify password
    // Note: In production, passwords should be hashed with bcrypt
    // For the seeded data, passwords are stored as plain text 'hashed_password_123'
    // This is a temporary comparison for the seeded data
    const isMatch = user.password === password || await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user.userId);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
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

    // Create user
    const user = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
        phone: phone || '',
        status: 'Active',
        roleId: customerRole.roleId,
      },
      include: { role: true },
    });

    // Generate token
    const token = generateToken(user.userId);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error('Register error:', err);
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'Email already exists',
      });
    }
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

module.exports = { login, register, getMe };
