import { skillRepository } from './skill.repository';
import { Skill, SkillWithProgress } from '../../types';

export const skillService = {
  async list(isActive: boolean = true): Promise<Skill[]> {
    return skillRepository.list(isActive);
  },

  async getById(id: string): Promise<Skill> {
    return skillRepository.getById(id);
  },
};

