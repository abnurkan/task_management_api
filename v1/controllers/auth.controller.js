const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');


exports.RegisterUser = async (req, res) => {
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
                username: newUser.username
            },
            // user: { 
            //     email: newUser.email,
            //     username:newUser.username,
            //  },
        });
    } catch (error) {
        console.error(error);

        // Ensure this response is sent only if no previous response has been sent
        return res.status(500).json({
            message: `registration failed ${error.message}`,
            error: `${error}`,
        });
    }
}



exports.loginUser = async (req, res, next) => {
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

        const payload ={
            id: user._id
        };

        if (isMatch) {
            const token = jwt.sign(payload, 
                process.env.JWT_SECRET, 
                { expiresIn: '3h' }
            );

            return res.status(200).json({
                message: 'Login successfully',
                token:token,
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
}





