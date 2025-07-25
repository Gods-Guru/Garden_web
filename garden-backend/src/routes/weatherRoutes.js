const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { requireAuth } = require('../middleware/auth');

// Get weather for a garden location
router.get('/', requireAuth, weatherController.getWeather);

module.exports = router;
