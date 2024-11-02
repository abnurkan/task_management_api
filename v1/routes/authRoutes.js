const express = require('express');
const User = require('../models/User');
const mongoose = require('mongoose');
const router = express.Router();
const connectDB = require('../config/db');



connectDB();
router.get('/users/login', (req,res,next)=>{

    res.status(200).json({
        message:'greeting from login',
       
    });
});

router.post('/users/register', (req,res,next)=>{
    //getting user request
    const {email,username,password} = req.body;

    // creating model object
    const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        username: username,
        password: password

    });

    //checking if email already registerd
    User.findOne({ email })
        .then(existingEmail =>{
            if (existingEmail) {
                return res.status(400).json({
                    message: 'Email already in use.',
                });
            }
            
            //saving data to database
            return newUser.save();
        }) 
        .then(result =>{
            // Sending success response
            // res.status(201).json({
            //     message: 'user registered successfully',
            //     user: result,
            // });
            res.status(201).json({
                message: 'user registered successfully',
                user: {
                    email:result.email,
                    username:result.username,
                },
            });
        })
        .catch(error =>{
            // Log the error for debugging
            console.error(error);
            res.status(500).json({
                message: `registration failed ${error}`,
                error: `${error}`
            });
        })


    });



module.exports = router;
