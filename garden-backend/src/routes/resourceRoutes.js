const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Sample resources data (in production, this would come from database)
const sampleResources = [
  {
    _id: '1',
    title: 'Complete Guide to Soil Preparation',
    description: 'Learn how to prepare and maintain healthy soil for optimal plant growth.',
    category: 'Soil & Composting',
    type: 'PDF',
    downloadUrl: '/resources/soil-guide.pdf',
    downloadCount: 245,
    createdAt: '2024-01-15'
  },
  {
    _id: '2',
    title: 'Organic Pest Control Methods',
    description: 'Natural and effective ways to protect your plants from common pests.',
    category: 'Pest Management',
    type: 'PDF',
    downloadUrl: '/resources/pest-control.pdf',
    downloadCount: 189,
    createdAt: '2024-01-20'
  },
  {
    _id: '3',
    title: 'Seasonal Planting Calendar',
    description: 'Know exactly when to plant different crops throughout the year.',
    category: 'Seasonal Gardening',
    type: 'PDF',
    downloadUrl: '/resources/planting-calendar.pdf',
    downloadCount: 312,
    createdAt: '2024-02-01'
  },
  {
    _id: '4',
    title: 'Composting 101 Video Series',
    description: 'Step-by-step video guide to creating nutrient-rich compost.',
    category: 'Soil & Composting',
    type: 'Video',
    downloadUrl: 'https://youtube.com/watch?v=example',
    downloadCount: 156,
    createdAt: '2024-02-10'
  },
  {
    _id: '5',
    title: 'Garden Tool Maintenance Guide',
    description: 'Keep your gardening tools in perfect condition with proper care.',
    category: 'Tools & Equipment',
    type: 'PDF',
    downloadUrl: '/resources/tool-maintenance.pdf',
    downloadCount: 98,
    createdAt: '2024-02-15'
  }
];

// Get all resources
router.get('/all', auth, async (req, res) => {
  try {
    const { category } = req.query;
    
    let resources = sampleResources;
    
    if (category && category !== 'all') {
      resources = resources.filter(resource => resource.category === category);
    }

    res.status(200).json({
      success: true,
      resources: resources
    });

  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources'
    });
  }
});

// Track resource download
router.post('/:id/download', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // In production, you would:
    // 1. Find the resource in database
    // 2. Increment download count
    // 3. Log the download activity
    
    const resource = sampleResources.find(r => r._id === id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Simulate incrementing download count
    resource.downloadCount += 1;

    res.status(200).json({
      success: true,
      message: 'Download tracked successfully'
    });

  } catch (error) {
    console.error('Track download error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track download'
    });
  }
});

// Admin: Upload new resource
router.post('/upload', auth, authorize(['admin']), async (req, res) => {
  try {
    const { title, description, category, type, downloadUrl } = req.body;

    // Validate required fields
    if (!title || !description || !category || !type || !downloadUrl) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // In production, you would save to database
    const newResource = {
      _id: Date.now().toString(),
      title,
      description,
      category,
      type,
      downloadUrl,
      downloadCount: 0,
      createdAt: new Date().toISOString()
    };

    sampleResources.push(newResource);

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully',
      resource: newResource
    });

  } catch (error) {
    console.error('Upload resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resource'
    });
  }
});

// Admin: Get resource download stats
router.get('/stats', auth, authorize(['admin']), async (req, res) => {
  try {
    const stats = sampleResources.map(resource => ({
      _id: resource._id,
      title: resource.title,
      category: resource.category,
      downloadCount: resource.downloadCount,
      createdAt: resource.createdAt
    }));

    res.status(200).json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('Get resource stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resource stats'
    });
  }
});

module.exports = router;
