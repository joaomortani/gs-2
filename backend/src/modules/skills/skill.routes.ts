import express from 'express';
import { authMiddleware, requireAdmin } from '../../middleware/authMiddleware';
import { getSkills, getSkillById, createSkill, updateSkill, deleteSkill } from './skill.controller';

export const skillRoutes = express.Router();

skillRoutes.get('/', getSkills);
skillRoutes.get('/:id', getSkillById);
skillRoutes.post('/', authMiddleware, requireAdmin, createSkill);
skillRoutes.put('/:id', authMiddleware, requireAdmin, updateSkill);
skillRoutes.delete('/:id', authMiddleware, requireAdmin, deleteSkill);
