import { Router } from 'express';
import {
  createTodo,
  getTodoById,
  getTodos,
} from '../controllers/todoController';
import { authenticateJWT } from '../middlewares/authHandler';

const router = Router();

/**
 * @swagger
 * /api/todos:
 *   post:
 *     tags:
 *       - Todos
 *     summary: Create a new todo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete project
 *               description:
 *                 type: string
 *                 example: Finish the REST API implementation
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input
 */
router.post('/todos', authenticateJWT, createTodo);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     tags:
 *       - Todos
 *     summary: Get all todos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       401:
 *         description: Unauthorized
 */
router.get('/todos', authenticateJWT, getTodos);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     tags:
 *       - Todos
 *     summary: Get todo by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Todo not found
 */
router.get('/todos/:id', authenticateJWT, getTodoById);

export default router;
