const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { requireAuth } = require('../middleware/auth');

// Generate report
router.post('/', requireAuth, reportController.generateReport);

// Get all reports
router.get('/', requireAuth, reportController.getAllReports);

module.exports = router;
