// Role-based access control middleware
const { AppError } = require('./errorHandler');
const Garden = require('../models/Garden');

// Global role authorization (for system-wide permissions)
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403, 'FORBIDDEN'));
    }
    next();
  };
}

// Garden-specific role authorization
function authorizeGarden(...allowedRoles) {
  return async (req, res, next) => {
    try {
      // Extract garden ID from params, body, or query
      const gardenId = req.params.gardenId || req.body.gardenId || req.query.gardenId;

      if (!gardenId) {
        return next(new AppError('Garden ID is required for this operation', 400, 'GARDEN_ID_REQUIRED'));
      }

      // Check if garden exists
      const garden = await Garden.findById(gardenId);
      if (!garden) {
        return next(new AppError('Garden not found', 404, 'GARDEN_NOT_FOUND'));
      }

      // Global admins have access to everything
      if (req.user.role === 'admin') {
        req.garden = garden;
        req.userGardenRole = 'admin';
        return next();
      }

      // Check if user is garden owner
      if (garden.owner.toString() === req.user._id.toString()) {
        req.garden = garden;
        req.userGardenRole = 'owner';
        return next();
      }

      // Check user's role in this specific garden
      const userGardenRole = req.user.getRoleInGarden(gardenId);

      if (!userGardenRole) {
        return next(new AppError('You are not a member of this garden', 403, 'NOT_GARDEN_MEMBER'));
      }

      if (!allowedRoles.includes(userGardenRole)) {
        return next(new AppError(`Access denied. Required role: ${allowedRoles.join(' or ')}`, 403, 'INSUFFICIENT_GARDEN_ROLE'));
      }

      req.garden = garden;
      req.userGardenRole = userGardenRole;
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Check if user is garden owner or admin (for management operations)
const requireGardenAdmin = authorizeGarden('owner', 'admin');

// Check if user is garden coordinator or higher (for coordination tasks)
const requireGardenCoordinator = authorizeGarden('owner', 'admin', 'coordinator');

// Check if user is at least a member (for basic garden access)
const requireGardenMember = authorizeGarden('owner', 'admin', 'coordinator', 'member');

module.exports = {
  authorize,
  authorizeGarden,
  requireGardenAdmin,
  requireGardenCoordinator,
  requireGardenMember
};
