import { body, param, query, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Garden validation rules
export const validateGardenCreation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Garden name must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('address.zipCode')
    .trim()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Please provide a valid ZIP code'),
  
  body('settings.maxMembers')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Max members must be between 1 and 1000'),
  
  handleValidationErrors
];

// Plot validation rules
export const validatePlotCreation = [
  body('plotNumber')
    .trim()
    .notEmpty()
    .withMessage('Plot number is required'),
  
  body('dimensions.length')
    .isFloat({ min: 1, max: 100 })
    .withMessage('Plot length must be between 1 and 100 feet'),
  
  body('dimensions.width')
    .isFloat({ min: 1, max: 100 })
    .withMessage('Plot width must be between 1 and 100 feet'),
  
  body('location.section')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Section name cannot exceed 10 characters'),
  
  handleValidationErrors
];

// Task validation rules
export const validateTaskCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Task title must be between 3 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Task description must be between 10 and 1000 characters'),
  
  body('category')
    .isIn([
      'watering', 'weeding', 'planting', 'harvesting', 'pruning',
      'fertilizing', 'pest_control', 'maintenance', 'cleanup',
      'soil_preparation', 'composting', 'general', 'event_setup'
    ])
    .withMessage('Invalid task category'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  
  body('dueDate')
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid due date'),
  
  body('estimatedDuration')
    .optional()
    .isInt({ min: 5, max: 480 })
    .withMessage('Estimated duration must be between 5 and 480 minutes'),
  
  handleValidationErrors
];

// Event validation rules
export const validateEventCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Event title must be between 3 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Event description must be between 10 and 2000 characters'),
  
  body('category')
    .isIn([
      'workshop', 'volunteer_day', 'harvest_festival', 'planting_day',
      'educational', 'social', 'fundraiser', 'maintenance', 'meeting',
      'celebration', 'tour', 'market', 'other'
    ])
    .withMessage('Invalid event category'),
  
  body('startDate')
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid start date'),
  
  body('endDate')
    .isISO8601()
    .toDate()
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('registration.maxAttendees')
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage('Max attendees must be between 1 and 500'),
  
  handleValidationErrors
];

// Parameter validation
export const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`),
  
  handleValidationErrors
];

// Query validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'name', '-name', 'updatedAt', '-updatedAt'])
    .withMessage('Invalid sort parameter'),
  
  handleValidationErrors
];