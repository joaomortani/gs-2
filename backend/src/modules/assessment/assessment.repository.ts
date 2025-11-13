import { prisma } from '../../config/prisma';

export const assessmentRepository = {
  async upsertAssessment(userId: string, skillId: string, score: number) {
    const existing = await prisma.userSkillAssessment.findFirst({
      where: {
        userId,
        skillId,
      },
    });

    if (existing) {
      return prisma.userSkillAssessment.update({
        where: { id: existing.id },
        data: {
          scoreCurrent: score,
          updatedAt: new Date(),
        },
      });
    }

    return prisma.userSkillAssessment.create({
      data: {
        userId,
        skillId,
        scoreInitial: score,
        scoreCurrent: score,
      },
    });
  },

  async getUserAssessments(userId: string) {
    return prisma.userSkillAssessment.findMany({
      where: { userId },
      include: {
        skill: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  async getAssessmentBySkill(userId: string, skillId: string) {
    return prisma.userSkillAssessment.findFirst({
      where: {
        userId,
        skillId,
      },
      include: {
        skill: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
  },
};

