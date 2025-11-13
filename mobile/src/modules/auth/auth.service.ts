import { authRepository, type LoginCredentials, type AuthResponse } from './auth.repository';
import { storage } from '../../config/storage';
import api from '../../config/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await authRepository.login(credentials);
    
    // Salvar tokens e usuário
    await storage.setToken(response.token);
    await storage.setRefreshToken(response.refreshToken);
    await storage.setUser(response.user);
    
    // Configurar header de autenticação
    api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
    
    return response;
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = await storage.getRefreshToken();
      if (refreshToken) {
        await authRepository.logout(refreshToken);
      }
    } catch (error) {
      // Continuar mesmo se a chamada falhar
    }
    
    // Limpar dados locais
    await storage.clear();
    delete api.defaults.headers.common['Authorization'];
  },

  async refreshToken(): Promise<string | null> {
    const refreshToken = await storage.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await authRepository.refreshToken(refreshToken);
      await storage.setToken(response.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      return response.token;
    } catch (error) {
      await storage.clear();
      return null;
    }
  },

  async register(data: { name: string; email: string; password: string }): Promise<User> {
    return authRepository.register(data);
  },

  async initializeAuth(): Promise<boolean> {
    const token = await storage.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Validar token verificando o usuário
      try {
        const user = await authRepository.getMe();
        await storage.setUser(user);
        return true;
      } catch (error) {
        // Token inválido, tentar refresh
        const newToken = await this.refreshToken();
        return !!newToken;
      }
    }
    return false;
  },
};

