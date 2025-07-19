// Role-based access control middleware
const { AppError } = require('./errorHandler');

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403, 'FORBIDDEN'));
    }
    next();
  };
}

module.exports = authorize;
