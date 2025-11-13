import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { skillService } from './skill.service';
import { createSkillSchema, updateSkillSchema, listSkillsQuerySchema } from './skill.dto';
import { sendError, sendSuccess } from '../../lib/apiResponse';
import { parsePagination } from '../../lib/pagination';
import { NotFoundError, ConflictError, ValidationError } from '../../lib/errors';

export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = listSkillsQuerySchema.parse(req.query);
    const { page, limit } = parsePagination(req.query);
    // Se isActive vier como string 'true' ou 'false', converter para boolean
    // Se não vier ou vier como undefined, deixar undefined para retornar todas
    const isActive = query.isActive !== undefined 
      ? query.isActive === 'true' || query.isActive === true 
      : undefined;

    const result = await skillService.list({ isActive, page, limit });

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

    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

export const getSkillById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const skill = await skillService.getById(id);
    sendSuccess(res, skill);
  } catch (error) {
    if (error instanceof NotFoundError) {
      sendError(res, 404, { code: 'NOT_FOUND', message: error.message });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

export const createSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createSkillSchema.parse(req.body);
    const skill = await skillService.create(data);
    sendSuccess(res, skill, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'Validation failed' });
      return;
    }

    if (error instanceof ConflictError) {
      sendError(res, 409, { code: 'CONFLICT', message: error.message });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

export const updateSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateSkillSchema.parse(req.body);
    const skill = await skillService.update(id, data);
    sendSuccess(res, skill);
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

export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await skillService.softDelete(id);
    sendSuccess(res, { success: true });
  } catch (error) {
    if (error instanceof NotFoundError) {
      sendError(res, 404, { code: 'NOT_FOUND', message: error.message });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};
