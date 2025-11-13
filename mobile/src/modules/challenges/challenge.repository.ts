import api from '../../config/api';
import { Challenge } from '../../types';
import { ApiResponse } from '../../types/api';

export const challengeRepository = {
  async listBySkill(skillId: string): Promise<Challenge[]> {
    const response = await api.get<ApiResponse<{ items: Challenge[]; total: number }>>(
      `/skills/${skillId}/challenges`
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error.message || 'Failed to fetch challenges');
    }

    return response.data.data.items;
  },

  async getById(id: string): Promise<Challenge> {
    const response = await api.get<ApiResponse<Challenge>>(`/challenges/${id}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error.message || 'Challenge not found');
    }

    return response.data.data;
  },
};

