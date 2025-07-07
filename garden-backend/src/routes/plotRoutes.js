const express = require('express');
const router = express.Router();
const plotController = require('../controllers/plotController');
const { requireAuth } = require('../middleware/auth');

// All routes require authentication
router.use(requireAuth);

router.get('/', plotController.getPlots);
router.get('/:id', plotController.getPlot);
router.post('/', plotController.createPlot);
router.put('/:id', plotController.updatePlot);
router.delete('/:id', plotController.deletePlot);

module.exports = router;
