const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// Verify JWT token and attach user to request
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { userId: decoded.id },
        omit: { password: true },
        include: { role: true },
      });

      if (!user || user.status !== 'Active') {
        return res.status(401).json({ success: false, message: 'Not authorized, account inactive' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Role-based access guard — usage: authorize('Admin', 'Vendor')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role.roleName)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user?.role?.roleName}' is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
