import express from 'express';
import { authMiddleware, requireAdmin } from '../../middleware/authMiddleware';
import { getUsers, getUserById, createUser, updateUser } from './user.controller';

export const userRoutes = express.Router();

userRoutes.get('/', authMiddleware, requireAdmin, getUsers);
userRoutes.post('/', authMiddleware, requireAdmin, createUser);
userRoutes.get('/:id', authMiddleware, getUserById);
userRoutes.put('/:id', authMiddleware, requireAdmin, updateUser);

