import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../modules/auth/auth.service';
import type { LoginCredentials } from '../modules/auth/auth.repository';
import { storage } from '../config/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const isAuth = await authService.initializeAuth();
      if (isAuth) {
        const userData = await storage.getUser();
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Limpar dados inválidos
      await storage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    await authService.register(data);
    // Após registro, fazer login automaticamente
    await login({ email: data.email, password: data.password });
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshToken = async () => {
    await authService.refreshToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

