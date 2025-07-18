const WaterLog = require('../models/WaterLog');
const Plot = require('../models/Plot');
const { AppError } = require('../middleware/errorHandler');
const { catchAsync } = require('../middleware/errorHandler');
const { body, param, query, validationResult } = require('express-validator');

// Helper for validation error handling
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array().map(e => e.msg).join(', '), 400, 'VALIDATION_ERROR'));
  }
  next();
};

// Get all water logs for a plot or garden (with pagination)
const getWaterLogs = catchAsync(async (req, res, next) => {
  const { plotId, gardenId, page = 1, limit = 20 } = req.query;
  let query = {};
  if (plotId) query.plot = plotId;
  if (gardenId) query.garden = gardenId;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const logs = await WaterLog.find(query)
    .populate('plot user', 'number name email')
    .skip(skip)
    .limit(parseInt(limit));
  const total = await WaterLog.countDocuments(query);
  res.json({ success: true, data: logs, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
});

// Get a single water log
const getWaterLog = catchAsync(async (req, res, next) => {
  const log = await WaterLog.findById(req.params.id).populate('plot user', 'number name email');
  if (!log) return next(new AppError('Water log not found', 404));
  res.json({ success: true, data: log });
});

// Create a new water log
const createWaterLog = catchAsync(async (req, res, next) => {
  const log = new WaterLog(req.body);
  await log.save();
  res.status(201).json({ success: true, data: log });
});

// Update a water log
const updateWaterLog = catchAsync(async (req, res, next) => {
  const log = await WaterLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!log) return next(new AppError('Water log not found', 404));
  res.json({ success: true, data: log });
});

// Delete a water log
const deleteWaterLog = catchAsync(async (req, res, next) => {
  const log = await WaterLog.findByIdAndDelete(req.params.id);
  if (!log) return next(new AppError('Water log not found', 404));
  res.json({ success: true, message: 'Water log deleted' });
});

// Water usage analytics for a garden or plot
const getWaterAnalytics = catchAsync(async (req, res, next) => {
  const { gardenId, plotId, range } = req.query;
  let match = {};
  if (gardenId) match.garden = gardenId;
  if (plotId) match.plot = plotId;

  // Date range filter (e.g., last 7 days, month, etc.)
  if (range) {
    const now = new Date();
    let start;
    if (range === 'week') start = new Date(now.setDate(now.getDate() - 7));
    else if (range === 'month') start = new Date(now.setMonth(now.getMonth() - 1));
    else if (range === 'year') start = new Date(now.setFullYear(now.getFullYear() - 1));
    if (start) match.date = { $gte: start };
  }

  // Aggregate total, average, and per-day usage
  const stats = await WaterLog.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          day: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          method: '$method',
          plot: '$plot',
        },
        totalAmount: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.day': 1 } }
  ]);

  // Overall summary
  const summary = await WaterLog.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        average: { $avg: '$amount' },
        sessions: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      summary: summary[0] || { total: 0, average: 0, sessions: 0 },
      daily: stats
    }
  });
});

// Water usage leaderboard (top savers, top users)
const getWaterLeaderboard = catchAsync(async (req, res, next) => {
  const { gardenId } = req.query;
  let match = {};
  if (gardenId) match.garden = gardenId;

  // Top users by total water used
  const topUsers = await WaterLog.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$user',
        total: { $sum: '$amount' },
        sessions: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 10 }
  ]);

  res.json({ success: true, data: { topUsers } });
});

// Water method efficiency (which methods save the most water)
const getMethodEfficiency = catchAsync(async (req, res, next) => {
  const { gardenId } = req.query;
  let match = {};
  if (gardenId) match.garden = gardenId;

  const methods = await WaterLog.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$method',
        total: { $sum: '$amount' },
        avg: { $avg: '$amount' },
        sessions: { $sum: 1 }
      }
    },
    { $sort: { avg: 1 } } // Most efficient first
  ]);

  res.json({ success: true, data: { methods } });
});

// Validation chains
const validateWaterLog = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('date').optional().isISO8601().withMessage('Date must be ISO8601'),
  body('method').isString().withMessage('Method is required'),
  body('plot').isMongoId().withMessage('Plot ID must be valid'),
  body('garden').isMongoId().withMessage('Garden ID must be valid'),
  body('user').isMongoId().withMessage('User ID must be valid'),
  handleValidation
];

const validateId = [
  param('id').isMongoId().withMessage('Invalid ID'),
  handleValidation
];

const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  handleValidation
];

module.exports = {
  getWaterLogs,
  getWaterLog,
  createWaterLog,
  updateWaterLog,
  deleteWaterLog,
  getWaterAnalytics,
  getWaterLeaderboard,
  getMethodEfficiency,
  validateWaterLog,
  validateId,
  validatePagination
};
