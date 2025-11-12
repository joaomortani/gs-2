import { progressRepository } from './progress.repository';
import { CompleteChallengeDTO } from './progress.dto';
import { NotFoundError } from '../../lib/errors';
import { prisma } from '../../config/prisma';

export const progressService = {
  async completeChallenge(userId: string, challengeId: string, data: CompleteChallengeDTO) {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        skill: true,
      },
    });

    if (!challenge) {
      throw new NotFoundError('Challenge not found');
    }

    if (!challenge.skill.isActive) {
      throw new NotFoundError('Skill is not active');
    }

    const existing = await progressRepository.getByUserAndChallenge(userId, challengeId);
    if (existing && existing.status === 'done') {
      return existing;
    }

    return progressRepository.upsertDone(userId, challengeId, new Date());
  },

  async reopenChallenge(userId: string, challengeId: string) {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundError('Challenge not found');
    }

    const existing = await progressRepository.getByUserAndChallenge(userId, challengeId);
    if (!existing) {
      return { success: true };
    }

    await progressRepository.reopen(userId, challengeId);
    return { success: true };
  },

  async getUserProgress(userId: string) {
    const skills = await progressRepository.aggregateUserProgress(userId);
    return { skills };
  },

  async getHistory(userId: string, limit: number) {
    return progressRepository.listRecent(userId, limit);
  },
};

