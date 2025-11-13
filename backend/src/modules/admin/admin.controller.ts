import type { Request, Response } from 'express';
import { adminService } from './admin.service';
import { sendError, sendSuccess } from '../../lib/apiResponse';
import { NotFoundError } from '../../lib/errors';

export const getOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const overview = await adminService.getOverview();
    sendSuccess(res, overview);
  } catch (error) {
    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

export const getUserAssessments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const assessments = await adminService.getUserAssessments(userId);
    sendSuccess(res, { assessments });
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
    const { userId } = req.params;
    const progress = await adminService.getUserProgress(userId);
    sendSuccess(res, { progress });
  } catch (error) {
    if (error instanceof NotFoundError) {
      sendError(res, 404, { code: 'NOT_FOUND', message: error.message });
      return;
    }
    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

