import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Não tentar refresh em rotas de auth para evitar loop infinito
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
          // Usar axios diretamente para evitar loop com o interceptor
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const { accessToken } = response.data.data;
          if (accessToken) {
            Cookies.set('accessToken', accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Se o refresh falhar, limpar tokens e redirecionar para login
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

