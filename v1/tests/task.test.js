const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const { connect, close } = require('./connectDb');

let token;

beforeAll(async () => {
    // Login to get the token for authentication
    await connect(); 
});

afterAll(async () => {
    await close(); 
});

describe('Task API', () => {
    it('should create a new task', async () => {

        const registerRes = await request(app)
            .post('/api/v1/users/register')
            .send({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123',
            });

        // console.log(`register response ${registerRes.body.user.email}`);

        const loginResponse = await request(app)
                .post('/api/v1/users/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });

        // console.log(`register response ${loginResponse.body.user.email}`);

        token = loginResponse.body.token;

        const taskData = {
            title: 'Test Task',
            description: 'This is a test task',
            dueDate: '2024-12-01',
            priority: 'High',
            assignedTo: 'test@example.com',
            tags: ['testing', 'api'],
        };
        const response = await request(app)
            .post('/api/v1/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(taskData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Task created successfully');
        
 
       
    });
    test('should return 401 if assigned user does not exist', async () => {
        const taskData = {
            title: 'Invalid Assignment Task',
            description: 'Task with an unregistered user assigned',
            dueDate: '2024-12-10',
            priority: 'Low',
            assignedTo: 'nonexistent@example.com', // This user does not exist
            tags: ['invalid', 'user'],
        };

        const response = await request(app)
            .post('/api/v1/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(taskData);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Assigned user cannot perform the task');
    });

});
