const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
// const {validateTask, ValidateStatus} = require('../middleware/taskValidator');
const validateTask = require('../utils/taskValidator');
const taskControllers = require('../controllers/task.controller');

router.post('/tasks', authMiddleware, validateTask, taskControllers.createTask);


router.get('/tasks',authMiddleware,taskControllers.getTask );

router.get('/tasks/:id', authMiddleware,taskControllers.getTaskById);

router.put('/tasks/:id', authMiddleware,validateTask, taskControllers.updateTask);

router.delete('/tasks/:id', authMiddleware, taskControllers.deleteTask);

module.exports = router;