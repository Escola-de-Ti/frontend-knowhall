// Configuração centralizada da API
const REACT_APP_API_BASE_URL = 'http://localhost:8080'

const API_CONFIG = {
  BASE_URL: REACT_APP_API_BASE_URL || 'http://localhost:8080',
  API_PREFIX: '/api',
  ENDPOINTS: {
    USUARIOS: '/usuarios',
    USUARIOS_USER: '/usuarios/user',
    LOGIN: '/usuarios/login',
    REFRESH: '/usuarios/refresh',
  },
  TIMEOUT: 30000,
};

export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${endpoint}`;
};

export default API_CONFIG;