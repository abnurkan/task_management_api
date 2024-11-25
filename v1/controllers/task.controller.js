const mongoose = require('mongoose');
const Task  = require('../models/Task');
const User  = require('../models/User');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const sendEmail = require('../utils/sendEmail'); // Import the sendEmail function

let currentUser;
exports.createTask = async (req, res) => {
    
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
        currentUser = req.user._id;
        console.log(`current User ${currentUser}`);

        // Create a new task
       

        const newTask = new Task({
            _id: new mongoose.Types.ObjectId(),
            title,
            description,
            dueDate,
            priority,
            createdBy: currentUser,
            assignedTo,
            tags,
        });

        const createdTask = await newTask.save();
        return res.status(201).json({
            message: 'Task created successfully',
            task: {
                _id: createdTask._id,    //I include it for manual testing 
                title: createdTask.title,
                description: createdTask.description,
                dueDate:createdTask.dueDate,
                status: createdTask.status,
                priority: createdTask.priority,                
                assignedTo: createdTask.assignedTo,
                tags: createdTask.tags,
                createdBy:createdTask.createdBy,
                createdAt: createdTask.createdAt,
                updatedAt: createdTask.updatedAt,

            },
        });

    } catch (error) {
        console.error("Error in createTask controller:", error); // Log full error details
        return res.status(500).json({
            message: 'Server failed to create task',
            error: error.message,
        });
    }
}


exports.getTask = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 5; // Default to 5 tasks per page
        const status = req.query.status || 'pending';
        const priority = req.query.priority || 'low';

        const taskcachedKey = `tasks:page=${page}&limit=${limit}&status=${status}&priority=${priority}`;

        // Check cache
        const cachedTask = await redisClient.get(taskcachedKey);
        if (cachedTask) {
            const parsedTask = JSON.parse(cachedTask);
            return res.status(200).json(parsedTask);
        }

        // Build query
        const query = {};
        if (req.query.status) query.status = req.query.status;
        if (req.query.priority) query.priority = req.query.priority;
        query.createdBy = currentUser;

        const skip = (page - 1) * limit;

        const tasks = await Task.find(query) //update this query to fetch task specific to current user 
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalTasks = await Task.countDocuments(query);
        const totalPages = Math.ceil(totalTasks / limit);

        const response = {
            Task: tasks.map(task => ({
                id: task._id,
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
                pageSize: tasks.length
            }
        };

        // Cache the response
        await redisClient.setEx(taskcachedKey, 3600, JSON.stringify(response));

        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Failed to fetch tasks',
            error: error.message
        });
    }
}



exports.getTaskById = async (req,res) =>{
    const id = req.params.id;

    //  Validate the mongoose ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: 'Invalid task ID format.',
        });
    }
    try {
        // const task = await Task.findById(id);
        const  task = await Task.findOne({
            _id: `${id}`,
            createdBy: `${currentUser}`
          });

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
            message:'Task does not exist empty',            
            })
        }

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:'server Failed to fetch task',
            error:error.message,
        })     
    }
}

exports.updateTask = async (req,res) =>{

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

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, createdBy: currentUser }, // Match task by ID and owner
            req.body, // Update data
            { new: true } // Return the updated document
          );
          
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
            message:'Task not found or not authorized to update',            
            })
        }

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:'Failed to update task',
            error:error.message,
        })     
    }
}

exports.deleteTask = async (req,res) =>{
    const id = req.params.id;

    //  Validate the mongoose ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: 'Invalid task ID format.',
        });
    }
    try {

        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: currentUser });


        if(task){
            console.log(task);
            return res.status(200).json({
                message: 'Task deleted successfully',                          
            })
        }else{
            return res.status(404).json({
                message:'Task not found or not authorized to delete',            
            })
        }

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:'Failed to delete task',
            error:error.message,
        })     
    }
}


exports.shareTask = async (req, res) => {

    const { taskId, emails } = req.body; // taskId and emails are sent in the request body
    
    // Ensure emails is an array
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: 'Please provide a valid list of emails.' });
    }
  
    try {
        // Find the task to be shared
        // const task = await Task.findById(taskId);

        // const task = await Task.findById(id);
        const  task = await Task.findOne({
            _id: `${taskId}`,
            createdBy: `${currentUser}`
          });
        if (!task) {
        return res.status(404).json({ message: 'Task not found or not authorise to share' });
        }
  
        // Check if the current user is not the task creator

        if (task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only share tasks that you have created.' });
        }
  
        // Update the sharedWith array in the task model using spread operator

        task.sharedWith = [...new Set([...task.sharedWith, ...emails])]; 

        // Save the updated task
        await task.save();

        // Send email notifications to the users who the task was shared with
        const emailResults = [];
        for (const email of emails) {
            const result = await sendEmail(email, task.title); 
            emailResults.push(result);
        }

        // Check if all emails were sent successfully
        if (emailResults.every(result => result === true)) {
            
            return res.status(200).json({ message: 'Task shared successfully. Check your email.' });

        } else {

            return res.status(500).json({ message: 'Some emails were not sent successfully.' });
        }



    } catch (error) {
        console.error(`server error occurred while sharing the task; ${error}`);

        res.status(500).json({ message: 'An error occurred while sharing the task.' });
    }
  }