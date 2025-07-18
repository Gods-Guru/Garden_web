const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const auth = require('../middleware/auth');

// Get all audit logs (admin)
router.get('/', auth, auditLogController.getAllLogs);

module.exports = router;
