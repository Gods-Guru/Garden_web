const express = require('express');
const router = express.Router();
const plotController = require('../controllers/plotController');
const { requireAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authorize } = require('../middleware/authorize');
const { createPlotSchema, updatePlotSchema } = require('../validation/plotSchemas');

// All routes require authentication
router.use(requireAuth);

router.get('/', plotController.getPlots);
router.get('/:id', plotController.getPlot);
// Only admin or manager can create a plot
router.post('/', authorize('admin', 'manager'), validate(createPlotSchema), plotController.createPlot);
// Only admin or manager can update a plot
router.put('/:id', authorize('admin', 'manager'), validate(updatePlotSchema), plotController.updatePlot);
router.delete('/:id', authorize('admin', 'manager'), plotController.deletePlot);

module.exports = router;
