const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  API_PREFIX: '/api',
  ENDPOINTS: {
    // Usuários
    USUARIOS: '/usuarios',
    USUARIOS_USER: '/usuarios/user',
    LOGIN: '/usuarios/login',
    REFRESH: '/usuarios/refresh',
    USUARIOS_RANKING: '/usuarios/ranking',
    USUARIOS_DETALHES: '/usuarios/detalhes',

    // Posts
    POSTS: '/posts',
    POSTS_FEED: '/posts/feed',
    POSTS_BUSCAR: '/posts/buscar',

    // Tags
    TAGS: '/tags',
    TAGS_POPULAR: '/tags/popular',

    // Conquistas
    CONQUISTAS: '/conquistas',
    CONQUISTAS_CAMPO: '/conquistas/campo',

    // Workshops
    WORKSHOPS: '/workshops',

    // Imagem
    IMAGEM_UPLOAD: '/imagem/upload',
    IMAGEM_DELETE: '/imagem/delete',
    IMAGEM_UPDATE: '/imagem/update',

    // Comentários
    COMENTARIOS: '/comentarios',
    COMENTARIOS_POST: '/comentarios/post',
    COMENTARIOS_RESPOSTAS: '/comentarios/:id/respostas',
    COMENTARIOS_USUARIO: '/comentarios/usuario',

    // Votos
    VOTOS: '/votos',

    // Inscrições
    INSCRICOES: '/inscricoes',
  },
  TIMEOUT: 30000,
};

/**
 * Constrói a URL completa para um endpoint
 * @param endpoint - Caminho do endpoint (ex: '/usuarios/user')
 * @returns URL completa (ex: 'http://localhost:8080/api/usuarios/user')
 */
export const buildApiUrl = (endpoint: string): string => {
  // Em desenvolvimento, usa apenas /api + endpoint (proxy do Vite cuida do resto)
  if (import.meta.env.DEV) {
    return `${API_CONFIG.API_PREFIX}${endpoint}`;
  }
  // Em produção, usa URL completa
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${endpoint}`;
};

/**
 * Retorna a URL base completa da API
 * @returns URL base (ex: 'http://localhost:8080/api')
 */
export const getApiBaseUrl = (): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}`;
};

export default API_CONFIG;
