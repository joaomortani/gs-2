import type { Request, Response } from 'express';

export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const skills = await getSkillsService();
    sendSuccess(res, skills);
  } catch (error) {
    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};


export const getSkillById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const skill = await getSkillByIdService(id);
    sendSuccess(res, skill);
  } catch (error) {
    sendError(res, 500, { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
};