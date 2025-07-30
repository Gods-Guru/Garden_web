const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/activity-logs/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'activity-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Sample activity logs (in production, this would come from database)
let activityLogs = [
  {
    _id: '1',
    userId: 'user1',
    activity: 'Watering',
    description: 'Watered all the tomato plants in section A',
    date: '2024-01-15',
    photo: '/uploads/activity-logs/watering-1.jpg',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: '2',
    userId: 'user1',
    activity: 'Planting',
    description: 'Planted new lettuce seeds in rows 3-5',
    date: '2024-01-20',
    photo: null,
    createdAt: '2024-01-20T14:15:00Z'
  }
];

// Get user's activity logs
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Ensure user can only access their own logs (or admin can access any)
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const userLogs = activityLogs
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      logs: userLogs
    });

  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity logs'
    });
  }
});

// Create new activity log
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const { activity, description, date } = req.body;

    // Validate required fields
    if (!activity || !description || !date) {
      return res.status(400).json({
        success: false,
        message: 'Activity, description, and date are required'
      });
    }

    const newLog = {
      _id: Date.now().toString(),
      userId: req.user.id,
      activity,
      description,
      date,
      photo: req.file ? `/uploads/activity-logs/${req.file.filename}` : null,
      createdAt: new Date().toISOString()
    };

    activityLogs.push(newLog);

    res.status(201).json({
      success: true,
      message: 'Activity log created successfully',
      log: newLog
    });

  } catch (error) {
    console.error('Create activity log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create activity log'
    });
  }
});

// Update activity log
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;
    const { activity, description, date } = req.body;

    const logIndex = activityLogs.findIndex(log => log._id === id);
    if (logIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Activity log not found'
      });
    }

    const log = activityLogs[logIndex];
    
    // Ensure user can only update their own logs
    if (log.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update log
    activityLogs[logIndex] = {
      ...log,
      activity: activity || log.activity,
      description: description || log.description,
      date: date || log.date,
      photo: req.file ? `/uploads/activity-logs/${req.file.filename}` : log.photo,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'Activity log updated successfully',
      log: activityLogs[logIndex]
    });

  } catch (error) {
    console.error('Update activity log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update activity log'
    });
  }
});

// Delete activity log
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const logIndex = activityLogs.findIndex(log => log._id === id);
    if (logIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Activity log not found'
      });
    }

    const log = activityLogs[logIndex];
    
    // Ensure user can only delete their own logs
    if (log.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    activityLogs.splice(logIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Activity log deleted successfully'
    });

  } catch (error) {
    console.error('Delete activity log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete activity log'
    });
  }
});

module.exports = router;
