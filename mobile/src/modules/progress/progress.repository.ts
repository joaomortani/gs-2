import api from '../../config/api';
import { ChallengeProgress, SkillWithProgress } from '../../types';
import { ApiResponse } from '../../types/api';

export const progressRepository = {
  async completeChallenge(
    challengeId: string,
    data: { notes?: string }
  ): Promise<ChallengeProgress> {
    const response = await api.post<ApiResponse<ChallengeProgress>>(
      `/challenges/${challengeId}/complete`,
      data
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error.message || 'Failed to complete challenge');
    }

    return response.data.data;
  },

  async reopenChallenge(challengeId: string): Promise<void> {
    const response = await api.delete<ApiResponse<{ success: boolean }>>(
      `/challenges/${challengeId}/complete`
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error.message || 'Failed to reopen challenge');
    }
  },

  async getUserProgress(): Promise<{ skills: SkillWithProgress[] }> {
    const response = await api.get<ApiResponse<{ skills: SkillWithProgress[] }>>('/me/progress');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error.message || 'Failed to fetch progress');
    }

    return response.data.data;
  },

  async getHistory(limit: number = 10): Promise<ChallengeProgress[]> {
    const response = await api.get<ApiResponse<ChallengeProgress[]>>(`/me/history?limit=${limit}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error.message || 'Failed to fetch history');
    }

    // O backend agora retorna um array direto
    const history = response.data.data;
    return Array.isArray(history) ? history : [];
  },
};

