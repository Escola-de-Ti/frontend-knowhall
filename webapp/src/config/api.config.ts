const REACT_APP_API_BASE_URL = 'http://localhost:8080'

// src/config/api.config.ts

// src/config/api.config.ts

const API_CONFIG = {
  BASE_URL: REACT_APP_API_BASE_URL || 'http://localhost:8080',
  API_PREFIX: '/api',
  ENDPOINTS: {
    // Usuários
    USUARIOS: '/usuarios',
    USUARIOS_USER: '/usuarios/user',
    LOGIN: '/usuarios/login',
    REFRESH: '/usuarios/refresh',
    
    // Posts
    POSTS: '/posts',
    
    // Tags
    TAGS: '/tags',
    TAGS_POPULAR: '/tags/popular',
    
    // Votos ← NOVO
    VOTOS: '/votos',
  },
  TIMEOUT: 30000,
};

/**
 * Constrói a URL completa para um endpoint
 * @param endpoint - Caminho do endpoint (ex: '/posts')
 * @returns URL completa (ex: 'http://localhost:8080/api/posts')
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${endpoint}`;
};

export default API_CONFIG;