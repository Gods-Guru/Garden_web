const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { requireAuth } = require('../middleware/auth');

// Submit feedback
router.post('/', requireAuth, feedbackController.submitFeedback);

// Get feedback for a garden
router.get('/garden/:gardenId', requireAuth, feedbackController.getGardenFeedback);

// Get all feedback (admin)
router.get('/', requireAuth, feedbackController.getAllFeedback);

module.exports = router;
