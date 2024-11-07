// taskValidator.js

const { body, validationResult } = require('express-validator');

// Middleware to validate task input
const validateTask = [
    // Check title is not empty
    body('title')
        .notEmpty()
        .withMessage('Task title is required.')
        .isString()
        .withMessage('Task title must be a string.'),
    // Check status is either "pending", "in-progress", or "completed"
    body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be either "pending", "in-progress", or "completed".'),

    body('priority')
    .notEmpty()
    .isIn(['low', 'medium','high'])
    .withMessage(`Status must be either 'low', 'medium' or 'high'`),

    // Check dueDate is a valid date in the future
    body('dueDate')
        .notEmpty()
        .withMessage('Due date is required.')
        .isISO8601()
        .withMessage('Due date must be a valid date.')
        .custom((value) => {
            const dueDate = new Date(value);
            const now = new Date();
            if (dueDate <= now) {
                throw new Error('Due date must be a future date.');
            }
            return true;
        }),    

    // Middleware function to handle validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map(err => ({
            message: err.msg,
            location: err.location
            }));
            return res.status(400).json(formattedErrors);
        }
        next();
    }
];

// const ValidateStatus =[
//     // Check status is either "pending", "in-progress", or "completed"
//     body('status')
//         .optional()
//         .isIn(['pending', 'in-progress', 'completed'])
//         .withMessage('Status must be either "pending", "in-progress", or "completed".'),

//     // Middleware function to handle validation results
//     (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             const formattedErrors = errors.array().map(err => ({
//             message: err.msg,
//             location: err.location
//             }));

//             return res.status(400).json(formattedErrors);
//         }
//     }

// ];

// module.exports = {validateTask,ValidateStatus};

module.exports = validateTask;
