const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { requireAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authorize } = require('../middleware/authorize');
const { createTaskSchema, updateTaskSchema } = require('../validation/taskSchemas');

router.use(requireAuth);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
// Only admin or manager can create or update a task
router.post('/', authorize('admin', 'manager'), validate(createTaskSchema), taskController.createTask);
router.put('/:id', authorize('admin', 'manager'), validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', authorize('admin', 'manager'), taskController.deleteTask);

// User task routes
router.get('/my-tasks', taskController.getMyTasks);

// Task action routes
router.patch('/:id/accept', taskController.acceptTask);
router.patch('/:id/complete', taskController.completeTask);
router.post('/:id/volunteer', taskController.volunteerForTask);

// Advanced, role-aware task routes
router.get('/my', taskController.getMyTasks);
router.get('/stats/:gardenId', taskController.getTaskStats);
router.get('/garden/:gardenId', taskController.getTasks);
router.get('/garden/:gardenId/:taskId', taskController.getTask);
router.post('/garden/:gardenId', authorize('admin', 'manager'), validate(createTaskSchema), taskController.createTask);
router.put('/garden/:gardenId/:taskId', authorize('admin', 'manager'), validate(updateTaskSchema), taskController.updateTask);
router.delete('/garden/:gardenId/:taskId', authorize('admin', 'manager'), taskController.deleteTask);
router.post('/garden/:gardenId/:taskId/assign', taskController.assignTask);
router.post('/garden/:gardenId/:taskId/respond', taskController.respondToAssignment);
router.post('/garden/:gardenId/:taskId/complete', taskController.completeTask);
router.post('/garden/:gardenId/:taskId/feedback', taskController.addTaskFeedback);

module.exports = router;
