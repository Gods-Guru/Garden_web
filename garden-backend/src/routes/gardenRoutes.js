const express = require('express');
const router = express.Router();
const gardenController = require('../controllers/gardenController');
const { requireAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authorize, requireGardenAdmin, requireGardenMember } = require('../middleware/authorize');
const { createGardenSchema, updateGardenSchema } = require('../validation/gardenSchemas');

// Public: Get all gardens (with search/pagination)
router.get('/', gardenController.getAllGardens);

// Public: Find gardens near a location
router.get('/nearby', gardenController.getNearbyGardens);

// Public: Get gardens from web sources
router.get('/web', async (req, res) => {
  try {
    const GardenDataService = require('../services/GardenDataService');
    const location = req.query.lat && req.query.lng ? {
      lat: parseFloat(req.query.lat),
      lng: parseFloat(req.query.lng)
    } : null;
    const radius = parseInt(req.query.radius) || 50;

    console.log('🌍 Fetching REAL gardens from internet sources...');
    console.log(`📍 Location: ${location ? `${location.lat}, ${location.lng}` : 'Global'}`);
    console.log(`📏 Radius: ${radius} miles`);

    const gardens = await GardenDataService.getGardensFromWeb(location, radius);

    console.log(`✅ Found ${gardens.length} real gardens from internet sources`);

    res.json({
      success: true,
      data: {
        gardens: gardens,
        source: 'internet',
        location: location,
        radius: radius,
        sources: gardens.reduce((acc, garden) => {
          acc[garden.source] = (acc[garden.source] || 0) + 1;
          return acc;
        }, {}),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Web gardens route error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Public: Test real garden discovery
router.get('/discover', async (req, res) => {
  try {
    const GardenDataService = require('../services/GardenDataService');

    // Test locations known to have many community gardens
    const testLocations = [
      { name: 'New York City (Brooklyn)', lat: 40.6782, lng: -73.9442 },
      { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
      { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
      { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050 },
      { name: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041 },
      { name: 'Portland, Oregon', lat: 45.5152, lng: -122.6784 },
      { name: 'User Location', lat: parseFloat(req.query.lat), lng: parseFloat(req.query.lng) }
    ].filter(loc => loc.lat && loc.lng && !isNaN(loc.lat) && !isNaN(loc.lng));

    const results = {};
    let totalGardens = 0;

    for (const location of testLocations) {
      console.log(`🔍 Comprehensive search near ${location.name}...`);
      try {
        // Use larger radius for better results
        const gardens = await GardenDataService.getGardensFromWeb(location, 50);
        totalGardens += gardens.length;

        results[location.name] = {
          location: location,
          count: gardens.length,
          gardens: gardens.slice(0, 5), // First 5 for preview
          sources: gardens.reduce((acc, garden) => {
            acc[garden.source] = (acc[garden.source] || 0) + 1;
            return acc;
          }, {}),
          sampleNames: gardens.slice(0, 10).map(g => g.name)
        };
        console.log(`✅ Found ${gardens.length} real gardens near ${location.name}`);
      } catch (error) {
        console.log(`❌ Failed to find gardens near ${location.name}:`, error.message);
        results[location.name] = { error: error.message };
      }

      // Rate limiting between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    res.json({
      success: true,
      message: `Comprehensive garden discovery completed - Found ${totalGardens} total gardens`,
      data: results,
      summary: {
        totalGardens: totalGardens,
        locationsSearched: testLocations.length,
        averagePerLocation: Math.round(totalGardens / testLocations.length)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Garden discovery test error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Public: Intensive search for user location
router.get('/search-intensive', async (req, res) => {
  try {
    const GardenDataService = require('../services/GardenDataService');
    const location = req.query.lat && req.query.lng ? {
      lat: parseFloat(req.query.lat),
      lng: parseFloat(req.query.lng)
    } : null;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Location (lat, lng) required for intensive search'
      });
    }

    console.log(`🔍 INTENSIVE search for gardens near ${location.lat}, ${location.lng}`);

    // Multiple searches with different radii
    const searches = [
      { radius: 10, name: 'Local (10 miles)' },
      { radius: 25, name: 'Regional (25 miles)' },
      { radius: 50, name: 'Extended (50 miles)' },
      { radius: 100, name: 'Wide Area (100 miles)' }
    ];

    const allGardens = [];
    const searchResults = {};

    for (const search of searches) {
      console.log(`🔍 Searching ${search.name}...`);
      try {
        const gardens = await GardenDataService.getGardensFromWeb(location, search.radius);

        // Add unique gardens only
        const newGardens = gardens.filter(garden =>
          !allGardens.some(existing =>
            existing.name === garden.name &&
            Math.abs(existing.coordinates.coordinates[0] - garden.coordinates.coordinates[0]) < 0.001
          )
        );

        allGardens.push(...newGardens);

        searchResults[search.name] = {
          radius: search.radius,
          found: gardens.length,
          newUnique: newGardens.length,
          sources: gardens.reduce((acc, garden) => {
            acc[garden.source] = (acc[garden.source] || 0) + 1;
            return acc;
          }, {})
        };

        console.log(`✅ ${search.name}: ${gardens.length} gardens (${newGardens.length} new)`);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`❌ ${search.name} failed:`, error.message);
        searchResults[search.name] = { error: error.message };
      }
    }

    res.json({
      success: true,
      message: `Intensive search completed - Found ${allGardens.length} unique gardens`,
      data: {
        location: location,
        totalUniqueGardens: allGardens.length,
        searchResults: searchResults,
        gardens: allGardens.slice(0, 20), // First 20 for preview
        allSources: allGardens.reduce((acc, garden) => {
          acc[garden.source] = (acc[garden.source] || 0) + 1;
          return acc;
        }, {}),
        sampleNames: allGardens.slice(0, 15).map(g => g.name)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Intensive search error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Public: Debug route to check database
router.get('/debug/count', async (req, res) => {
  try {
    const Garden = require('../models/Garden');
    const count = await Garden.countDocuments();
    const sampleGardens = await Garden.find().limit(3).select('name address coordinates settings');

    res.json({
      success: true,
      data: {
        totalGardens: count,
        sampleGardens: sampleGardens
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Authenticated routes
router.use(requireAuth);

router.get('/my', gardenController.getMyGardens);
router.get('/:gardenId', gardenController.getGarden);
// Any authenticated user can create a garden (they become the owner)
router.post('/', validate(createGardenSchema), gardenController.createGarden);
// Only garden owners/admins can update gardens
router.put('/:gardenId', requireGardenAdmin, validate(updateGardenSchema), gardenController.updateGarden);
router.delete('/:gardenId', requireGardenAdmin, gardenController.deleteGarden);
router.post('/:gardenId/join', gardenController.joinGarden);
router.post('/:gardenId/leave', gardenController.leaveGarden);
router.get('/:gardenId/members', requireGardenMember, gardenController.getGardenMembers);
// Garden owners and admins can manage member roles
router.put('/:gardenId/members/:userId/role', requireGardenAdmin, gardenController.updateMemberRole);
router.post('/:gardenId/members/:userId/manage', requireGardenAdmin, gardenController.manageMembership);
router.get('/:gardenId/stats', requireGardenMember, gardenController.getGardenStats);

module.exports = router;