/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     security:
 *       - BearerAuth: []
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// /**
//  * @swagger
//  * /tasks:
//  *   get:
//  *     summary: Get all tasks
//  *     security:
//  *       - BearerAuth: []
//  *     tags: [Tasks]
//  *     parameters:
//  *       - name: page
//  *         in: query
//  *         schema:
//  *           type: integer
//  *           example: 1
//  *         description: Page number for pagination
//  *       - name: limit
//  *         in: query
//  *         schema:
//  *           type: integer
//  *           example: 5
//  *         description: Number of tasks per page
//  *       - name: status
//  *         in: query
//  *         schema:
//  *           type: string
//  *           example: pending
//  *         description: Filtering tasks based on status
//  *       - name: priority
//  *         in: query
//  *         schema:
//  *           type: string
//  *           example: low
//  *         description: Filtering tasks based on priority
//  *     responses:
//  *       200:
//  *         description: A list of tasks
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Task'
//  *       401:
//  *         $ref: '#/components/responses/Unauthorized'
//  */
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     security:
 *       - BearerAuth: []
 *     tags: [Tasks]
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Number of tasks per page
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *           example: pending
 *         description: Filter tasks by status
 *       - name: priority
 *         in: query
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *           example: high
 *         description: Filter tasks by priority
 *     responses:
 *       200:
 *         description: A list of tasks with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Task:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     totalTasks:
 *                       type: integer
 *                       example: 100
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/TaskNotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Tasks]
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/TaskNotFound'
 */

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Tasks]
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/TaskNotFound'
 */

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Tasks]
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/TaskNotFound'
 */

/**
 * @swagger
 * /tasks/share:
 *   post:
 *     summary: Share a task with multiple users
 *     security:
 *       - BearerAuth: []
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *               - emails
 *             properties:
 *               taskId:
 *                 type: string
 *                 example: "64cf91b58e6c8f001fdea2cd"
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user1@example.com", "user2@example.com"]
 *     responses:
 *       200:
 *         description: Task shared successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/TaskNotFound'
 */
