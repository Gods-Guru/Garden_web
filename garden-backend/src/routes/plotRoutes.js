const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const plotController = require('../controllers/plotController');
const { requireAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authorize } = require('../middleware/authorize');
const { createPlotSchema, updatePlotSchema } = require('../validation/plotSchemas');

// Configure multer for plot image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/plots/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'plot-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// All routes require authentication
router.use(requireAuth);

router.get('/', plotController.getPlots);
router.get('/:id', plotController.getPlot);

// User's plot routes
router.get('/my-plots', plotController.getMyPlots);
router.get('/my-plot', plotController.getMyPlot);
router.patch('/my-plot/notes', plotController.updateMyPlotNotes);
router.post('/my-plot/upload-image', upload.single('image'), plotController.uploadPlotImage);
// router.post('/apply', plotController.applyForPlot);

// Only admin or manager can create a plot
router.post('/', authorize('admin', 'manager'), validate(createPlotSchema), plotController.createPlot);
// Only admin or manager can update a plot
router.put('/:id', authorize('admin', 'manager'), validate(updatePlotSchema), plotController.updatePlot);
router.delete('/:id', authorize('admin', 'manager'), plotController.deletePlot);

module.exports = router;
