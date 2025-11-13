import type { Request, Response } from 'express';
import { ZodError } from 'zod';

import { loginSchema, registerSchema, refreshTokenSchema } from './auth.dto';
import {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  getUserProfile,
  login as loginService,
  refreshAccessToken,
  logout as logoutService,
  registerUser as registerUserService,
} from './auth.service';
import { sendError, sendSuccess } from '../../lib/apiResponse';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const result = await loginService(email, password);

    sendSuccess(res, result);
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'Validation failed' }, {
        errors: error.flatten().fieldErrors,
      });
      return;
    }

    if (error instanceof UnauthorizedError) {
      sendError(res, 401, { code: 'UNAUTHORIZED', message: error.message });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    const accessToken = await refreshAccessToken(refreshToken);

    sendSuccess(res, { accessToken });
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'Validation failed' }, {
        errors: error.flatten().fieldErrors,
      });
      return;
    }

    if (error instanceof UnauthorizedError) {
      sendError(res, 401, { code: 'UNAUTHORIZED', message: error.message });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    await logoutService(refreshToken);

    sendSuccess(res, { success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'Validation failed' }, {
        errors: error.flatten().fieldErrors,
      });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
    return;
  }

  try {
    const user = await getUserProfile(req.user.id);

    sendSuccess(res, user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      sendError(res, 404, { code: 'NOT_FOUND', message: error.message });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const result = await registerUserService(name, email, password);

    sendSuccess(res, result);
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'Validation failed' }, {
        errors: error.flatten().fieldErrors,
      });
      return;
    }

    // Tratar erro de usuário já existente
    if (error instanceof ConflictError) {
      sendError(res, 409, { code: 'CONFLICT', message: error.message });
      return;
    }

    // Log do erro para debug
    console.error('Erro ao registrar usuário:', error);
    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create user' });
  }
};