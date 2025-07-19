const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');

// Create schedule/reminder
router.post('/', auth, scheduleController.createSchedule);

// Get user schedules
router.get('/my', auth, scheduleController.getUserSchedules);

// Get all schedules (admin/manager)
router.get('/', auth, scheduleController.getAllSchedules);

module.exports = router;
