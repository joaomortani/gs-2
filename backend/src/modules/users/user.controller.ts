import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { userService } from './user.service';
import { listUsersQuerySchema, createUserSchema, updateUserSchema } from './user.dto';
import { sendError, sendSuccess } from '../../lib/apiResponse';
import { parsePagination } from '../../lib/pagination';
import { NotFoundError, ForbiddenError, ConflictError } from '../../lib/errors';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = listUsersQuerySchema.parse(req.query);
    const { page, limit } = parsePagination(req.query);
    const search = query.search;
    const isActive = query.isActive ? query.isActive === 'true' : undefined;

    const result = await userService.list({ page, limit, search, isActive });

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

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const user = await userService.getById(id, req.user.id, req.user.role);
    sendSuccess(res, user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      sendError(res, 404, { code: 'NOT_FOUND', message: error.message });
      return;
    }

    if (error instanceof ForbiddenError) {
      sendError(res, 403, { code: 'FORBIDDEN', message: error.message });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await userService.create(data);
    sendSuccess(res, user);
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

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateUserSchema.parse(req.body);
    const user = await userService.update(id, data);
    sendSuccess(res, user);
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

