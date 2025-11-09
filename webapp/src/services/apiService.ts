// Serviço centralizado para requisições à API com autenticação

import { authService } from './authService';
import { buildApiUrl } from '../config/api.config';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  isRetry?: boolean; // Flag para evitar loop infinito
}

class ApiService {
  /**
   * Faz uma requisição autenticada com retry automático em caso de token expirado
   */
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

    // Adiciona o token de autenticação se necessário
    if (requiresAuth) {
      const token = authService.getAccessToken();

      if (!token) {
        authService.logout();
        throw new Error('Token não encontrado. Faça login novamente.');
      }

      // Adiciona o token no header Authorization
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const url = buildApiUrl(endpoint);
    const response = await fetch(url, config);

    // Se retornar 401 (Unauthorized) e não for uma retry
    if (response.status === 401 && requiresAuth && !isRetry) {
      try {
        // Tenta renovar o token
        await authService.refreshAccessToken();

        // Tenta a requisição novamente com o novo token
        return this.request<T>(endpoint, { ...options, isRetry: true });
      } catch (error) {
        // Se falhar ao renovar, faz logout
        authService.logout();
        throw new Error('Sessão expirada. Faça login novamente.');
      }
    }

    // Se retornar 401 após retry, faz logout
    if (response.status === 401 && isRetry) {
      authService.logout();
      throw new Error('Não autorizado. Faça login novamente.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
    }

    return response.json();
  }

  // Métodos auxiliares
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