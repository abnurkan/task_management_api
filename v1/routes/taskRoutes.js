const mongoose = require('mongoose');
const Task  = require('../models/Task');
const express = require('express');
const router = express.Router();



router.post('/tasks',async (req,res) =>{
    const { title, description, dueDate} = req.body;
    
    const newtask = new Task({
        _id: new mongoose.Types.ObjectId(),
        title,
        description,
        dueDate,
    })

    // Check for missing required fields
    if (!title || !dueDate) {
        return res.status(400).json({
            message: 'Required fields are missing: title and dueDate are required.'
         });
    }

    try {
        const task = await Task.findOne({ title});

        if(task){
            console.log(task);
            return res.status(409).json({
                message:'Task already created!',
                
            })
        }else{
            console.log(task);
            const createdTask = await newtask.save();
            return res.status(201).json({
                message:'Task created successfully',
                Task:createdTask,
            })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:'server Failed to create task',
            error:error.message,
        })     
    }
});

router.get('/tasks',async (req,res) =>{
    
    try {
        const task = await Task.find({});

        if(task.length >=1){
            console.log(task);
            return res.status(200).json({
                task             
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

router.get('/tasks/:id',async (req,res) =>{
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
                task             
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

router.put('/tasks/:id',async (req,res) =>{
    const id = req.params.id;

    //  Validate the mongoose ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: 'Invalid task ID format.',
        });
    }
    try {

        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if(task){
            console.log(task);
            return res.status(200).json({
                message: 'Task updated successfully',
                Task: task ,            
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

router.delete('/tasks/:id',async (req,res) =>{
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