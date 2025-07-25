const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { requireAuth } = require('../middleware/auth');

// Create schedule/reminder
router.post('/', requireAuth, scheduleController.createSchedule);

// Get user schedules
router.get('/my', requireAuth, scheduleController.getUserSchedules);

// Get all schedules (admin/manager)
router.get('/', requireAuth, scheduleController.getAllSchedules);

module.exports = router;
