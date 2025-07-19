const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Send notification (admin/manager)
router.post('/', auth, notificationController.sendNotification);

// Get user notifications
router.get('/my', auth, notificationController.getUserNotifications);

// Mark as read
router.patch('/:id/read', auth, notificationController.markAsRead);

module.exports = router;
