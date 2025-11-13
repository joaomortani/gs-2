import api from '@/config/api';
import type { AxiosResponse } from 'axios';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Skills
export interface Skill {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillRequest {
  name: string;
  description: string;
  isActive?: boolean;
}

export interface UpdateSkillRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// Challenges
export interface Challenge {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  skillId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChallengeRequest {
  title: string;
  description: string;
  orderIndex: number;
}

export interface UpdateChallengeRequest {
  title?: string;
  description?: string;
  orderIndex?: number;
}

// Admin
export interface AdminOverview {
  users: number;
  skills: number;
  challenges: number;
  completionsLast30d: number;
}

// Users
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
}

// API Client functions
export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/register', data);
    return response.data;
  },
  me: async (): Promise<ApiResponse<LoginResponse['user']>> => {
    const response = await api.get<ApiResponse<LoginResponse['user']>>('/auth/me');
    return response.data;
  },
  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/auth/logout', { refreshToken });
  },
};

export const skillsApi = {
  list: async (params?: { isActive?: boolean; page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<Skill>>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Skill>>>('/skills', { params });
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<Skill>> => {
    const response = await api.get<ApiResponse<Skill>>(`/skills/${id}`);
    return response.data;
  },
  create: async (data: CreateSkillRequest): Promise<ApiResponse<Skill>> => {
    const response = await api.post<ApiResponse<Skill>>('/skills', data);
    return response.data;
  },
  update: async (id: string, data: UpdateSkillRequest): Promise<ApiResponse<Skill>> => {
    const response = await api.put<ApiResponse<Skill>>(`/skills/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/skills/${id}`);
  },
};

export interface SkillWithProgress extends Skill {
  progress?: {
    completed: number;
    total: number;
    percentage: number;
    challenges?: Array<{
      challengeId: string;
      status: string;
    }>;
  };
}

export const challengesApi = {
  listBySkill: async (skillId: string, params?: { page?: number; limit?: number; sort?: string }): Promise<ApiResponse<PaginatedResponse<Challenge>>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Challenge>>>(`/skills/${skillId}/challenges`, { params });
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<Challenge>> => {
    const response = await api.get<ApiResponse<Challenge>>(`/challenges/${id}`);
    return response.data;
  },
  create: async (skillId: string, data: CreateChallengeRequest): Promise<ApiResponse<Challenge>> => {
    const response = await api.post<ApiResponse<Challenge>>(`/skills/${skillId}/challenges`, data);
    return response.data;
  },
  update: async (id: string, data: UpdateChallengeRequest): Promise<ApiResponse<Challenge>> => {
    const response = await api.put<ApiResponse<Challenge>>(`/challenges/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/challenges/${id}`);
  },
};

export const adminApi = {
  getOverview: async (): Promise<ApiResponse<AdminOverview>> => {
    const response = await api.get<ApiResponse<AdminOverview>>('/admin/overview');
    return response.data;
  },
  getUserAssessments: async (userId: string): Promise<ApiResponse<{ assessments: Assessment[] }>> => {
    const response = await api.get<ApiResponse<{ assessments: Assessment[] }>>(`/admin/users/${userId}/assessments`);
    return response.data;
  },
  getUserProgress: async (userId: string): Promise<ApiResponse<{ progress: any[] }>> => {
    const response = await api.get<ApiResponse<{ progress: any[] }>>(`/admin/users/${userId}/progress`);
    return response.data;
  },
};

// Progress
export interface ProgressRequest {
  notes?: string;
}

export const progressApi = {
  completeChallenge: async (challengeId: string, data: ProgressRequest): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>(`/challenges/${challengeId}/complete`, data);
    return response.data;
  },
  getUserProgress: async (): Promise<ApiResponse<{ skills: SkillWithProgress[] }>> => {
    const response = await api.get<ApiResponse<{ skills: SkillWithProgress[] }>>('/me/progress');
    return response.data;
  },
  getHistory: async (limit?: number): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`/me/history${limit ? `?limit=${limit}` : ''}`);
    return response.data;
  },
};

export const usersApi = {
  list: async (params?: { page?: number; limit?: number; search?: string; isActive?: boolean }): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>('/users', { params });
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },
  create: async (data: CreateUserRequest): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>('/users', data);
    return response.data;
  },
  update: async (id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },
};

// Assessment
export interface Assessment {
  id: string;
  userId: string;
  skillId: string;
  scoreInitial: number;
  scoreCurrent: number;
  createdAt: string;
  updatedAt: string;
  skill?: {
    id: string;
    name: string;
    description: string;
  };
}

export interface SubmitAssessmentRequest {
  skillId: string;
  score: number;
}

export interface SubmitAssessmentsRequest {
  assessments: SubmitAssessmentRequest[];
}

export const assessmentApi = {
  submitAssessment: async (data: SubmitAssessmentRequest): Promise<ApiResponse<Assessment>> => {
    const response = await api.post<ApiResponse<Assessment>>('/assessment/submit', data);
    return response.data;
  },
  submitAssessments: async (data: SubmitAssessmentsRequest): Promise<ApiResponse<{ assessments: Assessment[] }>> => {
    const response = await api.post<ApiResponse<{ assessments: Assessment[] }>>('/assessment/submit-multiple', data);
    return response.data;
  },
  getUserAssessments: async (): Promise<ApiResponse<{ assessments: Assessment[] }>> => {
    const response = await api.get<ApiResponse<{ assessments: Assessment[] }>>('/assessment/me');
    return response.data;
  },
  getAssessmentBySkill: async (skillId: string): Promise<ApiResponse<Assessment>> => {
    const response = await api.get<ApiResponse<Assessment>>(`/assessment/skill/${skillId}`);
    return response.data;
  },
};

