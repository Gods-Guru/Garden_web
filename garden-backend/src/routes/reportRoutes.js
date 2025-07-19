const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

// Generate report
router.post('/', auth, reportController.generateReport);

// Get all reports
router.get('/', auth, reportController.getAllReports);

module.exports = router;
