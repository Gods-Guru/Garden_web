const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { requireAuth } = require('../middleware/auth');

// User applies for a plot
router.post('/apply', requireAuth, applicationController.applyForPlot);

// Admin/manager gets all applications
router.get('/', requireAuth, applicationController.getAllApplications);

// Admin/manager reviews an application
router.patch('/:id/review', requireAuth, applicationController.reviewApplication);

// User gets their applications
router.get('/my', requireAuth, applicationController.getUserApplications);

module.exports = router;
