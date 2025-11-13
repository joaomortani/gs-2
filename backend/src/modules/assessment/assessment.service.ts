import { assessmentRepository } from './assessment.repository';
import { SubmitAssessmentDTO, SubmitAssessmentsDTO } from './assessment.dto';
import { NotFoundError } from '../../lib/errors';
import { prisma } from '../../config/prisma';

export const assessmentService = {
  async submitAssessment(userId: string, data: SubmitAssessmentDTO) {
    const skill = await prisma.skill.findUnique({
      where: { id: data.skillId },
    });

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    if (!skill.isActive) {
      throw new NotFoundError('Skill is not active');
    }

    return assessmentRepository.upsertAssessment(userId, data.skillId, data.score);
  },

  async submitAssessments(userId: string, data: SubmitAssessmentsDTO) {
    const results = [];

    for (const assessment of data.assessments) {
      const skill = await prisma.skill.findUnique({
        where: { id: assessment.skillId },
      });

      if (!skill || !skill.isActive) {
        continue;
      }

      const result = await assessmentRepository.upsertAssessment(
        userId,
        assessment.skillId,
        assessment.score
      );
      results.push(result);
    }

    return results;
  },

  async getUserAssessments(userId: string) {
    return assessmentRepository.getUserAssessments(userId);
  },

  async getAssessmentBySkill(userId: string, skillId: string) {
    return assessmentRepository.getAssessmentBySkill(userId, skillId);
  },
};

