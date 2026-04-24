const prisma = require('../lib/prisma');

// GET /announcements - Get all announcements
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        creator: {
          select: {
            userId: true,
            userName: true,
          },
        },
        vendors: {
          include: {
            vendor: {
              select: {
                userId: true,
                userName: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /announcements/:id - Get announcement by ID
const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await prisma.announcement.findUnique({
      where: { announcementId: parseInt(id) },
      include: {
        creator: {
          select: {
            userId: true,
            userName: true,
          },
        },
      },
    });
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /announcements - Create new announcement
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, type, createdBy, vendorIds } = req.body;
    
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        type, // 'customers', 'vendors', 'all'
        createdBy: parseInt(createdBy),
        vendors: vendorIds && vendorIds.length > 0 ? {
          create: vendorIds.map(vendorId => ({
            vendorId: parseInt(vendorId)
          }))
        } : undefined
      },
      include: {
        creator: {
          select: {
            userId: true,
            userName: true,
          },
        },
        vendors: {
          include: {
            vendor: {
              select: {
                userId: true,
                userName: true,
              }
            }
          }
        }
      },
    });
    
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /announcements/:id - Update announcement
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, status } = req.body;
    
    const announcement = await prisma.announcement.update({
      where: { announcementId: parseInt(id) },
      data: {
        title,
        content,
        type,
        status,
      },
      include: {
        creator: {
          select: {
            userId: true,
            userName: true,
          },
        },
      },
    });
    
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /announcements/:id - Delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.announcement.delete({
      where: { announcementId: parseInt(id) },
    });
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /announcements/my - Get announcements for the current user based on their role
const getMyAnnouncements = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const roleName = role.roleName;

    let whereClause = {};

    if (roleName === 'Customer') {
      whereClause = {
        type: { in: ['customers', 'all'] },
        status: 'published'
      };
    } else if (roleName === 'Vendor') {
      whereClause = {
        OR: [
          { type: 'all' },
          {
            type: 'vendors',
            OR: [
              { vendors: { none: {} } }, // For all vendors
              { vendors: { some: { vendorId: userId } } } // Specific vendor
            ]
          }
        ],
        status: 'published'
      };
    } else if (roleName === 'Manager' || roleName === 'Admin') {
      // Managers and Admins see everything?
      whereClause = {};
    } else {
      return res.json([]);
    }

    const announcements = await prisma.announcement.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            userName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /announcements/vendors - Get all vendors
const getVendors = async (req, res) => {
  try {
    const vendors = await prisma.user.findMany({
      where: {
        role: {
          roleName: 'Vendor'
        }
      },
      select: {
        userId: true,
        userName: true,
        email: true,
      },
      orderBy: {
        userName: 'asc',
      },
    });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  getMyAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getVendors,
};
