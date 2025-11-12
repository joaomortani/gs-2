import { adminRepository } from './admin.repository';

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
};

