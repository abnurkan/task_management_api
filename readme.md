
# Task Management API

This project is a Task Management API built using Node.js, Express, and MongoDB. It provides endpoints for managing tasks and is designed to be run locally for development or testing.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or above recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (either locally)
## Getting Started

### Step 1: Clone the Repository

Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/abnurkan/task_management_api.git
```

### Step 2: Navigate to the Project Directory

Change directory to the project folder:

```bash
cd task_management_api
```
```bash
cd v1
```

### Step 3: Install Dependencies

Install the required packages listed in `package.json`:

```bash
npm install
```

### Step 4: Set Up MongoDB Database

1. Ensure MongoDB is running on your local machine.
2. Check a `.env` file in the `v1` directory and replace `<your_mongo_uri>` with your MongoDB connection string:

   ```plaintext
   MONGO_URI=<your_mongo_uri>
   PORT=3000
   ```

   - **MONGO_URI**: The MongoDB URI to connect to.
   - **PORT**: The port on which the application will run (default is 3000).

### Step 5: Start the Server

To start the server, run:

```bash
npm start
```


The server will be accessible at `http://localhost:3000` by default.

## API Endpoints

**Base URL**: `http://localhost:5000/api/v1/`

### Authentication Endpoints

- `POST /users/register`: Register a new user
- `POST /users/login`: Login a user

### Task Endpoints

- `POST /tasks`: Create a new task
- `GET /tasks`: Retrieve all tasks for the logged-in user
- `GET /tasks/:id`: Retrieve a specific task by its ID
- `PATCH /tasks/:id`: Update an existing task
- `DELETE /tasks/:id`: Delete a task

For detailed information on each endpoint, including request and response formats, refer to this  [API documentation](https://github.com/abnurkan/task_management_api/blob/main/v1/Task_Management_API_Documentation.md) .

## Testing
All my API endpoint was tested manually using POSTMAN and it works perfectly.However I try automatic unit test only `POST /users/register` and `POST /users/login` succeed after i add protection to the endpoint.

To view my manual testcase you can check [here](https://github.com/abnurkan/task_management_api/pull/1).

You can run automatic tests with the following command:

```bash
npm test
```
