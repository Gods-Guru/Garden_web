const AuditLog = require('../models/AuditLog');
const { catchAsync } = require('../middleware/errorHandler');

// Get activities (filtered by garden if gardenId provided)
const getActivities = catchAsync(async (req, res) => {
  const { gardenId } = req.params;
  const { limit = 10, before, after } = req.query;

  // Build query
  let query = {};
  
  // Filter by garden if provided
  if (gardenId) {
    query.garden = gardenId;
  }

  // Date filtering
  if (before || after) {
    query.timestamp = {};
    if (before) query.timestamp.$lt = new Date(before);
    if (after) query.timestamp.$gt = new Date(after);
  }

  const activities = await AuditLog.find(query)
    .populate('user', 'name avatar')
    .populate('garden', 'name')
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));

  // Format activities for response
  const formattedActivities = activities.map(activity => ({
    _id: activity._id,
    action: activity.action,
    timestamp: activity.timestamp,
    details: activity.details,
    user: {
      _id: activity.user._id,
      name: activity.user.name,
      avatar: activity.user.avatar
    },
    garden: activity.garden && {
      _id: activity.garden._id,
      name: activity.garden.name
    }
  }));

  res.json({
    success: true,
    activities: formattedActivities
  });
});

// Get activities for a specific garden
const getGardenActivities = catchAsync(async (req, res) => {
  const { gardenId } = req.params;
  const { limit = 10 } = req.query;

  const activities = await AuditLog.find({ garden: gardenId })
    .populate('user', 'name avatar')
    .populate('garden', 'name')
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    activities: activities.map(activity => ({
      _id: activity._id,
      action: activity.action,
      timestamp: activity.timestamp,
      details: activity.details,
      user: {
        _id: activity.user._id,
        name: activity.user.name,
        avatar: activity.user.avatar
      }
    }))
  });
});

// Get activities for current user
const getMyActivities = catchAsync(async (req, res) => {
  const { limit = 10 } = req.query;

  const activities = await AuditLog.find({
    $or: [
      { user: req.user._id },
      { 'details.assignedTo': req.user._id }
    ]
  })
    .populate('garden', 'name')
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    activities: activities.map(activity => ({
      _id: activity._id,
      action: activity.action,
      timestamp: activity.timestamp,
      details: activity.details,
      garden: activity.garden && {
        _id: activity.garden._id,
        name: activity.garden.name
      }
    }))
  });
});

module.exports = {
  getActivities,
  getGardenActivities,
  getMyActivities
};
