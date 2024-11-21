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
                email: 'saint08165@gmail.com',
                username: 'abnurkan',
                password: 'Abnurkan@1234'
            });


        const loginResponse = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'saint08165@gmail.com',
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
            assignedTo: 'saint08165@gmail.com',
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

describe('GET /tasks/- Get All task', () => {   

    test('GET /tasks - if fetched sucessfully (200))', async () => {
        const response = await request(app)
            .get(`/api/v1/tasks`)
            .set('Authorization', `Bearer ${token}`);

        // Check the response structure
        expect(response.body).toHaveProperty('Task');
        expect(response.body).toHaveProperty('pagination');

        // Validate the Task array
        const tasks = response.body.Task;
        expect(Array.isArray(tasks)).toBe(true);
        

        // Validate task properties
        tasks.forEach((task) => {
            expect(task).toHaveProperty('title');
            expect(task).toHaveProperty('description');
            expect(task).toHaveProperty('dueDate');
            expect(task).toHaveProperty('status');
            expect(task).toHaveProperty('priority');
            expect(task).toHaveProperty('createdBy');
            expect(task).toHaveProperty('assignedTo');
                      
    
            // Check types of some properties
            expect(typeof task.title).toBe('string');
           
        });
            
    });
    
});

describe('GET /tasks/:id- Get Task Given a task ID', () => {   
    
    test('GET /tasks - if task does not eist (404))', async () => {
        const response = await request(app)
            .get(`/api/v1/tasks/${taskId}s`)
            .set('Authorization', `Bearer ${token}`);

        // Check the response structure
        expect(response.body.message).toBe('Invalid task ID format.');   
    });
    
});

describe('PUT /tasks/:id- Get Task Given a task ID', () => {   
    
    const UpdatedTask = {
        title: 'Sample Task updated',
        description: 'Sample Description',
        dueDate: '2024-12-31',
        priority: 'high',
        assignedTo: 'abdulnurakani@gmail.com',
        tags: ['urgent', 'important']
    };

    test('PUT /tasks - if task updated succesfully (200)', async () => {
        const response = await request(app)
            .put(`/api/v1/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(UpdatedTask);

        // Check the response structure
        expect(response.body.message).toBe('Task updated successfully');   
    });

    test('PUT /tasks - if task does not eist (400))', async () => {
        const response = await request(app)
            .put(`/api/v1/tasks/${taskId}s`)
            .set('Authorization', `Bearer ${token}`)
            .send(UpdatedTask);

        // Check the response structure
        expect(response.body.message).toBe('Invalid task ID format.');   
    });

    test('PUT /tasks - if task does not eist (404))', async () => {
        let wrongTaskId ='572f217f4ec48304c4abd25e'
        const response = await request(app)
            .put(`/api/v1/tasks/${wrongTaskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(UpdatedTask);

        // Check the response structure
        expect(response.body.message).toBe('Task not found');   
    });
});

// describe('POST /tasks/share- share a Task ', () => {  

    

//     const TaskToShare = {
//         taskId: `${taskId}`,
//         emails: ['saint08165@gmail.com']
//     };
//     console.log(TaskToShare)
//     test('POST /tasks - if task shared succesfully (200)', async () => {
//         console.log(`task id in share ${taskId}`);
//         const response = await request(app)
//             .post(`/api/v1/tasks/share`)
//             .set('Authorization', `Bearer ${token}`)
//             .send(TaskToShare);

//         // Check the response structure
//         expect(response.status).toBe(200);
//         expect(response.body.message).toBe('Task shared successfully. Check your email.');   
//     });

//     test('POST /tasks - if the current user is not the task creator (403))', async () => {
//         const response = await request(app)
//             .put(`/api/v1/tasks/share`)
//             .set('Authorization', `Bearer ${token}`)
//             .send(TaskToShare);

//         // Check the response structure
//         expect(response.body.message).toBe('You can only share tasks that you have created.');   
//     });

//     test('POST /tasks - if task does not eist (404))', async () => {
//         let wrongTaskId ='572f217f4ec48304c4abd25e'
//         const WrongTaskToShare = {
//             taskId: `${wrongTaskId}`,
//             emails: ['saint08165@gmail.com']
//         };
//         const response = await request(app)
//             .put(`/api/v1/tasks/share`)
//             .set('Authorization', `Bearer ${token}`)
//             .send(WrongTaskToShare);

//         // Check the response structure
//         expect(response.status).toBe(404);
//         expect(response.body.message).toBe('Task not found');   
//     });
// });

describe('DELETE /tasks/:id - Delete a task', () => {   
    
    test('DELETE /tasks/:id - if deleted sucessfully (200))', async () => {
        const response = await request(app)
            .delete(`/api/v1/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Task deleted successfully');
    });
    test('Delete /tasks - if task format is invalid (400))', async () => {
        const response = await request(app)
            .delete(`/api/v1/tasks/${taskId}s`)
            .set('Authorization', `Bearer ${token}`);

        // Check the response structure
        expect(response.body.message).toBe('Invalid task ID format.');   
    });
});
