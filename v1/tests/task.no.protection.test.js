const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Task = require('../models/Task');
const { connect, close } = require('./connectDb');

// Initialize and connect to the in-memory MongoDB server before tests

beforeAll(async () => {
    await connect(); 
});

afterAll(async () => {
    await close(); 
});

const taskAPI = '/api/v1/tasks';


describe('create task POST /api/v1/tasks', () => {
    it('should create a new task', async () => {
        const response = await request(app)
            .post(taskAPI)
            .send({
                title: 'Complete project',
                description: 'Finish the task management API',
                dueDate: '2024-12-01',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Task created successfully');
        expect(response.body.Task.title).toBe('Complete project');
    });

    it('should check for missing required field', async () => {
        const response = await request(app)
            .post(taskAPI)
            .send({
                title: 'Complete project',
                description: 'Finish the task management API',
                
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Required fields are missing: title and dueDate are required.');
        
    });

    it('should check for Already created Task', async () => {
        const response = await request(app)
            .post(taskAPI)
            .send({
                title: 'Complete project',
                description: 'Finish the task management API',
                dueDate: '2024-12-01',
            });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Task already created!');
        
    });


});


describe('Retrieve tasks GET /api/v1/tasks', () => {
    it('get all task', async () => {
        const response = await request(app)
            .get(taskAPI)
            
        expect(response.status).toBe(200);

    });
     // this test case work fine but is true if task is empty
    // it('should check for empty Task', async () => {
    //     const response = await request(app)
    //         .get(taskAPI)
            

    //     expect(response.status).toBe(404);
    //     expect(response.body.message).toBe('Task list is empty');
        
    // });  

    
});

describe('Retrieve single tasks GET /api/v1/tasks/:id', () => {
    
    it('get check inalid id format ', async () => {
          // Create a task to use in the tests
          const task = new Task({
            _id: new mongoose.Types.ObjectId(),
            title: 'Sample Task',
            description: 'This is a sample task description',
            dueDate: '2024-12-01'
        });

        const savedTask = await task.save();
        taskId = savedTask._id;

        //make id unformatted by s
        changedTaskId = taskId + 's';
        console.log(changedTaskId);
    
        const response = await request(app)
            .get(`${taskAPI}/${changedTaskId}`)
            
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid task ID format.')
    });

    it('get single task with an id', async () => {

      console.log(taskId);
  
      const response = await request(app)
          .get(`${taskAPI}/${taskId}`)
          
      expect(response.status).toBe(200);
      expect(response.body.task).toHaveProperty('_id', taskId.toString())
  });
    

//     it('check for non existence id', async () => {
         
//       console.log(taskId);

  
//       const response = await request(app)
//           .get(`${taskAPI}/${taskId}`)
          
//       expect(response.status).toBe(404);
//       expect(response.body.task).toHaveProperty('_id', taskId.toString())
//   });      
});


describe('update single tasks  PUT /api/v1/tasks/:id', () => {
    
    it('get check inalid id format ', async () => {
          // Create a task to use in the tests
          const task = new Task({
            _id: new mongoose.Types.ObjectId(),
            title: 'Sample Task',
            description: 'This is a sample task description',
            dueDate: '2024-12-01'
        });

        const savedTask = await task.save();
        taskId = savedTask._id;

        //make id unformatted by s
        changedTaskId = taskId + 's';
        console.log(changedTaskId);
    
        const response = await request(app)
            .put(`${taskAPI}/${changedTaskId}`)
            
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid task ID format.')
    });
  
  it('update task with a given id', async () => {

      console.log(taskId);
  
      const response = await request(app)
          .put(`${taskAPI}/${taskId}`)
          .send({
            title: "learn javascript",
            description: "Finish the task management API",
            dueDate: "2024-12-01",
            status: "in-progress"
          });
          
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task updated successfully');
  });     
});


describe('delete single tasks DELETE /api/v1/tasks/:id', () => {
    
    it('get check inalid id format ', async () => {
          // Create a task to use in the tests
          const task = new Task({
            _id: new mongoose.Types.ObjectId(),
            title: 'Sample Task',
            description: 'This is a sample task description',
            dueDate: '2024-12-01'
        });

        const savedTask = await task.save();
        taskId = savedTask._id;

        //make id unformatted by s
        changedTaskId = taskId + 's';
        console.log(changedTaskId);
    
        const response = await request(app)
            .delete(`${taskAPI}/${changedTaskId}`)
            
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid task ID format.')
    });
  
  it('Delete task with a given id', async () => {

      console.log(taskId);
  
      const response = await request(app)
          .delete(`${taskAPI}/${taskId}`)
          .send({
            title: "learn javascript",
            description: "Finish the task management API",
            dueDate: "2024-12-01",
            status: "in-progress"
          });
          
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
  });     
});
