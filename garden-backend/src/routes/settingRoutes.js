const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const auth = require('../middleware/auth');

// Get all settings
router.get('/', auth, settingController.getSettings);

// Update a setting
router.patch('/', auth, settingController.updateSetting);

module.exports = router;
