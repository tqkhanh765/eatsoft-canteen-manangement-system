const prisma = require('../lib/prisma');
const { sendRegistrationStatusEmail } = require('../services/emailService');

/**
 * POST /api/stall-registrations
 * Submit new stall registration form (by customer/user)
 */
const submitRegistration = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, stallName, description, documents } = req.body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !stallName) {
      return res.status(400).json({
        success: false,
        error: 'Please provide fullName, email, phoneNumber, and stallName',
      });
    }

    // Check if email already has a pending/approved registration
    const existingRegistration = await prisma.stallRegistration.findFirst({
      where: {
        email,
        status: {
          in: ['MANAGER_PENDING', 'MANAGER_APPROVED', 'ADMIN_PENDING', 'ADMIN_COMPLETED'],
        },
      },
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        error: 'You already have a registration in progress. Please wait for it to be processed.',
      });
    }

    // Create new registration
    const registration = await prisma.stallRegistration.create({
      data: {
        fullName,
        email,
        phoneNumber,
        stallName,
        description: description || null,
        documents: documents || [],
        status: 'MANAGER_PENDING',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully. You will be notified when a manager reviews your application.',
      registration,
    });
  } catch (err) {
    console.error('Submit registration error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET /api/stall-registrations
 * Get all stall registrations (for manager/admin)
 */
const getAllRegistrations = async (req, res) => {
  try {
    const { status } = req.query;
    
    const where = status ? { status } : {};
    
    const registrations = await prisma.stallRegistration.findMany({
      where,
      include: {
        manager: {
          select: { userId: true, userName: true, email: true },
        },
        admin: {
          select: { userId: true, userName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      registrations,
    });
  } catch (err) {
    console.error('Get registrations error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET /api/stall-registrations/:id
 * Get single registration details
 */
const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await prisma.stallRegistration.findUnique({
      where: { id: parseInt(id) },
      include: {
        manager: {
          select: { userId: true, userName: true, email: true },
        },
        admin: {
          select: { userId: true, userName: true, email: true },
        },
      },
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found',
      });
    }

    res.json({
      success: true,
      registration,
    });
  } catch (err) {
    console.error('Get registration error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * PATCH /api/stall-registrations/:id/manager-review
 * Manager approves or rejects registration
 */
const managerReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, note } = req.body; // action: 'approve' or 'reject'
    const managerId = req.user.userId; // From auth middleware

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide action: "approve" or "reject"',
      });
    }

    const registration = await prisma.stallRegistration.findUnique({
      where: { id: parseInt(id) },
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found',
      });
    }

    if (registration.status !== 'MANAGER_PENDING') {
      return res.status(400).json({
        success: false,
        error: 'This registration has already been reviewed',
      });
    }

    const newStatus = action === 'approve' ? 'MANAGER_APPROVED' : 'MANAGER_REJECTED';

    const updated = await prisma.stallRegistration.update({
      where: { id: parseInt(id) },
      data: {
        status: newStatus,
        managerId,
        managerNote: note || null,
        reviewedAt: new Date(),
      },
    });

    // Send email notification to applicant
    try {
      await sendRegistrationStatusEmail(
        registration.email,
        registration.stallName,
        newStatus,
        note
      );
    } catch (emailErr) {
      console.error('[Email] Failed to send status update:', emailErr);
    }

    res.json({
      success: true,
      message: `Registration ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      registration: updated,
    });
  } catch (err) {
    console.error('Manager review error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * POST /api/stall-registrations/:id/create-vendor
 * Admin creates vendor account and store (after manager approval)
 */
const createVendorAndStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { vendorPassword, storeLocation } = req.body;
    const adminId = req.user.userId; // From auth middleware

    if (!vendorPassword || !storeLocation) {
      return res.status(400).json({
        success: false,
        error: 'Please provide vendorPassword and storeLocation',
      });
    }

    const registration = await prisma.stallRegistration.findUnique({
      where: { id: parseInt(id) },
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found',
      });
    }

    if (registration.status !== 'MANAGER_APPROVED') {
      return res.status(400).json({
        success: false,
        error: 'Registration must be approved by manager first',
      });
    }

    // Check if email already exists as a user
    const existingUser = await prisma.user.findUnique({
      where: { email: registration.email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'A user with this email already exists',
      });
    }

    // Get Vendor role
    const vendorRole = await prisma.role.findFirst({
      where: { roleName: 'Vendor' },
    });

    if (!vendorRole) {
      return res.status(500).json({
        success: false,
        error: 'Vendor role not found in system',
      });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(vendorPassword, 10);

    // Create vendor user and store in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create vendor user
      const vendor = await tx.user.create({
        data: {
          userName: registration.fullName,
          email: registration.email,
          phone: registration.phoneNumber,
          password: hashedPassword,
          status: 'Active',
          roleId: vendorRole.roleId,
        },
      });

      // Create store
      const store = await tx.store.create({
        data: {
          storeName: registration.stallName,
          description: registration.description,
          location: storeLocation,
          managerId: vendor.userId,
        },
      });

      // Update registration
      const updatedRegistration = await tx.stallRegistration.update({
        where: { id: parseInt(id) },
        data: {
          status: 'ADMIN_COMPLETED',
          adminId,
          createdVendorId: vendor.userId,
          createdStoreId: store.storeId,
        },
      });

      return { vendor, store, updatedRegistration };
    });

    // Send success email to new vendor
    try {
      await sendRegistrationStatusEmail(
        registration.email,
        registration.stallName,
        'ADMIN_COMPLETED',
        `Your vendor account has been created. Your store "${registration.stallName}" is now active.`,
        vendorPassword   // plain-text password shown in the credentials block
      );
    } catch (emailErr) {
      console.error('[Email] Failed to send completion notification:', emailErr);
    }

    res.json({
      success: true,
      message: 'Vendor account and store created successfully',
      vendor: {
        userId: result.vendor.userId,
        email: result.vendor.email,
        userName: result.vendor.userName,
      },
      store: {
        storeId: result.store.storeId,
        storeName: result.store.storeName,
      },
      registration: result.updatedRegistration,
    });
  } catch (err) {
    console.error('Create vendor error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * PATCH /api/stall-registrations/:id/admin-reject
 * Admin rejects a manager-approved registration
 */
const adminReject = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const adminId = req.user.userId;

    const registration = await prisma.stallRegistration.findUnique({
      where: { id: parseInt(id) },
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found',
      });
    }

    if (registration.status !== 'MANAGER_APPROVED') {
      return res.status(400).json({
        success: false,
        error: 'Only manager-approved registrations can be rejected by admin',
      });
    }

    const updated = await prisma.stallRegistration.update({
      where: { id: parseInt(id) },
      data: {
        status: 'ADMIN_REJECTED',
        adminId,
        managerNote: note || null,
      },
    });

    // Send rejection email
    try {
      await sendRegistrationStatusEmail(
        registration.email,
        registration.stallName,
        'ADMIN_REJECTED',
        note
      );
    } catch (emailErr) {
      console.error('[Email] Failed to send rejection email:', emailErr);
    }

    res.json({
      success: true,
      message: 'Registration rejected by admin',
      registration: updated,
    });
  } catch (err) {
    console.error('Admin reject error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  submitRegistration,
  getAllRegistrations,
  getRegistrationById,
  managerReview,
  createVendorAndStore,
  adminReject,
};
