const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/complaints/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'complaint-' + uniqueSuffix + path.extname(file.originalname));
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

// Sample complaints data (in production, this would come from database)
let complaints = [
  {
    _id: '1',
    userId: 'user1',
    issueType: 'facility',
    subject: 'Broken water spigot',
    description: 'The water spigot in section B is not working properly',
    priority: 'medium',
    status: 'open',
    photo: null,
    createdAt: '2024-01-15T10:30:00Z',
    assignedTo: null,
    resolvedAt: null,
    resolvedBy: null
  }
];

// Submit new complaint
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const { issueType, subject, description, priority } = req.body;

    // Validate required fields
    if (!issueType || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Issue type, subject, and description are required'
      });
    }

    const newComplaint = {
      _id: Date.now().toString(),
      userId: req.user.id,
      issueType,
      subject,
      description,
      priority: priority || 'medium',
      status: 'open',
      photo: req.file ? `/uploads/complaints/${req.file.filename}` : null,
      createdAt: new Date().toISOString(),
      assignedTo: null,
      resolvedAt: null,
      resolvedBy: null
    };

    complaints.push(newComplaint);

    // In production, you would also:
    // 1. Notify relevant managers/admins
    // 2. Send confirmation email to user
    // 3. Create activity log entry

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully. We will review it shortly.',
      complaint: newComplaint
    });

  } catch (error) {
    console.error('Submit complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit complaint'
    });
  }
});

// Get user's complaints
router.get('/my', auth, async (req, res) => {
  try {
    const userComplaints = complaints
      .filter(complaint => complaint.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      complaints: userComplaints
    });

  } catch (error) {
    console.error('Get user complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints'
    });
  }
});

// Admin/Manager: Get all complaints
router.get('/', auth, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const { status, priority, issueType } = req.query;
    
    let filteredComplaints = complaints;
    
    if (status && status !== 'all') {
      filteredComplaints = filteredComplaints.filter(c => c.status === status);
    }
    
    if (priority && priority !== 'all') {
      filteredComplaints = filteredComplaints.filter(c => c.priority === priority);
    }
    
    if (issueType && issueType !== 'all') {
      filteredComplaints = filteredComplaints.filter(c => c.issueType === issueType);
    }

    filteredComplaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      complaints: filteredComplaints
    });

  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints'
    });
  }
});

// Admin/Manager: Update complaint status
router.patch('/:id/status', auth, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolution } = req.body;

    const complaintIndex = complaints.findIndex(c => c._id === id);
    if (complaintIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    const complaint = complaints[complaintIndex];
    
    complaints[complaintIndex] = {
      ...complaint,
      status: status || complaint.status,
      resolution: resolution || complaint.resolution,
      resolvedAt: status === 'resolved' ? new Date().toISOString() : complaint.resolvedAt,
      resolvedBy: status === 'resolved' ? req.user.id : complaint.resolvedBy,
      updatedAt: new Date().toISOString()
    };

    // In production, you would also notify the user about the status change

    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      complaint: complaints[complaintIndex]
    });

  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint status'
    });
  }
});

// Admin/Manager: Assign complaint
router.patch('/:id/assign', auth, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const complaintIndex = complaints.findIndex(c => c._id === id);
    if (complaintIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaints[complaintIndex] = {
      ...complaints[complaintIndex],
      assignedTo,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'Complaint assigned successfully',
      complaint: complaints[complaintIndex]
    });

  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign complaint'
    });
  }
});

module.exports = router;
