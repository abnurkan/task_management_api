const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Path to your app.js or server.js file
const Task = require('../models/Task');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {connect, close} = require('./connectDb');

// describe('Task Management API', () => {
//     let token;
//     let user;

//     beforeAll(async () => {

//         await connect();
//         // Create a test user in the database and generate an authentication token
//         user = await User.create({
//             _id: new mongoose.Types.ObjectId(),
//             email: 'testuser@example.com',
//             username: 'testuser',
//             password: 'password123'
//         });

//         // Generate JWT token for the user
//         token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     });

//     afterAll(async () => {
//         // // Clean up the database after tests
//         // await mongoose.connection.db.dropDatabase();
//         // await mongoose.connection.close();
//         await close();
//     });

//     test('should create a task and set createdBy to the logged-in user', async () => {
//         const taskData = {
//             title: 'New Task',
//             description: 'This is a sample task',
//             dueDate: '2024-12-01',
//             priority: 'High',
//             assignedTo: 'assigneduser@example.com',
//             tags: ['example', 'test']
//         };

//         const response = await request(app)
//             .post('/api/v1/tasks')
//             .set('Authorization', `Bearer ${token}`)
//             .send(taskData);

//         expect(response.status).toBe(201);
//         expect(response.body.task.title).toBe(taskData.title);
//         expect(response.body.task.createdBy).toBe(user._id.toString());
//     });
// });

// task.test.js

describe('POST /tasks', () => {
    let token;
    let user;
    let userId;

    beforeAll(async () => {
        // Connect to a test database
        await connect();

        // Create a test user and generate a token
        user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: 'testuser@example.com',
            username: 'testuser',
            password: 'password123',
        });
        await user.save();
        userId = user._id
        // Generate JWT token
        const payload = { id: user._id };
        token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    afterAll(async () => {
        await close();
    });

    test('should create a task', async () => {
        const taskData = {
            _id: new mongoose.Types.ObjectId(),
            title: 'Test Task',
            description: 'This is a test task',
            dueDate: '2024-12-01',
            priority: 'High',            
            assignedTo: 'testuser@example.com',
            tags: ['testing', 'api'],
        };

        const response = await request(app)
            .post('/api/v1/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(taskData);

        // Check response status and message
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Task created successfully');

        // // Verify task properties
        // const createdTask = await Task.findOne({ title: 'Test Task' });
        // expect(createdTask).not.toBeNull();
        // expect(createdTask.createdBy.toString()).toBe(user._id.toString());
        // expect(createdTask.title).toBe(taskData.title);
        // expect(createdTask.description).toBe(taskData.description);
        // expect(createdTask.priority).toBe(taskData.priority);
        // expect(createdTask.assignedTo).toBe(taskData.assignedTo);
    });

    // test('should return 401 if assigned user does not exist', async () => {
    //     const taskData = {
    //         title: 'Invalid Assignment Task',
    //         description: 'Task with an unregistered user assigned',
    //         dueDate: '2024-12-10',
    //         priority: 'Low',
    //         assignedTo: 'nonexistent@example.com', // This user does not exist
    //         tags: ['invalid', 'user'],
    //     };

    //     const response = await request(app)
    //         .post('/tasks')
    //         .set('Authorization', `Bearer ${token}`)
    //         .send(taskData);

    //     expect(response.status).toBe(401);
    //     expect(response.body.message).toBe('Assigned user cannot perform the task');
    // });
});
