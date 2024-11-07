
# Task Management API Documentation

**Base URL**: `/api/v1/`

## Table of Contents

1. [Authentication](#1-authentication)
   - [Register a New User](#register-a-new-user)
   - [Login](#login)
2. [Task Management](#2-task-management)
   - [Create a Task](#create-a-task)
   - [Get All Tasks](#get-all-tasks)
   - [Get Task by ID](#get-task-by-id)
   - [Update a Task](#update-a-task)
   - [Delete a Task](#delete-a-task)
  

---

## 1. Authentication

- All endpoints require a valid JSON Web Token (JWT) except for user registration and login.
- Registration and login are the only unprotected endpoints. 
- They don’t need a token because they are used to create an account or authenticate a user for the first time

### Register a New User

**Endpoint**: `users/register`  
**Method**: `POST`

#### Request Body

| Field      | Type   | Required | Description                 |
|------------|--------|----------|-----------------------------|
| `email`    | String | Yes      | Unique email of the user.   |
| `username` | String | No       | Optional username.          |
| `password` | String | Yes      | Password for the account.   |

#### Example Request

```json
{
  "email": "user@example.com",
  "username": "user123",
  "password": "password123"
}
```

#### Responses

- **201 Created**: User registered successfully.
- **400 Bad Request**: Email already in use.
- **500 Internal Server Error**: Registration failed.

#### Example Success Response

```json
{
  "message": "User registered successfully"
}
```

---

### Login

**Endpoint**: `/users/login`  
**Method**: `POST`

#### Request Body

| Field      | Type   | Required | Description               |
|------------|--------|----------|---------------------------|
| `email`    | String | Yes      | Email of the user.        |
| `password` | String | Yes      | Password of the user.     |

#### Example Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Responses

- **200 OK**: Login successful, returns a JWT token.
- **400 Bad Request**: Invalid email or password.
- **500 Internal Server Error**: Login failed.

#### Example Success Response

```json
{
    "message": "Login successfully",
    "token": "your.jwt.token"
}
```

---

## 2. Task Management

### Headers

All task-related endpoints require the `Authorization` header with a JWT:

```http
Authorization: Bearer <token>
```

### Create a Task

**Endpoint**: `/tasks`  
**Method**: `POST`

#### Request Body

| Field       | Type     | Required | Description                              |
|-------------|----------|----------|------------------------------------------|
| `title`     | String   | Yes      | Title of the task.                       |
| `description` | String | No       | Optional detailed description of the task. |
| `dueDate`   | Date     | Yes      | Due date for the task.                   |
| `status`    | String   | No       | Task status: "pending", "in-progress", "completed". Defaults to "pending". |
| `priority`  | String   | No       | Priority level: "low", "medium", "high". |
| `assignedTo` | String  | No       | Email of the assigned user.              |
| `tags`      | Array    | No       | Optional array of tags.                  |

#### Example Request

```json
{
    "message": "Task created successfully",
    "task": {
        "id": "672cbdcb6858d2eb4179089b",
        "title": "learn javascript 10",
        "description": "Finish the task management API",
        "dueDate": "2024-12-01T00:00:00.000Z",
        "status": "pending",
        "priority": "high",
        "assignedTo": "abba2@gmail.com",
        "tags": [
            "urgent",
            "important"
        ],
        "createdAt": "2024-11-07T13:16:59.851Z",
        "updatedAt": "2024-11-07T13:16:59.851Z"
    }
}
```

#### Responses

- **201 Created**: Task created successfully.
- **401 Created**: Assigned user cannot perform the task(not registered).
- **409 Bad Request**: Task already created!.
- **400 Bad Request**: Missing or invalid fields.
- **500 Internal Server Error**: Failed to create task.

#### Example Success Response

```json
{
    "message": "Task created successfully",
    "task": {
        "id": "672cbdcb6858d2eb4179089b",
        "title": "learn javascript 10",
        "description": "Finish the task management API",
        "dueDate": "2024-12-01T00:00:00.000Z",
        "status": "pending",
        "priority": "high",
        "assignedTo": "abba2@gmail.com",
        "tags": [
            "urgent",
            "important"
        ],
        "createdAt": "2024-11-07T13:16:59.851Z",
        "updatedAt": "2024-11-07T13:16:59.851Z"
    }
}
```

---

### Get All Tasks

**Endpoint**: `/tasks`  
**Method**: `GET`

#### Query Parameters

| Parameter | Type   | Required | Description                                       |
|-----------|--------|----------|---------------------------------------------------|
| `page`    | Number | No       | Page number for pagination (default: 1).          |
| `limit`   | Number | No       | Number of tasks per page (default: 10).           |
| `status`  | String | No       | Filter by task status (e.g., "pending").          |
| `priority`| String | No       | Filter by task priority (e.g., "high").           |
| `tags`    | String | No       | Comma-separated tags to filter by (e.g., "work,urgent"). |

#### Example Request

```
GET /tasks?page=1&limit=10&status=pending&priority=high&tags=work,urgent
```

#### Responses

- **200 OK**: List of tasks with pagination.
- **404 OK**: Task list is empty.
- **500 Internal Server Error**: Failed to retrieve tasks.

#### Example Success Response

```json
{
    "Task": [
        {
            "title": "learn javascript 10",
            "description": "Finish the task management API",
            "dueDate": "2024-12-01T00:00:00.000Z",
            "status": "pending",
            "priority": "high",
            "createdBy": "672ca7070640603ad349d874",
            "assignedTo": "abba2@gmail.com",
            "tags": [
                "urgent",
                "important"
            ],
            "createdAt": "2024-11-07T13:16:59.851Z",
            "updatedAt": "2024-11-07T13:16:59.851Z"
        },
        {
            "title": "learn javascript 8",
            "description": "Finish the task management API",
            "dueDate": "2024-12-01T00:00:00.000Z",
            "status": "pending",
            "priority": "high",
            "createdBy": "672ca7070640603ad349d874",
            "assignedTo": "abba2@gmail.com",
            "tags": [
                "urgent",
                "important"
            ],
            "createdAt": "2024-11-07T13:02:39.984Z",
            "updatedAt": "2024-11-07T13:02:39.984Z"
        },
        {
            "title": "learn javascript 7",
            "description": "Finish the task management API",
            "dueDate": "2024-12-01T00:00:00.000Z",
            "status": "pending",
            "priority": "high",
            "createdBy": "672ca7070640603ad349d874",
            "assignedTo": "abba2@gmail.com",
            "tags": [
                "urgent",
                "important"
            ],
            "createdAt": "2024-11-07T12:57:38.380Z",
            "updatedAt": "2024-11-07T12:57:38.380Z"
        },
        {
            "title": "learn javascript 6",
            "description": "Finish the task management API",
            "dueDate": "2024-12-01T00:00:00.000Z",
            "status": "pending",
            "priority": "high",
            "createdBy": "672ca7070640603ad349d874",
            "assignedTo": "abba2@gmail.com",
            "tags": [
                "urgent",
                "important"
            ],
            "createdAt": "2024-11-07T12:56:54.831Z",
            "updatedAt": "2024-11-07T12:56:54.831Z"
        },
        {
            "title": "learn javascript 4",
            "description": "Finish the task management API",
            "dueDate": "2024-12-01T00:00:00.000Z",
            "status": "pending",
            "priority": "high",
            "createdBy": "672ca7070640603ad349d874",
            "assignedTo": "abba2@gmail.com",
            "tags": [
                "urgent",
                "important"
            ],
            "createdAt": "2024-11-07T12:33:32.704Z",
            "updatedAt": "2024-11-07T12:33:32.704Z"
        }
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 2,
        "totalTasks": 7,
        "pageSize": 5
    }
}
```

---

### Get Task by ID

**Endpoint**: `/tasks/:id`  
**Method**: `GET`

#### Responses

- **200 OK**: Task details.
- **404 Not Found**: Task not found.
- **500 Internal Server Error**: Failed to retrieve task.

#### Example Success Response

```json
{
  "_id": "task_id",
  "title": "Complete project",
  "status": "pending",
  "priority": "high",
  "createdBy": "user_id"
}
```

---

### Update a Task

**Endpoint**: `/tasks/:id`  
**Method**: `PUT`

#### Request Body

You can update any fields of a task, such as `title`, `description`, `dueDate`, `status`, `priority`, etc.

#### Responses

- **200 OK**: Task updated successfully.
- **404 Not Found**: Task not found.
- **401 Unauthorised**: Invalid or expired token!.
- **500 Internal Server Error**: Failed to update task.

---

### Delete a Task

**Endpoint**: `/api/v1/tasks/:id`  
**Method**: `DELETE`

#### Responses

- **200 OK**: Task deleted successfully.
- **404 Not Found**: Task not found.
- **401 Unauthorised**: Invalid or expired token!.
- **500 Internal Server Error**: Failed to delete task.

#### Example Success Response

```json
{
  "message": "Task deleted successfully"
}
```

---

## Error Handling

All endpoints may return the following common error codes with structured error messages:

| Status Code | Description                                |
|-------------|--------------------------------------------|
| 400         | Bad request. Invalid input or parameters.  |
| 401         | Unauthorized. Invalid or missing JWT token. |
| 404         | Resource not found.                        |
| 500         | Internal server error.                     |

#### Example Error Response

```json
{
  "error": "Invalid email or password"
}
```

---
## request Valiadtion
All request was validated across each endpoint.
