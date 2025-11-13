import { prisma } from '../../config/prisma';

export const progressRepository = {
  async getByUserAndChallenge(userId: string, challengeId: string) {
    return prisma.userChallengeProgress.findFirst({
      where: {
        userId,
        challengeId,
      },
    });
  },

  async upsertDone(userId: string, challengeId: string, doneAt: Date) {
    const existing = await this.getByUserAndChallenge(userId, challengeId);
    
    if (existing) {
      return prisma.userChallengeProgress.update({
        where: { id: existing.id },
        data: {
          status: 'done',
          doneAt,
        },
      });
    }

    return prisma.userChallengeProgress.create({
      data: {
        userId,
        challengeId,
        status: 'done',
        doneAt,
      },
    });
  },

  async reopen(userId: string, challengeId: string) {
    return prisma.userChallengeProgress.updateMany({
      where: {
        userId,
        challengeId,
      },
      data: {
        status: 'pending',
        doneAt: null,
      },
    });
  },

  async deleteByUserAndChallenge(userId: string, challengeId: string) {
    return prisma.userChallengeProgress.deleteMany({
      where: {
        userId,
        challengeId,
      },
    });
  },

  async aggregateUserProgress(userId: string) {
    const skills = await prisma.skill.findMany({
      where: { isActive: true },
      include: {
        challenges: true,
      },
    });

    // Buscar todos os progressos do usuário de uma vez
    const allProgress = await prisma.userChallengeProgress.findMany({
      where: {
        userId,
        status: 'done',
      },
      include: {
        challenge: {
          select: {
            skillId: true,
          },
        },
      },
    });

    // Agrupar por skill
    const progressBySkill = new Map<string, number>();
    for (const progress of allProgress) {
      const skillId = progress.challenge.skillId;
      progressBySkill.set(skillId, (progressBySkill.get(skillId) || 0) + 1);
    }

    // Retornar no formato SkillWithProgress
    return skills.map((skill: typeof skills[0]) => {
      const total = skill.challenges.length;
      const completed = progressBySkill.get(skill.id) || 0;
      const percentage = total > 0 
        ? Math.round((completed / total) * 100)
        : 0;

      return {
        id: skill.id,
        name: skill.name,
        description: skill.description,
        isActive: skill.isActive,
        createdAt: skill.createdAt.toISOString(),
        updatedAt: skill.updatedAt.toISOString(),
        progress: {
          completed,
          total,
          percentage,
        },
      };
    });
  },

  async listRecent(userId: string, limit: number) {
    return prisma.userChallengeProgress.findMany({
      where: { 
        userId,
        status: 'done', // Retornar apenas desafios concluídos
      },
      take: limit,
      orderBy: { doneAt: 'desc' },
      include: {
        challenge: {
          include: {
            skill: true,
          },
        },
      },
    });
  },
};

