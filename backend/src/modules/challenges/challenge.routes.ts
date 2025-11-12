import express from 'express';
import { authMiddleware, requireAdmin } from '../../middleware/authMiddleware';
import {
  getChallengesBySkill,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from './challenge.controller';

export const challengeRoutes = express.Router();

challengeRoutes.get('/:id', getChallengeById);
challengeRoutes.put('/:id', authMiddleware, requireAdmin, updateChallenge);
challengeRoutes.delete('/:id', authMiddleware, requireAdmin, deleteChallenge);

export const skillChallengeRoutes = express.Router({ mergeParams: true });

skillChallengeRoutes.get('/', getChallengesBySkill);
skillChallengeRoutes.post('/', authMiddleware, requireAdmin, createChallenge);

