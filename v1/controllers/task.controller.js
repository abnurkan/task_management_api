const mongoose = require('mongoose');
const Task  = require('../models/Task');
const User  = require('../models/User');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const sendEmail = require('../utils/sendEmail'); // Import the sendEmail function


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
        const currentUser = req.user._id;
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

exports.getTask = async (req,res) =>{
    
    try {
        const task = await Task.find({});

        if(task.length >=1){
            console.log(`task lengh ${task}`);

             // Get pagination parameters from query, with default values
            const page = parseInt(req.query.page) || 1; // Default to page 1
            const limit = parseInt(req.query.limit) || 5; // Default to 5 tasks per page if not entered

            const status = parseInt(req.query.status) || 'pending'; // Default to page 1
            const priority = parseInt(req.query.limit) || 'low'; // Default to 5 tasks per page if not entered

            //define cached key here
            const taskcachedKey = `tasks:page=${page}&limit=${limit}`;

            //fetch task from cache rather than from database 

            const cachedTask = await redisClient.get(taskcachedKey);

            //check if data present in the cache
            if(cachedTask){
                return res.status(200).json({
                    Task:cachedTask.map(task => ({                    
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

            }




            // Calculate the starting index for the query
            const skip = (page - 1) * limit;

            // Retrieve tasks from the database with pagination
            const tasks = await Task.find((status && { status }),(priority && { priority }))
                .skip(skip) // Skip documents for pagination
                .limit(limit) // Limit the number of documents returned
                .sort({ createdAt: -1 }); // Sort by creation date, newest first

            // Get the total count of documents to calculate the total pages
            const totalTasks = await Task.countDocuments();
            const totalPages = Math.ceil(totalTasks / limit);

            const response = {
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
            }

            //here I  Store the response in Redis with an expiration time (e.g., 1 hour = 3600s)
            //so that next time it can be use from cache memory

            await redisClient.setEx(taskcachedKey,3600,JSON.stringify(response));

            return res.status(200).json(response);
            
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
}


exports.shareTask = async (req, res) => {

    const { taskId, emails } = req.body; // taskId and emails are sent in the request body
    
    // Ensure emails is an array
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: 'Please provide a valid list of emails.' });
    }
  
    try {
        // Find the task to be shared
        const task = await Task.findById(taskId);
        if (!task) {
        return res.status(404).json({ message: 'Task not found' });
        }
  
        // Check if the current user is the task creator

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