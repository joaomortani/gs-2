import api from '../../config/api';
import { User } from '../types';
import { ApiResponse } from '../types/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export const authRepository = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error.message || 'Login failed');
    }

    const { user, accessToken, refreshToken } = response.data.data;
    
    // Normalizar para o formato esperado pelo mobile
    return {
      user,
      token: accessToken,
      refreshToken,
    };
  },

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', {
      refreshToken,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error.message || 'Token refresh failed');
    }

    return {
      token: response.data.data.accessToken,
    };
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken });
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error.message || 'Failed to get user');
    }

    return response.data.data;
  },

  async register(data: { name: string; email: string; password: string }): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/auth/register', data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error.message || 'Registration failed');
    }

    return response.data.data;
  },
};

