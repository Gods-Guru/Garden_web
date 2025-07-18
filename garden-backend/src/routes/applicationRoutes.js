const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');

// User applies for a plot
router.post('/apply', auth, applicationController.applyForPlot);

// Admin/manager gets all applications
router.get('/', auth, applicationController.getAllApplications);

// Admin/manager reviews an application
router.patch('/:id/review', auth, applicationController.reviewApplication);

// User gets their applications
router.get('/my', auth, applicationController.getUserApplications);

module.exports = router;
