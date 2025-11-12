import express from 'express';
import { authMiddleware, requireAdmin } from '../../middleware/authMiddleware';
import { getOverview } from './admin.controller';

export const adminRoutes = express.Router();

adminRoutes.get('/overview', authMiddleware, requireAdmin, getOverview);

