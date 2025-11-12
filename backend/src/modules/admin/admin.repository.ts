import { prisma } from '../../config/prisma';

export const adminRepository = {
  async countUsers() {
    return prisma.user.count();
  },

  async countActiveSkills() {
    return prisma.skill.count({
      where: { isActive: true },
    });
  },

  async countChallenges() {
    return prisma.challenge.count();
  },

  async countCompletionsLast30d() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return prisma.userChallengeProgress.count({
      where: {
        status: 'done',
        doneAt: {
          gte: thirtyDaysAgo,
        },
      },
    });
  },
};

