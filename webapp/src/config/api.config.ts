const REACT_APP_API_BASE_URL = 'http://localhost:8080';

const API_CONFIG = {
  BASE_URL: REACT_APP_API_BASE_URL || 'http://localhost:8080',
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
 * @param endpoint - Caminho do endpoint (ex: '/posts')
 * @returns URL completa (ex: 'http://localhost:8080/api/posts')
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${endpoint}`;
};

export default API_CONFIG;
