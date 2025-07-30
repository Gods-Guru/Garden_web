const Task = require('../models/Task');
const Garden = require('../models/Garden');
const User = require('../models/User');
const Plot = require('../models/Plot');
const { catchAsync } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');

// Get tasks (role-based filtering and data)
const getTasks = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;

  // Handle case where gardenId is not provided (get all user tasks)
  if (!gardenId) {
    return getMyTasks(req, res, next);
  }

  const userRole = req.user.getRoleInGarden && req.user.getRoleInGarden(gardenId);

  if (!userRole) {
    return next(new AppError('You are not a member of this garden', 403));
  }

  // Build base query
  let query = { garden: gardenId };

  // Role-based filtering
  if (userRole === 'member') {
    // Members only see:
    // 1. Tasks assigned to them
    // 2. General garden tasks (no specific plot or plot they have access to)
    // 3. Public announcements/general tasks
    query.$or = [
      { 'assignedTo.user': req.user._id },
      { plot: null }, // General garden tasks
      { 
        plot: { 
          $in: await Plot.find({ 
            garden: gardenId, 
            assignedTo: req.user._id 
          }).distinct('_id') 
        } 
      }
    ];
  }
  // Admins see all tasks (no additional filtering)

  // Apply filters from query params
  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.category) {
    query.category = req.query.category;
  }

  if (req.query.priority) {
    query.priority = req.query.priority;
  }

  if (req.query.assignedTo && ['admin', 'owner', 'coordinator'].includes(userRole)) {
    query['assignedTo.user'] = req.query.assignedTo;
  }

  if (req.query.plot) {
    query.plot = req.query.plot;
  }

  // Date filters
  if (req.query.dueBefore) {
    query.dueDate = { $lte: new Date(req.query.dueBefore) };
  }

  if (req.query.dueAfter) {
    query.dueDate = { ...query.dueDate, $gte: new Date(req.query.dueAfter) };
  }

  // Overdue tasks
  if (req.query.overdue === 'true') {
    query.dueDate = { $lt: new Date() };
    query.status = { $nin: ['completed', 'cancelled'] };
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Sorting
  let sort = req.query.sort || '-createdAt';
  if (req.query.sortBy === 'priority') {
    // Custom priority sorting: urgent > high > medium > low
    sort = { 
      priority: { urgent: 4, high: 3, medium: 2, low: 1 },
      dueDate: 1 
    };
  }

  const tasks = await Task.find(query)
    .populate('assignedTo.user', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate('plot', 'plotNumber name assignedTo')
    .populate('completedBy', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Task.countDocuments(query);

  // Filter sensitive data for regular members
  let responseTasks = tasks;
  if (userRole === 'member') {
    responseTasks = tasks.map(task => {
      const taskObj = task.toObject();
      
      // Check if user is assigned to this task
      const isAssigned = task.isAssignedTo(req.user._id);
      
      if (!isAssigned) {
        // Hide sensitive information for non-assigned tasks
        delete taskObj.feedback;
        delete taskObj.weatherConditions;
        // Keep basic info for awareness but hide details
        taskObj.description = taskObj.description.substring(0, 100) + '...';
      }
      
      return taskObj;
    });
  }

  res.status(200).json({
    success: true,
    data: {
      tasks: responseTasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      userRole
    }
  });
});

// Get single task details (role-based access)
const getTask = catchAsync(async (req, res, next) => {
  const { gardenId, taskId } = req.params;
  const userRole = req.user.getRoleInGarden(gardenId);

  if (!userRole) {
    return next(new AppError('You are not a member of this garden', 403));
  }

  const task = await Task.findOne({ _id: taskId, garden: gardenId })
    .populate('assignedTo.user', 'name email avatar phone')
    .populate('createdBy', 'name email avatar')
    .populate('plot', 'plotNumber name assignedTo dimensions')
    .populate('completedBy', 'name email avatar')
    .populate('feedback.user', 'name avatar');

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  // Check access permissions
  const isAssigned = task.isAssignedTo(req.user._id);
  const isCreator = task.createdBy._id.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'owner', 'coordinator'].includes(userRole);

  // Members can only view tasks they're assigned to or general garden tasks
  if (userRole === 'member' && !isAssigned && !isCreator && task.plot) {
    // Check if it's their plot
    const plot = await Plot.findById(task.plot);
    if (!plot || plot.assignedTo.toString() !== req.user._id.toString()) {
      return next(new AppError('Access denied. You can only view your assigned tasks.', 403));
    }
  }

  // Get user's assignment status if assigned
  let userAssignment = null;
  if (isAssigned) {
    userAssignment = task.getAssignmentForUser(req.user._id);
  }

  res.status(200).json({
    success: true,
    data: {
      task,
      userRole,
      isAssigned,
      isCreator,
      userAssignment
    }
  });
});

// Create new task (coordinators and above)
const createTask = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;
  const userRole = req.user.getRoleInGarden(gardenId);

  // Only coordinators and above can create tasks
  if (!['coordinator', 'admin', 'owner'].includes(userRole)) {
    return next(new AppError('Access denied. Only coordinators and admins can create tasks.', 403));
  }

  const taskData = {
    ...req.body,
    garden: gardenId,
    createdBy: req.user._id
  };

  // Validate plot assignment if provided
  if (taskData.plot) {
    const plot = await Plot.findOne({ _id: taskData.plot, garden: gardenId });
    if (!plot) {
      return next(new AppError('Plot not found in this garden', 404));
    }
  }

  // Validate assigned users
  if (taskData.assignedTo && taskData.assignedTo.length > 0) {
    const userIds = taskData.assignedTo.map(assignment => assignment.user);
    const validUsers = await User.find({
      _id: { $in: userIds },
      'gardens.gardenId': gardenId,
      'gardens.status': 'active'
    });

    if (validUsers.length !== userIds.length) {
      return next(new AppError('Some assigned users are not active members of this garden', 400));
    }

    // Format assignments properly
    taskData.assignedTo = taskData.assignedTo.map(assignment => ({
      user: assignment.user,
      assignedAt: new Date(),
      status: 'assigned'
    }));
  }

  const task = await Task.create(taskData);

  // Populate the created task for response
  await task.populate([
    { path: 'assignedTo.user', select: 'name email avatar' },
    { path: 'createdBy', select: 'name email avatar' },
    { path: 'plot', select: 'plotNumber name' }
  ]);

  // Log activity
  await ActivityLogger.logTaskActivity(
    req.user,
    { _id: gardenId },
    task,
    ActivityLogger.ACTIONS.TASK_CREATED,
    {
      taskType: task.type,
      dueDate: task.dueDate,
      priority: task.priority,
      assignedTo: task.assignedTo.map(a => ({
        id: a.user._id,
        name: a.user.name
      }))
    }
  );

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: {
      task
    }
  });
});

// Update task (creator, assigned users, or admins)
const updateTask = catchAsync(async (req, res, next) => {
  const { gardenId, taskId } = req.params;
  const userRole = req.user.getRoleInGarden(gardenId);

  const task = await Task.findOne({ _id: taskId, garden: gardenId });

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  // Check permissions
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isAssigned = task.isAssignedTo(req.user._id);
  const isAdmin = ['admin', 'owner', 'coordinator'].includes(userRole);

  if (!isCreator && !isAdmin && !isAssigned) {
    return next(new AppError('Access denied. You can only update tasks you created or are assigned to.', 403));
  }

  // Restrict what regular members can update
  let updateData = req.body;
  if (userRole === 'member' && isAssigned && !isCreator) {
    // Assigned members can only update their assignment status and add notes
    const allowedFields = ['notes'];
    updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    updateData,
    { new: true, runValidators: true }
  ).populate([
    { path: 'assignedTo.user', select: 'name email avatar' },
    { path: 'createdBy', select: 'name email avatar' },
    { path: 'plot', select: 'plotNumber name' }
  ]);

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: {
      task: updatedTask
    }
  });
});

// Assign task to users (creator or admins)
const assignTask = catchAsync(async (req, res, next) => {
  const { gardenId, taskId } = req.params;
  const { userIds } = req.body; // Array of user IDs
  const userRole = req.user.getRoleInGarden(gardenId);

  const task = await Task.findOne({ _id: taskId, garden: gardenId });

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  // Check permissions
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'owner', 'coordinator'].includes(userRole);

  if (!isCreator && !isAdmin) {
    return next(new AppError('Access denied. Only task creators or admins can assign tasks.', 403));
  }

  // Validate users
  const validUsers = await User.find({
    _id: { $in: userIds },
    'gardens.gardenId': gardenId,
    'gardens.status': 'active'
  });

  if (validUsers.length !== userIds.length) {
    return next(new AppError('Some users are not active members of this garden', 400));
  }

  // Add new assignments (avoid duplicates)
  const newAssignments = userIds
    .filter(userId => !task.isAssignedTo(userId))
    .map(userId => ({
      user: userId,
      assignedAt: new Date(),
      status: 'assigned'
    }));

  task.assignedTo.push(...newAssignments);
  await task.save();

  await task.populate('assignedTo.user', 'name email avatar');

  res.status(200).json({
    success: true,
    message: `Task assigned to ${newAssignments.length} new user(s)`,
    data: {
      task
    }
  });
});

// Accept/decline task assignment (assigned users only)
const respondToAssignment = catchAsync(async (req, res, next) => {
  const { gardenId, taskId } = req.params;
  const { response } = req.body; // 'accepted' or 'declined'

  if (!['accepted', 'declined'].includes(response)) {
    return next(new AppError('Invalid response. Must be "accepted" or "declined"', 400));
  }

  const task = await Task.findOne({ _id: taskId, garden: gardenId });

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  const assignment = task.getAssignmentForUser(req.user._id);

  if (!assignment) {
    return next(new AppError('You are not assigned to this task', 400));
  }

  if (assignment.status !== 'assigned') {
    return next(new AppError('You have already responded to this assignment', 400));
  }

  assignment.status = response;
  await task.save();

  res.status(200).json({
    success: true,
    message: `Task assignment ${response}`,
    data: {
      assignment
    }
  });
});

// Mark task as completed (assigned users only)
const completeTask = catchAsync(async (req, res, next) => {
  const { gardenId, taskId } = req.params;
  const { completionNotes, actualDuration, images } = req.body;

  const task = await Task.findOne({ _id: taskId, garden: gardenId });

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  // Check if user is assigned to this task
  if (!task.isAssignedTo(req.user._id)) {
    return next(new AppError('You are not assigned to this task', 403));
  }

  // Check if task is already completed
  if (task.status === 'completed') {
    return next(new AppError('Task is already completed', 400));
  }

  // Mark task as completed
  task.markCompleted(req.user._id, completionNotes, actualDuration);

  // Add completion images if provided
  if (images && images.length > 0) {
    task.completionImages.push(...images.map(img => ({
      ...img,
      uploadedBy: req.user._id
    })));
  }

  await task.save();

  await task.populate([
    { path: 'completedBy', select: 'name email avatar' },
    { path: 'assignedTo.user', select: 'name email avatar' }
  ]);

  // Log activity
  await ActivityLogger.logTaskActivity(
    req.user,
    { _id: task.garden },
    task,
    ActivityLogger.ACTIONS.TASK_COMPLETED,
    {
      completedAt: new Date(),
      completionNotes,
      actualDuration,
      images: images?.length || 0
    }
  );

  res.status(200).json({
    success: true,
    message: 'Task marked as completed',
    data: {
      task
    }
  });
});

// Add feedback to completed task
const addTaskFeedback = catchAsync(async (req, res, next) => {
  const { gardenId, taskId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return next(new AppError('Rating must be between 1 and 5', 400));
  }

  const task = await Task.findOne({ _id: taskId, garden: gardenId });

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  if (task.status !== 'completed') {
    return next(new AppError('Can only provide feedback for completed tasks', 400));
  }

  // Check if user already provided feedback
  const existingFeedback = task.feedback.find(
    f => f.user.toString() === req.user._id.toString()
  );

  if (existingFeedback) {
    return next(new AppError('You have already provided feedback for this task', 400));
  }

  task.feedback.push({
    user: req.user._id,
    rating,
    comment
  });

  await task.save();

  res.status(200).json({
    success: true,
    message: 'Feedback added successfully',
    data: {
      feedback: task.feedback[task.feedback.length - 1]
    }
  });
});

// Get my tasks (user's assigned tasks across all gardens)
const getMyTasks = catchAsync(async (req, res, next) => {
  const { status, priority, overdue } = req.query;

  let query = { 'assignedTo.user': req.user._id };

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by priority
  if (priority) {
    query.priority = priority;
  }

  // Filter overdue tasks
  if (overdue === 'true') {
    query.dueDate = { $lt: new Date() };
    query.status = { $nin: ['completed', 'cancelled'] };
  }

  const tasks = await Task.find(query)
    .populate('garden', 'name address')
    .populate('plot', 'plotNumber name')
    .populate('createdBy', 'name email')
    .sort('dueDate')
    .limit(50); // Reasonable limit for personal tasks

  // Add user's assignment status to each task
  const tasksWithStatus = tasks.map(task => {
    const taskObj = task.toObject();
    taskObj.myAssignment = task.getAssignmentForUser(req.user._id);
    return taskObj;
  });

  res.status(200).json({
    success: true,
    data: {
      tasks: tasksWithStatus
    }
  });
});

// Get task statistics (admin only)
const getTaskStats = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;

  // Aggregate task statistics
  const stats = await Task.aggregate([
    { $match: { garden: gardenId } },
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        pendingTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        inProgressTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
        },
        completedTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        overdueTasks: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $lt: ['$dueDate', new Date()] },
                  { $nin: ['$status', ['completed', 'cancelled']] }
                ]
              },
              1,
              0
            ]
          }
        },
        avgCompletionTime: {
          $avg: {
            $cond: [
              { $ne: ['$actualDuration', null] },
              '$actualDuration',
              '$estimatedDuration'
            ]
          }
        }
      }
    }
  ]);

  // Get task distribution by category
  const categoryStats = await Task.aggregate([
    { $match: { garden: gardenId } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    }
  ]);

  // Get task distribution by priority
  const priorityStats = await Task.aggregate([
    { $match: { garden: gardenId } },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  const taskStats = stats[0] || {
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    avgCompletionTime: 0
  };

  // Calculate completion rate
  taskStats.completionRate = taskStats.totalTasks > 0
    ? Math.round((taskStats.completedTasks / taskStats.totalTasks) * 100)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      overview: taskStats,
      byCategory: categoryStats,
      byPriority: priorityStats
    }
  });
});

// Delete task (creator or admin only)
const deleteTask = catchAsync(async (req, res, next) => {
  const { gardenId, taskId } = req.params;
  const userRole = req.user.getRoleInGarden(gardenId);

  const task = await Task.findOne({ _id: taskId, garden: gardenId });

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  // Check permissions
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'owner'].includes(userRole);

  if (!isCreator && !isAdmin) {
    return next(new AppError('Access denied. Only task creators or admins can delete tasks.', 403));
  }

  // Don't allow deletion of completed tasks with feedback
  if (task.status === 'completed' && task.feedback.length > 0) {
    return next(new AppError('Cannot delete completed tasks with feedback. Archive instead.', 400));
  }

  await Task.findByIdAndDelete(taskId);

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully'
  });
});

// Bulk task operations (admin only)
const bulkTaskOperations = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;
  const { operation, taskIds, data } = req.body;

  if (!['assign', 'update_status', 'delete'].includes(operation)) {
    return next(new AppError('Invalid bulk operation', 400));
  }

  const tasks = await Task.find({
    _id: { $in: taskIds },
    garden: gardenId
  });

  if (tasks.length !== taskIds.length) {
    return next(new AppError('Some tasks not found', 404));
  }

  let result = {};

  switch (operation) {
    case 'assign':
      if (!data.userIds || !Array.isArray(data.userIds)) {
        return next(new AppError('userIds array is required for assign operation', 400));
      }

      // Validate users
      const validUsers = await User.find({
        _id: { $in: data.userIds },
        'gardens.gardenId': gardenId,
        'gardens.status': 'active'
      });

      if (validUsers.length !== data.userIds.length) {
        return next(new AppError('Some users are not active members', 400));
      }

      // Assign to all tasks
      await Task.updateMany(
        { _id: { $in: taskIds } },
        {
          $addToSet: {
            assignedTo: {
              $each: data.userIds.map(userId => ({
                user: userId,
                assignedAt: new Date(),
                status: 'assigned'
              }))
            }
          }
        }
      );

      result = { message: `Assigned ${data.userIds.length} users to ${taskIds.length} tasks` };
      break;

    case 'update_status':
      if (!data.status) {
        return next(new AppError('Status is required for update_status operation', 400));
      }

      await Task.updateMany(
        { _id: { $in: taskIds } },
        { status: data.status }
      );

      result = { message: `Updated status to ${data.status} for ${taskIds.length} tasks` };
      break;

    case 'delete':
      await Task.deleteMany({ _id: { $in: taskIds } });
      result = { message: `Deleted ${taskIds.length} tasks` };
      break;
  }

  res.status(200).json({
    success: true,
    data: result
  });
});

/**
 * Accept a task
 */
const acceptTask = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const task = await Task.findById(id);
  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  // Check if task is available
  if (task.status !== 'pending') {
    return next(new AppError('Task is not available for acceptance', 400));
  }

  // Check if user is already assigned
  if (task.isAssignedTo(userId)) {
    return next(new AppError('You are already assigned to this task', 400));
  }

  // Assign task to user
  task.assignedTo.push({
    user: userId,
    assignedAt: new Date(),
    status: 'accepted'
  });
  task.status = 'in-progress';

  await task.save();

  res.status(200).json({
    success: true,
    message: 'Task accepted successfully',
    data: { task }
  });
});

/**
 * Volunteer for a task
 */
const volunteerForTask = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const task = await Task.findById(id);
  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  // Check if user already volunteered
  const alreadyVolunteered = task.volunteers && task.volunteers.some(v => v.user.toString() === userId.toString());
  if (alreadyVolunteered) {
    return next(new AppError('You have already volunteered for this task', 400));
  }

  // Add user to volunteers
  if (!task.volunteers) task.volunteers = [];
  task.volunteers.push({
    user: userId,
    volunteeredAt: new Date()
  });

  await task.save();

  res.status(200).json({
    success: true,
    message: 'Successfully volunteered for task',
    data: { task }
  });
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  assignTask,
  respondToAssignment,
  completeTask,
  addTaskFeedback,
  getMyTasks,
  getTaskStats,
  deleteTask,
  bulkTaskOperations,
  acceptTask,
  volunteerForTask
};