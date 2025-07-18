// import jwt from 'jsonwebtoken';
// import { User } from '../models/index.js';

// // Generate JWT token
// export const generateToken = (userId) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE || '7d'
//   });
// };

// // Verify JWT token and get user
// export const authenticate = async (req, res, next) => {
//   try {
//     let token;

//     // Check for token in Authorization header
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];
//     }

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'Access denied. No token provided.'
//       });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Get user from database
//     const user = await User.findById(decoded.userId).select('-password');
    
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid token. User not found.'
//       });
//     }

//     // Update last login
//     user.lastLogin = new Date();
//     user.loginCount += 1;
//     await user.save();

//     // Add user to request object
//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('Authentication error:', error);
    
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid token.'
//       });
//     }
    
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({
//         success: false,
//         message: 'Token expired.'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Authentication failed.'
//     });
//   }
// };

// // Check if user has specific role in a garden
// export const authorize = (...roles) => {
//   return (req, res, next) => {
//     const { gardenId } = req.body.garden || req.query.gardenId || req.params.gardenId || (req.body && req.body.garden) || (req.query && req.query.gardenId);
//     if (!gardenId) {
//       return res.status(400).json({
//         success: false,
//         errorCode: 'GARDEN_ID_REQUIRED',
//         message: 'Garden ID is required for authorization.'
//       });
//     }
//     const membership = req.user.gardens.find(
//       g => g.gardenId.toString() === gardenId.toString()
//     );
//     if (!membership) {
//       return res.status(403).json({
//         success: false,
//         errorCode: 'NOT_A_MEMBER',
//         message: 'Access denied. You are not a member of this garden.'
//       });
//     }
//     if (!roles.includes(membership.role)) {
//       return res.status(403).json({
//         success: false,
//         errorCode: 'INSUFFICIENT_ROLE',
//         message: `Access denied. Required role: ${roles.join(' or ')}`
//       });
//     }
//     req.userRole = membership.role;
//     next();
//   };
// };

// // Check if user is garden admin (admin or owner)
// export const requireGardenAdmin = authorize('admin', 'owner');

// // Check if user is garden coordinator or higher
// export const requireGardenCoordinator = authorize('coordinator', 'admin', 'owner');

// // Optional authentication (for public endpoints that benefit from user context)
// export const optionalAuth = async (req, res, next) => {
//   try {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];
      
//       if (token) {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.userId).select('-password');
//         if (user) {
//           req.user = user;
//         }
//       }
//     }
    
//     next();
//   } catch (error) {
//     // Continue without authentication for optional auth
//     next();
//   }
// };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Check if user has specific role in a garden
const authorize = (...roles) => {
  return (req, res, next) => {
    const { gardenId } = req.body.garden || req.query.gardenId || req.params.gardenId || (req.body && req.body.garden) || (req.query && req.query.gardenId);
    if (!gardenId) {
      return res.status(400).json({
        success: false,
        errorCode: 'GARDEN_ID_REQUIRED',
        message: 'Garden ID is required for authorization.'
      });
    }
    const membership = req.user.gardens.find(
      g => g.gardenId.toString() === gardenId.toString()
    );
    if (!membership) {
      return res.status(403).json({
        success: false,
        errorCode: 'NOT_A_MEMBER',
        message: 'Access denied. You are not a member of this garden.'
      });
    }
    if (!roles.includes(membership.role)) {
      return res.status(403).json({
        success: false,
        errorCode: 'INSUFFICIENT_ROLE',
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    req.userRole = membership.role;
    next();
  };
};

// Check if user is garden admin (admin or owner)
const requireGardenAdmin = authorize('admin', 'owner');

// Check if user is garden coordinator or higher
const requireGardenCoordinator = authorize('coordinator', 'admin', 'owner');

// Optional authentication (for public endpoints that benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (user) {
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

module.exports = requireAuth;