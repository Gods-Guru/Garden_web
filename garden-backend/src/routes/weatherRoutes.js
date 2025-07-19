const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const auth = require('../middleware/auth');

// Get weather for a garden location
router.get('/', auth, weatherController.getWeather);

module.exports = router;
