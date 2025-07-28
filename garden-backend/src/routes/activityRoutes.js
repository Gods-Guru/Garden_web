const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  getActivities,
  getGardenActivities,
  getMyActivities
} = require('../controllers/activityController');

// All routes require authentication
router.use(requireAuth);

// Get general activity feed
router.get('/', getActivities);

// Get activities for a specific garden
router.get('/garden/:gardenId', getGardenActivities);

// Get current user's activities
router.get('/my', getMyActivities);

module.exports = router;
