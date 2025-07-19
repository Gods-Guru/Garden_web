const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/auth');

// Submit feedback
router.post('/', auth, feedbackController.submitFeedback);

// Get feedback for a garden
router.get('/garden/:gardenId', auth, feedbackController.getGardenFeedback);

// Get all feedback (admin)
router.get('/', auth, feedbackController.getAllFeedback);

module.exports = router;
