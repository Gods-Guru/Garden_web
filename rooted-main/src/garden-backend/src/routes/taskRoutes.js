const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// Use correct exported function names from taskController.js
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Advanced, role-aware task routes
router.get('/my', taskController.getMyTasks);
router.get('/stats/:gardenId', taskController.getTaskStats);
router.get('/garden/:gardenId', taskController.getTasks);
router.get('/garden/:gardenId/:taskId', taskController.getTask);
router.post('/garden/:gardenId', taskController.createTask);
router.put('/garden/:gardenId/:taskId', taskController.updateTask);
router.delete('/garden/:gardenId/:taskId', taskController.deleteTask);
router.post('/garden/:gardenId/:taskId/assign', taskController.assignTask);
router.post('/garden/:gardenId/:taskId/respond', taskController.respondToAssignment);
router.post('/garden/:gardenId/:taskId/complete', taskController.completeTask);
router.post('/garden/:gardenId/:taskId/feedback', taskController.addTaskFeedback);

module.exports = router;
