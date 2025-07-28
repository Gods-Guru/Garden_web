const User = require('../models/User');
const Garden = require('../models/Garden');
const Task = require('../models/Task');
const Event = require('../models/Event');
const Plot = require('../models/Plot');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

/**
 * Get comprehensive dashboard data for authenticated user
 */
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('gardens.gardenId');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get user's gardens
    const userGardens = await Garden.find({
      _id: { $in: user.gardens.map(g => g.gardenId) }
    }).populate('owner', 'name email');

    // Get user's tasks
    const tasks = await Task.find({
      'assignedTo.user': userId,
      status: { $in: ['pending', 'in-progress'] }
    })
    .populate('garden', 'name')
    .populate('plot', 'name')
    .sort({ dueDate: 1 })
    .limit(10);

    // Get upcoming events
    const upcomingEvents = await Event.find({
      garden: { $in: user.gardens.map(g => g.gardenId) },
      startDate: { $gte: new Date() }
    })
    .populate('garden', 'name')
    .sort({ startDate: 1 })
    .limit(5);

    // Get user's plots
    const plots = await Plot.find({
      assignedTo: userId
    }).populate('garden', 'name');

    // Get recent notifications
    const notifications = await Notification.find({
      recipient: userId,
      read: false
    })
    .sort({ createdAt: -1 })
    .limit(5);

    // Calculate statistics
    const stats = {
      totalGardens: userGardens.length,
      totalPlots: plots.length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
      inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
      upcomingEvents: upcomingEvents.length,
      unreadNotifications: notifications.length
    };

    // Get recent activity
    const recentActivity = await AuditLog.find({
      userId: userId
    })
    .sort({ timestamp: -1 })
    .limit(10);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          lastActive: user.lastActive
        },
        gardens: userGardens,
        tasks,
        events: upcomingEvents,
        plots,
        notifications,
        stats,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

/**
 * Get garden-specific dashboard data
 */
const getGardenDashboard = async (req, res) => {
  try {
    const { gardenId } = req.params;
    const userId = req.user.id;

    // Verify user has access to this garden
    const user = await User.findById(userId);
    const userGarden = user.gardens.find(g => g.gardenId.toString() === gardenId);
    
    if (!userGarden) {
      return res.status(403).json({ success: false, message: 'Access denied to this garden' });
    }

    const garden = await Garden.findById(gardenId)
      .populate('owner', 'name email')
      .populate('members.user', 'name email profilePicture');

    if (!garden) {
      return res.status(404).json({ success: false, message: 'Garden not found' });
    }

    // Get garden tasks
    const tasks = await Task.find({ garden: gardenId })
      .populate('assignedTo.user', 'name email')
      .populate('plot', 'name')
      .sort({ createdAt: -1 });

    // Get garden events
    const events = await Event.find({ garden: gardenId })
      .sort({ startDate: 1 });

    // Get garden plots
    const plots = await Plot.find({ garden: gardenId })
      .populate('assignedTo', 'name email');

    // Calculate garden statistics
    const stats = {
      totalMembers: garden.members.length,
      totalPlots: plots.length,
      availablePlots: plots.filter(p => !p.assignedTo).length,
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      upcomingEvents: events.filter(e => e.startDate >= new Date()).length
    };

    res.json({
      success: true,
      data: {
        garden,
        tasks,
        events,
        plots,
        stats,
        userRole: userGarden.role
      }
    });

  } catch (error) {
    console.error('Garden dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch garden dashboard data',
      error: error.message
    });
  }
};

/**
 * Get admin dashboard data
 */
const getAdminDashboard = async (req, res) => {
  try {
    // Verify admin access
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    // Get system-wide statistics
    const totalUsers = await User.countDocuments();
    const totalGardens = await Garden.countDocuments();
    const totalTasks = await Task.countDocuments();
    const totalEvents = await Event.countDocuments();

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role createdAt lastActive');

    // Get recent gardens
    const recentGardens = await Garden.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('owner', 'name email');

    // Get system activity
    const recentActivity = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('userId', 'name email');

    // Get pending applications
    const pendingApplications = await User.find({
      'gardens.status': 'pending'
    }).populate('gardens.gardenId', 'name');

    const stats = {
      totalUsers,
      totalGardens,
      totalTasks,
      totalEvents,
      activeUsers: await User.countDocuments({ 
        lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      }),
      pendingApplications: pendingApplications.length
    };

    res.json({
      success: true,
      data: {
        stats,
        recentUsers,
        recentGardens,
        recentActivity,
        pendingApplications
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard data',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardData,
  getGardenDashboard,
  getAdminDashboard
};
