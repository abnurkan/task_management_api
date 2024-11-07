const mongoose = require('mongoose');
const Task  = require('../models/Task');
const User  = require('../models/User');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth.middleware');
// const {validateTask, ValidateStatus} = require('../middleware/taskValidator');
const validateTask = require('../middleware/taskValidator');


router.post('/tasks', authMiddleware, validateTask, async (req, res) => {
    
    const { title, description, dueDate, priority, assignedTo, tags } = req.body;
    try {
        // Check if assigned user is a registered user.
        const isUser = await User.findOne({ email: assignedTo });
        if (!isUser) {
            return res.status(401).json({
                message: 'Assigned user cannot perform the task',
            });
        }

        // Check if task with the same title already exists.
        const existingTask = await Task.findOne({ title });
        if (existingTask) {
            return res.status(409).json({
                message: 'Task already created!',
            });
        }

        // Get current user from authMiddleware
        const currentUser = req.user._id;
        console.log(currentUser);

        // Create a new task
        const newTask = new Task({
            _id: new mongoose.Types.ObjectId(),
            title,
            description,
            dueDate,
            priority,
            assignedTo:"abba@gmail.com",
            tags,
        });

        // const newTask = new Task({
        //     _id: new mongoose.Types.ObjectId(),
        //     title,
        //     description,
        //     dueDate,
        //     priority,
        //     createdBy: currentUser,
        //     assignedTo:"abba@gmail.com",
        //     tags,
        // });

        const createdTask = await newTask.save();
        return res.status(201).json({
            message: 'Task created successfully',
            task: {
                title: createdTask.title,
                description: createdTask.description,
                dueDate:createdTask.dueDate,
                status: createdTask.status,
                priority: createdTask.priority,                
                assignedTo: createdTask.assignedTo,
                tags: createdTask.tags,
                createdAt: createdTask.createdAt,
                updatedAt: createdTask.updatedAt,

            },
        });

    } catch (error) {
        console.error(error);
        if (!res.headersSent) { // Ensure headers haven't already been sent
            return res.status(500).json({
                message: 'Server failed to create task',
                error: error.message,
            });
        }
    }
});


router.get('/tasks',authMiddleware, async (req,res) =>{
    
    try {
        const task = await Task.find({});

        if(task.length >=1){
            console.log(task);
             // Get pagination parameters from query, with default values
            const page = parseInt(req.query.page) || 1; // Default to page 1
            const limit = parseInt(req.query.limit) || 5; // Default to 10 tasks per page

            // Calculate the starting index for the query
            const skip = (page - 1) * limit;

            // Retrieve tasks from the database with pagination
            const tasks = await Task.find()
                .skip(skip) // Skip documents for pagination
                .limit(limit) // Limit the number of documents returned
                .sort({ createdAt: -1 }); // Sort by creation date, newest first

            // Get the total count of documents to calculate the total pages
            const totalTasks = await Task.countDocuments();
            const totalPages = Math.ceil(totalTasks / limit);

            res.status(200).json({
                Task:tasks.map(task => ({
                    title: task.title,
                    description: task.description,
                    dueDate: task.dueDate,
                    status: task.status,
                    priority: task.priority,
                    createdBy: task.createdBy,
                    assignedTo: task.assignedTo,
                    tags: task.tags,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt
                })),
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalTasks,
                    pageSize: tasks.length,
                }
            });
            // return res.status(200).json({
            //     task             
            // })
        }else{
            return res.status(404).json({
            message:'Task list is empty',            
            })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:'server Failed to fetch task',
            error:error.message,
        })     
    }
});

router.get('/tasks/:id', authMiddleware, async (req,res) =>{
    const id = req.params.id;

    //  Validate the mongoose ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: 'Invalid task ID format.',
        });
    }
    try {
        const task = await Task.findById(id);

        if(task){
            console.log(task);
            return res.status(200).json({
                Task:{
                    title: task.title,
                    description: task.description,
                    dueDate:task.dueDate,
                    status: task.status,
                    priority: task.priority,
                    createdBy: task.createdBy,
                    assignedTo: task.assignedTo,
                    tags: task.tags,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
    
                }             
            })
        }else{
            return res.status(404).json({
            message:'Task list is empty',            
            })
        }

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:'server Failed to fetch task',
            error:error.message,
        })     
    }
});

router.put('/tasks/:id', authMiddleware,validateTask, async (req,res) =>{

    const id = req.params.id;

    //  Validate the mongoose ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: 'Invalid task ID format.',
        });
    }
    try {
        // Validate status
        const allowedStatuses = ['pending', 'in-progress', 'completed'];
        if (req.body.status && !allowedStatuses.includes(req.body.status)) {
            return res.status(400).json({ message: `Status must be one of ${allowedStatuses.join(', ')}.` });
        }

        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if(task){
            
            console.log(task);
            return res.status(200).json({
                message: 'Task updated successfully',
                Task:{
                    title: task.title,
                    description: task.description,
                    dueDate:task.dueDate,
                    status: task.status,
                    priority: task.priority,
                    createdBy: task.createdBy,
                    assignedTo: task.assignedTo,
                    tags: task.tags,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                },            
            })
        }else{
            return res.status(404).json({
            message:'Task not found',            
            })
        }

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:'Failed to update task',
            error:error.message,
        })     
    }
});

router.delete('/tasks/:id', authMiddleware, async (req,res) =>{
    const id = req.params.id;

    //  Validate the mongoose ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: 'Invalid task ID format.',
        });
    }
    try {

        const task = await Task.findByIdAndDelete(req.params.id);

        if(task){
            console.log(task);
            return res.status(200).json({
                message: 'Task deleted successfully',                          
            })
        }else{
            return res.status(404).json({
                message:'Task not found',            
            })
        }

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:'Failed to delete task',
            error:error.message,
        })     
    }
});

module.exports = router;