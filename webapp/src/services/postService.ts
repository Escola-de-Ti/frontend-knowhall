import { apiService } from './apiService';
import API_CONFIG from '../config/api.config';
import { TagResponseDTO } from './tagService';

export interface PostCreateDTO {
  titulo: string;
  descricao: string;
  tagIds: string[];
}

export interface PostResponseDTO {
  id: string;
  usuarioId: string;
  nomeUsuario: string;
  titulo: string;
  descricao: string;
  totalUpVotes: number;
  tags: TagResponseDTO[];
  dataCriacao: string;
}

export interface PostFormData {
  titulo: string;
  descricao: string;
  tags: string[];
}

export interface PostFeedDTO {
  id: string;
  usuarioId: string;
  nomeUsuario: string;
  titulo: string;
  descricao: string;
  totalUpVotes: number;
  tags: TagResponseDTO[];
  dataCriacao: string; 
  relevanceScore: number;
  tagsEmComum: number;
  jaVotou: boolean;
}

export interface FeedResponseDTO {
  posts: PostFeedDTO[];
  hasMore: boolean;
  lastPostId: string;
  lastScore: number;
}

export interface FeedRequestParams {
  pageSize?: number;
  lastPostId?: string;
  lastScore?: number;
}

interface ValidationErrors {
  titulo?: string;
  descricao?: string;
  tags?: string;
}

export interface ComentarioResponseDTO {
  id: number;
  postId: number;
  usuarioId: number;
  usuarioNome: string;
  texto: string;
  totalUpVotes: number;
  totalSuperVotes: number;
  comentarioPaiId: number | null;
  dataCriacao: string;
}

export interface PostDetalhesDTO {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  titulo: string;
  descricao: string;
  totalUpVotes: number;
  tags: TagResponseDTO[];
  dataCriacao: string;
  comentarios: ComentarioResponseDTO[];
  hasMoreComentarios: boolean;
}

class PostService {
  async criar(dados: PostCreateDTO): Promise<PostResponseDTO> {
    return apiService.post<PostResponseDTO>(
      API_CONFIG.ENDPOINTS.POSTS,
      dados,
      true
    );
  }

  validateFormData(data: PostFormData): string[] {
    const errors: string[] = [];

    if (!data.titulo.trim()) {
      errors.push('O título é obrigatório');
    } else if (data.titulo.length < 10) {
      errors.push('O título deve ter no mínimo 10 caracteres');
    } else if (data.titulo.length > 100) {
      errors.push('O título deve ter no máximo 100 caracteres');
    }

    if (data.descricao.trim() && data.descricao.length < 20) {
      errors.push('A descrição deve ter no mínimo 20 caracteres');
    } else if (data.descricao.length > 2500) {
      errors.push('A descrição deve ter no máximo 2500 caracteres');
    }

    return errors;
  }

  async getFeed(params: FeedRequestParams = {}): Promise<FeedResponseDTO> {
    const { pageSize = 10, lastPostId, lastScore } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('pageSize', pageSize.toString());

    if (lastPostId && lastScore !== undefined) {
      queryParams.append('lastPostId', lastPostId);
      queryParams.append('lastScore', lastScore.toString());
    }

    const endpoint = `${API_CONFIG.ENDPOINTS.POSTS}/feed?${queryParams.toString()}`;
    return apiService.get<FeedResponseDTO>(endpoint, true);
  }

  async getPostDetails(id: number): Promise<PostDetalhesDTO> {
    const response = await apiService.get<PostDetalhesDTO>(`/posts/${id}/detalhes`);
    return response;
  }
}

export const postService = new PostService();