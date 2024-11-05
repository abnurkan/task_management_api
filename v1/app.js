//Express application setup
const express = require('express');
const morgan = require('morgan')
const app = express();
const authRoutes =require('./routes/authRoutes');
const taskRoutes =require('./routes/taskRoutes');





//add morgan 
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Middleware to parse JSON
app.use(express.json());


app.use('/api/v1',authRoutes);
app.use('/api/v1',taskRoutes);



// app.use('/', (req, res,next) => {
//     res.send('Hello, welcome to Task amnagement API');
//   });

app.get('/favicon.ico', (req, res) => res.status(204).end());

// 404 error handling for undefined routes
app.use((req,res,next) =>{
    const error = new Error('not found');

    error.status = 404;
    next(error);
});

//error handling

app.use((error,req,res,next) =>{
    res.status(error.status || 500 );
    res.json({
        "message": error.message

    });  
});














module.exports = app;