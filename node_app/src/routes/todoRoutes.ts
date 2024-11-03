import { Router } from 'express';
import {
  createTodo,
  getTodoById,
  getTodos,
} from '../controllers/todoController';
import { authenticateJWT } from '../middlewares/authHandler';

const router = Router();

router.post('/todos', authenticateJWT, createTodo);
router.get('/todos', authenticateJWT, getTodos);
router.get('/todos/:id', authenticateJWT, getTodoById);

export default router;
