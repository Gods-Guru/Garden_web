const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const { requireAuth } = require('../middleware/auth');

// Get all audit logs (admin)
router.get('/', requireAuth, auditLogController.getAllLogs);

module.exports = router;
