const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const {
  getDashboardData,
  getGardenDashboard,
  getAdminDashboard,
  getAdminStats,
  getAdminActivity,
  getManagerStats,
  getManagerActivity,
  getGardenerStats,
  getVolunteerStats
} = require('../controllers/dashboardController');

// User dashboard
router.get('/', requireAuth, getDashboardData);

// Garden-specific dashboard
router.get('/garden/:gardenId', requireAuth, getGardenDashboard);

// Admin dashboard
router.get('/admin', requireAuth, authorize(['admin']), getAdminDashboard);

// Role-specific stats endpoints
router.get('/admin/stats', requireAuth, authorize(['admin']), getAdminStats);
router.get('/admin/activity', requireAuth, authorize(['admin']), getAdminActivity);
router.get('/manager/stats', requireAuth, authorize(['manager', 'admin']), getManagerStats);
router.get('/manager/activity', requireAuth, authorize(['manager', 'admin']), getManagerActivity);
router.get('/gardener/stats', requireAuth, getGardenerStats);
router.get('/volunteer/stats', requireAuth, getVolunteerStats);

module.exports = router;
