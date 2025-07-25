const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { requireAuth } = require('../middleware/auth');

// Get all settings
router.get('/', requireAuth, settingController.getSettings);

// Update a setting
router.patch('/', requireAuth, settingController.updateSetting);

module.exports = router;
