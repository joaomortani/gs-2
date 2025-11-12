import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { challengeService } from './challenge.service';
import { createChallengeSchema, updateChallengeSchema, listChallengesQuerySchema } from './challenge.dto';
import { sendError, sendSuccess } from '../../lib/apiResponse';
import { parsePagination } from '../../lib/pagination';
import { NotFoundError, ConflictError } from '../../lib/errors';

export const getChallengesBySkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const skillId = req.params.skillId || (req as any).params?.skillId;
    if (!skillId) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'skillId is required' });
      return;
    }
    const query = listChallengesQuerySchema.parse(req.query);
    const { page, limit } = parsePagination(req.query);
    const sort = query.sort || 'orderIndex';

    const result = await challengeService.listBySkill(skillId, { page, limit, sort });

    sendSuccess(res, {
      items: result.items,
      page,
      limit,
      total: result.total,
    });
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

export const getChallengeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const challenge = await challengeService.getById(id);
    sendSuccess(res, challenge);
  } catch (error) {
    if (error instanceof NotFoundError) {
      sendError(res, 404, { code: 'NOT_FOUND', message: error.message });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

export const createChallenge = async (req: Request, res: Response): Promise<void> => {
  try {
    const skillId = req.params.skillId || (req as any).params?.skillId;
    if (!skillId) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'skillId is required' });
      return;
    }
    const data = createChallengeSchema.parse(req.body);
    const challenge = await challengeService.create(skillId, data);
    sendSuccess(res, challenge, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'Validation failed' });
      return;
    }

    if (error instanceof NotFoundError) {
      sendError(res, 404, { code: 'NOT_FOUND', message: error.message });
      return;
    }

    if (error instanceof ConflictError) {
      sendError(res, 409, { code: 'CONFLICT', message: error.message });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

export const updateChallenge = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateChallengeSchema.parse(req.body);
    const challenge = await challengeService.update(id, data);
    sendSuccess(res, challenge);
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'Validation failed' });
      return;
    }

    if (error instanceof NotFoundError) {
      sendError(res, 404, { code: 'NOT_FOUND', message: error.message });
      return;
    }

    if (error instanceof ConflictError) {
      sendError(res, 409, { code: 'CONFLICT', message: error.message });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

export const deleteChallenge = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await challengeService.delete(id);
    sendSuccess(res, { success: true });
  } catch (error) {
    if (error instanceof NotFoundError) {
      sendError(res, 404, { code: 'NOT_FOUND', message: error.message });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

