import api from '../../config/api';
import { Skill } from '../../types';
import { ApiResponse } from '../../types/api';

export const skillRepository = {
  async list(isActive?: boolean): Promise<Skill[]> {
    const params = isActive !== undefined ? { isActive } : {};
    const response = await api.get<ApiResponse<{ items: Skill[]; total: number }>>('/skills', { params });
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error.message || 'Failed to fetch skills');
    }

    return response.data.data.items;
  },

  async getById(id: string): Promise<Skill> {
    const response = await api.get<ApiResponse<Skill>>(`/skills/${id}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error.message || 'Skill not found');
    }

    return response.data.data;
  },
};

