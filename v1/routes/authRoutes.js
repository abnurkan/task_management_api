const express = require('express');
const User = require('../models/User');
const mongoose = require('mongoose');
const router = express.Router();
const connectDB = require('../config/db');
const bcrypt = require('bcryptjs');

//connect to database

connectDB();

// router.post('/users/register', (req,res,next)=>{
//     //getting user request
//     const {email,username,password} = req.body;

//     // creating model object
//     const newUser = new User({
//         _id: new mongoose.Types.ObjectId(),
//         email: email,
//         username: username,
//         password: password

//     });

//     //checking if email already registerd
//     User.findOne({ email })
//         .then(existingEmail =>{
//             if (existingEmail) {
//                 return res.status(400).json({
//                     message: 'Email already in use.',
//                 });
//             }
            
//             //saving data to database
//             return newUser.save();
//         }) 
//         .then(result =>{
//             return res.status(201).json({
//                 message: 'user registered successfully',
//                 user: {
//                     email:result.email,
//                     username:result.username,
//                 },
//             });
//         })
//         .catch(error =>{
//             // Log the error for debugging
//             console.error(error);

//             return res.status(500).json({
//                 message: `registration failed ${error.message}`,
//                 error: `${error}`
//             });
//         })
//     });



router.post('/users/register', async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }


        // Create a new user
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            email: email,
            username: username,
            password: password

        });
        await newUser.save();

        return res.status(201).json({
            message: 'user registered successfully',
            user: { 
                email: newUser.email,
                username:newUser.username,
             },
        });
    } catch (error) {
        console.error(error);

        // Ensure this response is sent only if no previous response has been sent
        return res.status(500).json({
            message: `registration failed ${error.message}`,
            error: `${error}`,
        });
    }
});



// user login endpoint
router.post('/users/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        console.log("User found:", user); // Check if the user is found

        if (!user) {
            return res.status(404).json({
                message: 'User not found. Please register!',
            });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch); // Check if passwords match

        if (isMatch) {
            return res.status(200).json({
                message: 'Login successfully',
            });
        }

        return res.status(400).json({
            message: 'Invalid credentials',
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            message: 'Login failed due to server error',
            error: error.message,
        });
    }
});


module.exports = router;
