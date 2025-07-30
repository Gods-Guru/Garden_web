const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
  getMyCrops,
  getCropTypes,
  updateCropStatus,
  harvestCrop
} = require('../controllers/cropController');

// All routes require authentication
router.use(requireAuth);

// Get crop types
router.get('/types', getCropTypes);

// Get user's crops
router.get('/my-crops', getMyCrops);

// Get all crops (admin/manager only)
router.get('/', authorize(['admin', 'manager']), getCrops);

// Create new crop
router.post('/', createCrop);

// Get specific crop
router.get('/:id', getCropById);

// Update crop
router.patch('/:id', updateCrop);

// Update crop status
router.patch('/:id/status', updateCropStatus);

// Harvest crop
router.patch('/:id/harvest', harvestCrop);

// Delete crop
router.delete('/:id', deleteCrop);

module.exports = router;
