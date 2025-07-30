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

/**
 * Get admin statistics for dashboard
 */
const getAdminStats = async (req, res) => {
  try {
    // Verify admin access
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    // Get comprehensive statistics
    const totalUsers = await User.countDocuments();
    const totalGardens = await Garden.countDocuments();
    const totalPlots = await Plot.countDocuments();
    const tasksCreated = await Task.countDocuments();

    // Get new registrations this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newRegistrations = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Calculate revenue (placeholder - implement based on your payment system)
    const revenue = 0; // TODO: Implement revenue calculation

    const stats = {
      totalUsers,
      totalGardens,
      totalPlots,
      revenue,
      tasksCreated,
      newRegistrations
    };

    res.json({ success: true, ...stats });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics',
      error: error.message
    });
  }
};

/**
 * Get admin activity feed
 */
const getAdminActivity = async (req, res) => {
  try {
    // Verify admin access
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const limit = parseInt(req.query.limit) || 10;

    // Get recent system activity
    const activities = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('userId', 'name email');

    // Format activities for frontend
    const formattedActivities = activities.map(activity => ({
      id: activity._id,
      type: activity.action,
      message: activity.description || `${activity.action} by ${activity.userId?.name || 'Unknown User'}`,
      time: getTimeAgo(activity.timestamp),
      timestamp: activity.timestamp
    }));

    res.json({ success: true, activities: formattedActivities });

  } catch (error) {
    console.error('Admin activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin activity',
      error: error.message
    });
  }
};

/**
 * Get manager statistics
 */
const getManagerStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Get gardens managed by this user
    const managedGardens = await Garden.find({
      $or: [
        { owner: userId },
        { 'members.user': userId, 'members.role': { $in: ['coordinator', 'manager'] } }
      ]
    });

    const gardenIds = managedGardens.map(g => g._id);

    // Get statistics for managed gardens
    const totalPlots = await Plot.countDocuments({ garden: { $in: gardenIds } });
    const allocatedPlots = await Plot.countDocuments({
      garden: { $in: gardenIds },
      assignedTo: { $exists: true }
    });

    const totalTasks = await Task.countDocuments({ garden: { $in: gardenIds } });
    const completedTasks = await Task.countDocuments({
      garden: { $in: gardenIds },
      status: 'completed'
    });

    const eventsManaged = await Event.countDocuments({ garden: { $in: gardenIds } });

    // Count volunteers in managed gardens
    const volunteerCount = await User.countDocuments({
      'gardens.gardenId': { $in: gardenIds },
      'gardens.role': 'member'
    });

    // Count pending requests (placeholder)
    const pendingRequests = 0; // TODO: Implement based on your request system

    const stats = {
      gardensManaged: managedGardens.length,
      plotsAllocated: totalPlots > 0 ? Math.round((allocatedPlots / totalPlots) * 100) : 0,
      taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      eventsManaged,
      volunteerCount,
      pendingRequests
    };

    res.json({ success: true, ...stats });

  } catch (error) {
    console.error('Manager stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch manager statistics',
      error: error.message
    });
  }
};

/**
 * Get manager activity feed
 */
const getManagerActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    // Get activities related to user's managed gardens
    const managedGardens = await Garden.find({
      $or: [
        { owner: userId },
        { 'members.user': userId, 'members.role': { $in: ['coordinator', 'manager'] } }
      ]
    });

    const gardenIds = managedGardens.map(g => g._id);

    // Get recent activities
    const activities = await AuditLog.find({
      $or: [
        { userId: userId },
        { 'metadata.gardenId': { $in: gardenIds } }
      ]
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('userId', 'name email');

    // Format activities for frontend
    const formattedActivities = activities.map(activity => ({
      id: activity._id,
      type: activity.action,
      message: activity.description || `${activity.action} by ${activity.userId?.name || 'Unknown User'}`,
      time: getTimeAgo(activity.timestamp),
      timestamp: activity.timestamp
    }));

    res.json({ success: true, activities: formattedActivities });

  } catch (error) {
    console.error('Manager activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch manager activity',
      error: error.message
    });
  }
};

/**
 * Get gardener statistics
 */
const getGardenerStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's plots
    const myPlots = await Plot.countDocuments({ assignedTo: userId });

    // Get current crops (placeholder - implement based on your crop tracking system)
    const currentCrops = 0; // TODO: Implement crop counting

    // Get assigned tasks
    const tasksAssigned = await Task.countDocuments({
      'assignedTo.user': userId,
      status: { $in: ['pending', 'in-progress'] }
    });

    // Calculate plot health score (placeholder)
    const plotHealthScore = 85; // TODO: Implement health score calculation

    // Get upcoming events
    const user = await User.findById(userId);
    const gardenIds = user.gardens.map(g => g.gardenId);

    const upcomingEvents = await Event.countDocuments({
      garden: { $in: gardenIds },
      startDate: { $gte: new Date() }
    });

    // Get harvest ready crops (placeholder)
    const harvestReady = 0; // TODO: Implement harvest tracking

    const stats = {
      myPlots,
      currentCrops,
      tasksAssigned,
      plotHealthScore,
      upcomingEvents,
      harvestReady
    };

    res.json({ success: true, ...stats });

  } catch (error) {
    console.error('Gardener stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gardener statistics',
      error: error.message
    });
  }
};

/**
 * Get volunteer statistics
 */
const getVolunteerStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get events registered (placeholder)
    const eventsRegistered = 0; // TODO: Implement event registration tracking

    // Get tasks completed
    const tasksCompleted = await Task.countDocuments({
      'assignedTo.user': userId,
      status: 'completed'
    });

    // Get hours volunteered (placeholder)
    const hoursVolunteered = 0; // TODO: Implement hour tracking

    // Get badges earned (placeholder)
    const badgesEarned = 0; // TODO: Implement badge system

    // Get upcoming events
    const user = await User.findById(userId);
    const gardenIds = user.gardens.map(g => g.gardenId);

    const upcomingEvents = await Event.countDocuments({
      garden: { $in: gardenIds },
      startDate: { $gte: new Date() }
    });

    // Get current level (placeholder)
    const currentLevel = 'Bronze'; // TODO: Implement level system

    const stats = {
      eventsRegistered,
      tasksCompleted,
      hoursVolunteered,
      badgesEarned,
      upcomingEvents,
      currentLevel
    };

    res.json({ success: true, ...stats });

  } catch (error) {
    console.error('Volunteer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch volunteer statistics',
      error: error.message
    });
  }
};

/**
 * Helper function to format time ago
 */
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
};

module.exports = {
  getDashboardData,
  getGardenDashboard,
  getAdminDashboard,
  getAdminStats,
  getAdminActivity,
  getManagerStats,
  getManagerActivity,
  getGardenerStats,
  getVolunteerStats
};
