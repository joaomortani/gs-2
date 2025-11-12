import express from 'express';

import { getSkills, getSkillById } from './skill.controller';

export const skillRoutes = express.Router();

skillRoutes.get('/', getSkills);
skillRoutes.get('/:id', getSkillById);
