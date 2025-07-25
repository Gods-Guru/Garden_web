const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const { requireAuth } = require('../middleware/auth');

// Register as a volunteer
router.post('/register', requireAuth, volunteerController.registerVolunteer);

// Get all volunteers
router.get('/', requireAuth, volunteerController.getAllVolunteers);

// Assign badge
router.patch('/:id/badge', requireAuth, volunteerController.assignBadge);

// Add hours
router.patch('/:id/hours', requireAuth, volunteerController.addHours);

module.exports = router;
