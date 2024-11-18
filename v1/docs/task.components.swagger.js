/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - assignedTo
 *       properties:
 *         title:
 *           type: string
 *           example: "Complete project documentation"
 *         description:
 *           type: string
 *           example: "Create API docs for all endpoints"
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: "2024-12-01T18:30:00.000Z"
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *           example: "pending"
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: "high"
 *         assignedTo:
 *           type: string
 *           example: "user@example.com"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["documentation", "api"]
 *   parameters:
 *     TaskId:
 *       name: id
 *       in: path
 *       required: true
 *       description: The ID of the task
 *       schema:
 *         type: string
 *         example: "64cf91b58e6c8f001fdea2cd"
 *   responses:
 *     Unauthorized:
 *       description: Unauthorized access
 *     ValidationError:
 *       description: Validation error
 *     TaskNotFound:
 *       description: Task not found
 */
