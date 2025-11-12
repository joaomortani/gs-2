import type { Request, Response } from 'express';
import { adminService } from './admin.service';
import { sendError, sendSuccess } from '../../lib/apiResponse';

export const getOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const overview = await adminService.getOverview();
    sendSuccess(res, overview);
  } catch (error) {
    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

