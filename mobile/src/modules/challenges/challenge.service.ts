import { challengeRepository } from './challenge.repository';
import { Challenge } from '../../types';

export const challengeService = {
  async listBySkill(skillId: string): Promise<Challenge[]> {
    return challengeRepository.listBySkill(skillId);
  },

  async getById(id: string): Promise<Challenge> {
    return challengeRepository.getById(id);
  },
};

