const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const authControllers =require('../controllers/auth.controller');
//connect to database

connectDB();

router.post('/users/register',authControllers.RegisterUser);

// user login endpoint
router.post('/users/login', authControllers.loginUser);


module.exports = router;
