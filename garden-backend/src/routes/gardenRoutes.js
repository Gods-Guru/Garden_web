const express = require('express');
const router = express.Router();
const gardenController = require('../controllers/gardenController');
const auth = require('../middleware/auth');

// Public: Get all gardens (with search/pagination)
router.get('/', gardenController.getAllGardens);

// Public: Find gardens near a location
router.get('/nearby', gardenController.getNearbyGardens);

// Authenticated routes
router.use(auth);

router.get('/my', gardenController.getMyGardens);
router.get('/:gardenId', gardenController.getGarden);
router.post('/', gardenController.createGarden);
router.put('/:gardenId', gardenController.updateGarden);
router.delete('/:gardenId', gardenController.deleteGarden);
router.post('/:gardenId/join', gardenController.joinGarden);
router.post('/:gardenId/leave', gardenController.leaveGarden);
router.get('/:gardenId/members', gardenController.getGardenMembers);
router.put('/:gardenId/members/:userId/role', gardenController.updateMemberRole);
router.post('/:gardenId/members/:userId/manage', gardenController.manageMembership);
router.get('/:gardenId/stats', gardenController.getGardenStats);

module.exports = router;
