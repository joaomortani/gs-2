import { adminRepository } from './admin.repository';
import { NotFoundError } from '../../lib/errors';

export const adminService = {
  async getOverview() {
    const [users, skills, challenges, completionsLast30d] = await Promise.all([
      adminRepository.countUsers(),
      adminRepository.countActiveSkills(),
      adminRepository.countChallenges(),
      adminRepository.countCompletionsLast30d(),
    ]);

    return {
      users,
      skills,
      challenges,
      completionsLast30d,
    };
  },

  async getUserAssessments(userId: string) {
    const assessments = await adminRepository.getUserAssessments(userId);
    return assessments;
  },

  async getUserProgress(userId: string) {
    const progress = await adminRepository.getUserProgress(userId);
    return progress;
  },
};

