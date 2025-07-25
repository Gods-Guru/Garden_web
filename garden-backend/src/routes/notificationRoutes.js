const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/auth');

// Send notification (admin/manager)
router.post('/', requireAuth, notificationController.sendNotification);

// Get user notifications
router.get('/my', requireAuth, notificationController.getUserNotifications);

// Mark as read
router.patch('/:id/read', requireAuth, notificationController.markAsRead);

module.exports = router;
