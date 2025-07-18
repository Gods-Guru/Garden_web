const express = require('express');
const router = express.Router();
const gardenController = require('../controllers/gardenController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const authorize = require('../middleware/authorize');
const { createGardenSchema, updateGardenSchema } = require('../validation/gardenSchemas');

// Public: Get all gardens (with search/pagination)
router.get('/', gardenController.getAllGardens);

// Public: Find gardens near a location
router.get('/nearby', gardenController.getNearbyGardens);

// Authenticated routes
router.use(auth);

router.get('/my', gardenController.getMyGardens);
router.get('/:gardenId', gardenController.getGarden);
// Only admin can create or update a garden
router.post('/', authorize('admin'), validate(createGardenSchema), gardenController.createGarden);
router.put('/:gardenId', authorize('admin'), validate(updateGardenSchema), gardenController.updateGarden);
router.delete('/:gardenId', authorize('admin'), gardenController.deleteGarden);
router.post('/:gardenId/join', gardenController.joinGarden);
router.post('/:gardenId/leave', gardenController.leaveGarden);
router.get('/:gardenId/members', gardenController.getGardenMembers);
router.put('/:gardenId/members/:userId/role', authorize('admin'), gardenController.updateMemberRole);
router.post('/:gardenId/members/:userId/manage', authorize('admin', 'manager'), gardenController.manageMembership);
router.get('/:gardenId/stats', gardenController.getGardenStats);

module.exports = router;