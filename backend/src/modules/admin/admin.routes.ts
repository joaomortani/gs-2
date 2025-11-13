import express from 'express';
import { authMiddleware, requireAdmin } from '../../middleware/authMiddleware';
import { getOverview, getUserAssessments, getUserProgress } from './admin.controller';

export const adminRoutes = express.Router();

adminRoutes.get('/overview', authMiddleware, requireAdmin, getOverview);
adminRoutes.get('/users/:userId/assessments', authMiddleware, requireAdmin, getUserAssessments);
adminRoutes.get('/users/:userId/progress', authMiddleware, requireAdmin, getUserProgress);

