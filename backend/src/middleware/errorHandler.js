// Centralized error handler — must be registered last in Express
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    statusCode = 409; // Conflict
    const target = err.meta?.target || 'field';
    message = `A record with that ${target} already exists`;
  }

  // Prisma record not found (for update/delete)
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Prisma validation error (missing required fields, wrong type, etc.)
  if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid data provided';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { details: err.message, stack: err.stack }),
  });
};

module.exports = errorHandler;
