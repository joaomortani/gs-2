import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  completeChallenge,
  reopenChallenge,
  getUserProgress,
  getHistory,
} from './progress.controller';

export const progressRoutes = express.Router();

progressRoutes.post('/challenges/:id/complete', authMiddleware, completeChallenge);
progressRoutes.delete('/challenges/:id/complete', authMiddleware, reopenChallenge);
progressRoutes.get('/me/progress', authMiddleware, getUserProgress);
progressRoutes.get('/me/history', authMiddleware, getHistory);

