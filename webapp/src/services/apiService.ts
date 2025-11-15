/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { authService } from './authService';
import { buildApiUrl } from '../config/api.config';
import toast from 'react-hot-toast';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  isRetry?: boolean;
}

class ApiService {

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = true, isRetry = false, headers = {}, ...restOptions } = options;

    const config: RequestInit = {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (requiresAuth) {
      const token = authService.getAccessToken();

      if (!token) {
        authService.logout();
        const msg = 'Sessão inválida. Faça login novamente.';
        toast.error(msg);
        throw new Error(msg);
      }

      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const url = buildApiUrl(endpoint);

    try {
      const response = await fetch(url, config);

      if (response.status === 401 && requiresAuth && !isRetry) {
        try {
          await authService.refreshAccessToken();
          return this.request<T>(endpoint, { ...options, isRetry: true });
        } catch (error) {
          authService.logout();
          const msg = 'Sessão expirada. Faça login novamente.';
          toast.error(msg);
          throw new Error(msg);
        }
      }

      if (response.status === 401) {
        authService.logout();
        const msg = 'Não autorizado. Verifique suas credenciais.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        const errorMessage = errorData.message || `Erro na requisição: ${response.status}`;
        
        toast.error(errorMessage);

      if (response.status === 204) {
        return undefined as T;
      }
        throw new Error(errorMessage);
      }

        return response.json();

      } catch (error: any) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          const networkMsg = 'Sem conexão com o servidor. Verifique sua internet.';
          toast.error(networkMsg);
          throw new Error(networkMsg);
        }

        throw error;
    }
  }


  get<T>(endpoint: string, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', requiresAuth });
  }

  post<T>(endpoint: string, data: any, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  put<T>(endpoint: string, data: any, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  patch<T>(endpoint: string, data: any, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  delete<T>(endpoint: string, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', requiresAuth });
  }
}

export const apiService = new ApiService();