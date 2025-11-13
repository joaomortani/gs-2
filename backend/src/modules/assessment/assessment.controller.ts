import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { assessmentService } from './assessment.service';
import { submitAssessmentSchema, submitAssessmentsSchema } from './assessment.dto';
import { sendError, sendSuccess } from '../../lib/apiResponse';
import { NotFoundError } from '../../lib/errors';

export const submitAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
      return;
    }

    const data = submitAssessmentSchema.parse(req.body);
    const result = await assessmentService.submitAssessment(req.user.id, data);

    sendSuccess(res, result);
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

export const submitAssessments = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
      return;
    }

    const data = submitAssessmentsSchema.parse(req.body);
    const results = await assessmentService.submitAssessments(req.user.id, data);

    sendSuccess(res, { assessments: results });
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(res, 400, { code: 'VALIDATION_ERROR', message: 'Validation failed' });
      return;
    }

    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

export const getUserAssessments = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
      return;
    }

    const assessments = await assessmentService.getUserAssessments(req.user.id);
    sendSuccess(res, { assessments });
  } catch (error) {
    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

export const getAssessmentBySkill = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
      return;
    }

    const skillId = req.params.skillId;
    const assessment = await assessmentService.getAssessmentBySkill(req.user.id, skillId);

    if (!assessment) {
      sendError(res, 404, { code: 'NOT_FOUND', message: 'Assessment not found' });
      return;
    }

    sendSuccess(res, assessment);
  } catch (error) {
    sendError(res, 500, { code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
};

