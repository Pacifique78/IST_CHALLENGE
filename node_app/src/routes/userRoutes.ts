// src/routes/userRoutes.ts
import { Router } from 'express';
import {  createUser, loginUser } from '../controllers/userController';

const router = Router();

router.post('/login', loginUser);
router.post('/signup', createUser);

export default router;
