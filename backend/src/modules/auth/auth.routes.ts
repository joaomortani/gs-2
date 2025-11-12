import express from 'express';

import { authMiddleware } from '../../middleware/authMiddleware';
import { login, logout, me, refresh, register } from './auth.controller';

export const authRoutes = express.Router();

authRoutes.post('/login', login);
authRoutes.post('/register', register);
authRoutes.post('/refresh', refresh);
authRoutes.post('/logout', logout);
authRoutes.get('/me', authMiddleware, me);
