const express = require('express');
const userSchema = require('../models/User')
const router = express.Router();

router.get('/users/login', (req,res,next)=>{
    res.status(200).json({
        message:'greeting from login',
       
    });
});

router.post('/users/register', (req,res,next)=>{
    res.status(200).json({
        message:'greeting from register',
       
    });
});


// router.post('/users/login', authController.login);

module.exports = router;
