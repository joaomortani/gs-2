import { progressRepository } from './progress.repository';
import { ChallengeProgress, SkillWithProgress } from '../../types';

export const progressService = {
  async completeChallenge(
    challengeId: string,
    data: { notes?: string }
  ): Promise<ChallengeProgress> {
    return progressRepository.completeChallenge(challengeId, data);
  },

  async reopenChallenge(challengeId: string): Promise<void> {
    return progressRepository.reopenChallenge(challengeId);
  },

  async getUserProgress(): Promise<{ skills: SkillWithProgress[] }> {
    return progressRepository.getUserProgress();
  },

  async getHistory(limit: number = 10): Promise<ChallengeProgress[]> {
    return progressRepository.getHistory(limit);
  },
};

