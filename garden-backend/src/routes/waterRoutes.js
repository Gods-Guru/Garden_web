const express = require('express');
const router = express.Router();
const waterController = require('../controllers/waterController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', waterController.validatePagination, waterController.getWaterLogs);
router.get('/:id', waterController.validateId, waterController.getWaterLog);
router.post('/', waterController.validateWaterLog, waterController.createWaterLog);
router.put('/:id', waterController.validateId, waterController.validateWaterLog, waterController.updateWaterLog);
router.delete('/:id', waterController.validateId, waterController.deleteWaterLog);
router.get('/analytics', waterController.getWaterAnalytics);
router.get('/leaderboard', waterController.getWaterLeaderboard);
router.get('/methods', waterController.getMethodEfficiency);

module.exports = router;