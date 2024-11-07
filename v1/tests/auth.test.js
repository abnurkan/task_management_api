const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const { connect, close } = require('./connectDb');

// Initialize and connect to the in-memory MongoDB server before tests

beforeAll(async () => {
    await connect(); 
});

afterAll(async () => {
    await close(); 
});

const registerAPI = '/api/v1/users/register';


describe('User Registration', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post(registerAPI)
            .send({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('user registered successfully');
        expect(response.body.user.email).toBe('test@example.com');
    });

    it('should not allow duplicate email registration', async () => {
        await request(app)
            .post(registerAPI)
            .send({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123',
            });

        const response = await request(app)
            .post(registerAPI)
            .send({
                email: 'test@example.com',
                username: 'newuser',
                password: 'password456',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email already in use.');
    });

});

//test login API

const loginAPI = '/api/v1/users/login';

describe('User Login', () => {
    it('should login an existing user', async () => {
        
        const response = await request(app)
            .post(loginAPI)
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successfully');
    });

    it('should return an error for invalid credentials', async () => {
        // await request(app)
        //     .post(registerAPI)
        //     .send({
        //         email: 'test@example.com',
        //         username: 'testuser',
        //         password: 'password123',
        //     });

        const response = await request(app)
            .post(loginAPI)
            .send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return an error for non-existent user', async () => {
        const response = await request(app)
            .post(loginAPI)
            .send({
                email: 'nonexistent@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found. Please register!');
    });
});

