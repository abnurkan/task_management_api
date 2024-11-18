//Express application setup
const express = require('express');
const morgan = require('morgan')
const app = express();
const authRoutes =require('./routes/authRoutes');
const taskRoutes =require('./routes/taskRoutes');

// Swagger options
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config();
const PORT = process.env.PORT || 5000;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'API for managing tasks',
        },
        servers: [
            {
                url: `http://localhost: ${PORT}`,
            },
        ],
    },
    apis: ['./docs/*.swagger.js'], // Include all Swagger docs
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//add morgan 
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Middleware to parse JSON
app.use(express.json());

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1',authRoutes);
app.use('/api/v1',taskRoutes);



app.use('/', (req, res,next) => {
    res.send('Hello, welcome to Task amnagement API');
  });

app.get('/favicon.ico', (req, res) => res.status(204).end());

// 404 error handling for undefined routes
app.use((req,res,next) =>{
    const error = new Error('Route not found or incorrectly Type');

    error.status = 404;
    next(error);
});

//error handling

app.use((error,req,res,next) =>{
    res.status(500).json({
        message: 'Server in the main app failed to start',
        error: error.message,
    });
});














module.exports = app;