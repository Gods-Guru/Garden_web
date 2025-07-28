const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const {
  getDashboardData,
  getGardenDashboard,
  getAdminDashboard
} = require('../controllers/dashboardController');

// User dashboard
router.get('/', requireAuth, getDashboardData);

// Garden-specific dashboard
router.get('/garden/:gardenId', requireAuth, getGardenDashboard);

// Admin dashboard
router.get('/admin', requireAuth, authorize(['admin']), getAdminDashboard);

module.exports = router;
