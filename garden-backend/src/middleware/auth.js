// Enhanced Authentication Middleware with Security Best Practices

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

// Enhanced JWT token generation with security best practices
const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
      iat: Math.floor(Date.now() / 1000),
      type: 'access'
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '24h',
      issuer: 'garden-management-system',
      audience: 'garden-users'
    }
  );
};

// Enhanced authentication middleware with proper error handling
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Invalid token format.',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }

    // Verify token with enhanced error handling
    // Try new format first, then fall back to old format for backward compatibility
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'garden-management-system',
        audience: 'garden-users'
      });
    } catch (error) {
      // If new format fails, try old format (for backward compatibility)
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Using legacy token format for user:', decoded.id);
      } catch (legacyError) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token. Please log in again.',
          code: 'INVALID_TOKEN'
        });
      }
    }

    // Get user from database with error handling (always fetch fresh data)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. User not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if user account is active
    if (user.status === 'inactive' || user.status === 'banned') {
      return res.status(403).json({
        success: false,
        error: 'Account is inactive or banned.',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    // Update last login (optional, can be disabled for performance)
    if (process.env.TRACK_LAST_LOGIN !== 'false') {
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error('Authentication error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token.',
        code: 'INVALID_TOKEN'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'NotBeforeError') {
      return res.status(401).json({
        success: false,
        error: 'Token not active yet.',
        code: 'TOKEN_NOT_ACTIVE'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Authentication failed.',
      code: 'AUTH_ERROR'
    });
  }
};

// Enhanced authorization middleware for garden-specific permissions
const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      // Extract garden ID from various sources
      const gardenId = req.params.gardenId ||
                      req.body.gardenId ||
                      req.query.gardenId ||
                      (req.body.garden && req.body.garden._id) ||
                      (req.body.garden && req.body.garden.id);

      if (!gardenId) {
        return res.status(400).json({
          success: false,
          error: 'Garden ID is required for this operation.',
          code: 'GARDEN_ID_REQUIRED'
        });
      }

      // Check if user has any role in this garden
      const membership = req.user.gardens.find(
        g => g.gardenId.toString() === gardenId.toString()
      );

      if (!membership) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You are not a member of this garden.',
          code: 'NOT_A_MEMBER'
        });
      }

      // Check if user has required role
      if (!roles.includes(membership.role)) {
        return res.status(403).json({
          success: false,
          error: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${membership.role}`,
          code: 'INSUFFICIENT_ROLE'
        });
      }

      // Attach user role to request for further use
      req.userRole = membership.role;
      req.gardenId = gardenId;
      next();

    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        success: false,
        error: 'Authorization check failed.',
        code: 'AUTHORIZATION_ERROR'
      });
    }
  };
};

// Check if user is system admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Admin privileges required.',
      code: 'ADMIN_REQUIRED'
    });
  }
  next();
};

// Check if user is garden admin (admin or owner)
const requireGardenAdmin = authorize('admin', 'owner');

// Check if user is garden coordinator or higher
const requireGardenCoordinator = authorize('coordinator', 'admin', 'owner');

// Check if user is garden member or higher
const requireGardenMember = authorize('member', 'coordinator', 'admin', 'owner');

// Optional authentication (for public endpoints that benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
          issuer: 'garden-management-system',
          audience: 'garden-users'
        });

        const user = await User.findById(decoded.id).select('-password');
        if (user && user.status !== 'inactive' && user.status !== 'banned') {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

// Rate limiting for authentication endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.',
    code: 'AUTH_RATE_LIMIT'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  requireAuth,
  authorize,
  requireAdmin,
  requireGardenAdmin,
  requireGardenCoordinator,
  requireGardenMember,
  optionalAuth,
  generateToken,
  authRateLimit
};