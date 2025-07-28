const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

class ActivityLogger {
  static async log(data) {
    const { user, action, targetType, targetId, garden, details } = data;
    
    try {
      const logEntry = await AuditLog.create({
        user: user._id,
        action,
        targetType,
        targetId,
        garden: garden?._id,
        details,
        timestamp: new Date()
      });

      // Log to file system for backup
      logger.info('Activity logged', {
        userId: user._id,
        action,
        targetType,
        targetId,
        gardenId: garden?._id,
        details
      });

      return logEntry;
    } catch (error) {
      logger.error('Failed to log activity', {
        error: error.message,
        data
      });
      throw error;
    }
  }

  // Helper methods for common activities
  static async logPlotActivity(user, garden, plot, action, details = {}) {
    return this.log({
      user,
      action,
      targetType: 'plot',
      targetId: plot._id,
      garden,
      details: {
        plotName: plot.name,
        plotNumber: plot.plotNumber,
        ...details
      }
    });
  }

  static async logTaskActivity(user, garden, task, action, details = {}) {
    return this.log({
      user,
      action,
      targetType: 'task',
      targetId: task._id,
      garden,
      details: {
        taskTitle: task.title,
        taskStatus: task.status,
        ...details
      }
    });
  }

  static async logGardenActivity(user, garden, action, details = {}) {
    return this.log({
      user,
      action,
      targetType: 'garden',
      targetId: garden._id,
      garden,
      details
    });
  }

  static async logUserActivity(user, targetUser, action, garden = null, details = {}) {
    return this.log({
      user,
      action,
      targetType: 'user',
      targetId: targetUser._id,
      garden,
      details: {
        targetUserName: targetUser.name,
        targetUserEmail: targetUser.email,
        ...details
      }
    });
  }
}

// Action types constants
ActivityLogger.ACTIONS = {
  // Plot actions
  PLOT_CREATED: 'plot_created',
  PLOT_ASSIGNED: 'plot_assigned',
  PLOT_UNASSIGNED: 'plot_unassigned',
  PLOT_STATUS_CHANGED: 'plot_status_changed',

  // Task actions
  TASK_CREATED: 'task_created',
  TASK_ASSIGNED: 'task_assigned',
  TASK_COMPLETED: 'task_completed',
  TASK_STATUS_CHANGED: 'task_status_changed',

  // Garden actions
  GARDEN_CREATED: 'garden_created',
  GARDEN_UPDATED: 'garden_updated',
  GARDEN_JOINED: 'garden_joined',
  GARDEN_LEFT: 'garden_left',

  // User actions
  USER_JOINED: 'user_joined',
  USER_ROLE_CHANGED: 'user_role_changed',
  USER_PROFILE_UPDATED: 'user_profile_updated'
};

module.exports = ActivityLogger;
