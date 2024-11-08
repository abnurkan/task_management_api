// tests/test.js
const request = require('supertest');
const app = require('../app'); // Your main app file
const User = require('../models/User');
const Task = require('../models/Task');
const { connect, close } = require('./connectDb');
const jwt = require('jsonwebtoken');


let token;
let userId;
let taskId;

beforeAll(async () => {
    // Login to get the token for authentication
    await connect(); 
});

afterAll(async () => {
    await close(); 
});

describe('Task Management API', () => {   

    beforeAll(async () => {
        
        // Clear any existing data
        await User.deleteMany();
        await Task.deleteMany();

        // Register a user and login to get JWT token
        const userResponse = await request(app)
            .post('/api/v1/users/register')
            .send({
                email: 'abdulnurakani@gmail.com',
                username: 'abnurkan',
                password: 'Abnurkan@1234'
            });


        const loginResponse = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'abdulnurakani@gmail.com',
                password: 'Abnurkan@1234'
            });

        // Capture the token from the login response
        token = loginResponse.body.token;

        // Decode the token to get the userId
        const decodedToken = jwt.decode(token);
        userId = decodedToken.id;
        console.log(`user id from user response: ${userId}`)

    });


    test('POST /tasks - Create a new task with createdBy set to current user', async () => {

        const newTask = {
            title: 'Sample Task',
            description: 'Sample Description',
            dueDate: '2024-12-31',
            priority: 'high',
            assignedTo: 'abdulnurakani@gmail.com',
            tags: ['urgent', 'important']
        };

        const response = await request(app)
            .post('/api/v1/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(newTask);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Task created successfully');
        expect(response.body.task).toMatchObject({
            title: newTask.title,
            description: newTask.description,
            dueDate: newTask.dueDate,
            priority: newTask.priority,
            assignedTo: newTask.assignedTo,
            createdBy: userId // Verify createdBy is set to the current user's ID
        });

        // Capture the task ID for the delete test
        taskId = response.body.task._id;
    });

});

describe('DELETE /tasks/:id - Delete a task', () => {   

    test('DELETE /tasks/:id - if deleted sucessfully (200))', async () => {
        const response = await request(app)
            .delete(`/api/v1/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Task deleted successfully');
    });
});
