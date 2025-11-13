import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  submitAssessment,
  submitAssessments,
  getUserAssessments,
  getAssessmentBySkill,
} from './assessment.controller';

export const assessmentRoutes = express.Router();

assessmentRoutes.post('/submit', authMiddleware, submitAssessment);
assessmentRoutes.post('/submit-multiple', authMiddleware, submitAssessments);
assessmentRoutes.get('/me', authMiddleware, getUserAssessments);
assessmentRoutes.get('/skill/:skillId', authMiddleware, getAssessmentBySkill);

