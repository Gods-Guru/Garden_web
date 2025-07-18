const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const auth = require('../middleware/auth');

// Register as a volunteer
router.post('/register', auth, volunteerController.registerVolunteer);

// Get all volunteers
router.get('/', auth, volunteerController.getAllVolunteers);

// Assign badge
router.patch('/:id/badge', auth, volunteerController.assignBadge);

// Add hours
router.patch('/:id/hours', auth, volunteerController.addHours);

module.exports = router;
