import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { progressService } from './progress.service';
import { completeChallengeSchema, listHistoryQuerySchema } from './progress.dto';
import { sendError, sendSuccess } from '../../lib/apiResponse';
import { NotFoundError } from '../../lib/errors';

export const completeChallenge = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
      return;
    }

    const { id: challengeId } = req.params;
    const data = completeChallengeSchema.parse(req.body);
    const progress = await progressService.completeChallenge(req.user.id, challengeId, data);
    sendSuccess(res, progress);
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'Validation failed' });
      return;
    }

    if (error instanceof NotFoundError) {
      sendError(res, 404, { code: 'NOT_FOUND', message: error.message });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

export const reopenChallenge = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
      return;
    }

    const { id: challengeId } = req.params;
    const result = await progressService.reopenChallenge(req.user.id, challengeId);
    sendSuccess(res, result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      sendError(res, 404, { code: 'NOT_FOUND', message: error.message });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

export const getUserProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
      return;
    }

    const result = await progressService.getUserProgress(req.user.id);
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
      return;
    }

    const query = listHistoryQuerySchema.parse(req.query);
    const limit = Math.min(20, Math.max(1, Number(query.limit) || 20));
    const history = await progressService.getHistory(req.user.id, limit);
    
    // Formatar history para incluir apenas dados necessários
    const formattedHistory = history.map((item: typeof history[0]) => ({
      id: item.id,
      userId: item.userId,
      challengeId: item.challenge.id,
      status: item.status,
      doneAt: item.doneAt?.toISOString() || null,
      createdAt: item.createdAt.toISOString(),
      challenge: {
        id: item.challenge.id,
        title: item.challenge.title,
        description: item.challenge.description,
        orderIndex: item.challenge.orderIndex,
        skillId: item.challenge.skillId,
      },
    }));
    
    sendSuccess(res, formattedHistory);
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'Validation failed' });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

