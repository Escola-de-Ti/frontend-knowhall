/* eslint-disable @typescript-eslint/no-explicit-any */
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
  imagens?: any[];
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

export type OrderByOption = 'RELEVANCE' | 'UPVOTES_DESC' | 'UPVOTES_ASC' | 'DATE_DESC' | 'DATE_ASC';

export interface FeedRequestParams {
  pageSize?: number;
  lastPostId?: string;
  lastScore?: number;
  orderBy?: OrderByOption;
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

export interface ImagemPostDetalhesDTO {
  id: number;
  imagemId: number;
  urlImagem: string;
  ordemImagem: number;
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
  urlsImagens?: ImagemPostDetalhesDTO[]
}

export interface PostUpdateDTO {
  titulo?: string;
  descricao?: string;
  tagIds?: number[];
}

export interface PostSearchResponseDTO {
  posts: PostResponseDTO[];
  hasMore: boolean;
  lastPostId: number;
  lastValue: number;
}

export interface PostSearchParams {
  termo: string;
  pageSize?: number;
  lastPostId?: number;
  lastValue?: number;
}

class PostService {
  async criar(dados: PostCreateDTO): Promise<PostResponseDTO> {
    return apiService.post<PostResponseDTO>(API_CONFIG.ENDPOINTS.POSTS, dados, true);
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
    const { pageSize = 10, lastPostId, lastScore, orderBy = 'RELEVANCE' } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('pageSize', pageSize.toString());
    queryParams.append('orderBy', orderBy);

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

  async listarTodos(): Promise<PostResponseDTO[]> {
    try {
      const response = await apiService.get<PostResponseDTO[]>(API_CONFIG.ENDPOINTS.POSTS, true);
      return response;
    } catch (error: any) {
      console.error('Erro ao listar posts:', error);
      throw error;
    }
  }

  async buscarPorId(id: string): Promise<PostResponseDTO> {
    try {
      const response = await apiService.get<PostResponseDTO>(
        `${API_CONFIG.ENDPOINTS.POSTS}/${id}`,
        true
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao buscar post:', error);
      throw error;
    }
  }

  async buscarPorUsuario(usuarioId: string): Promise<PostResponseDTO[]> {
    try {
      const response = await apiService.get<PostResponseDTO[]>(
        `${API_CONFIG.ENDPOINTS.POSTS}/usuario/${usuarioId}`,
        true
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao buscar posts do usuário:', error);
      throw error;
    }
  }

  async atualizar(id: string, dados: PostUpdateDTO): Promise<PostResponseDTO> {
    try {
      const response = await apiService.patch<PostResponseDTO>(
        `${API_CONFIG.ENDPOINTS.POSTS}/${id}`,
        dados,
        true
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao atualizar post:', error);
      throw error;
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await apiService.delete<void>(`${API_CONFIG.ENDPOINTS.POSTS}/${id}`, true);
    } catch (error: any) {
      console.error('Erro ao deletar post:', error);
      throw error;
    }
  }

  async buscarPorTermo(params: PostSearchParams): Promise<PostSearchResponseDTO> {
    try {
      const { termo, pageSize = 10, lastPostId, lastValue } = params;

      const queryParams = new URLSearchParams();
      queryParams.append('termo', termo);
      queryParams.append('pageSize', pageSize.toString());

      if (lastPostId && lastValue !== undefined) {
        queryParams.append('lastPostId', lastPostId.toString());
        queryParams.append('lastValue', lastValue.toString());
      }

      const endpoint = `${API_CONFIG.ENDPOINTS.POSTS}/buscar?${queryParams.toString()}`;
      const response = await apiService.get<PostSearchResponseDTO>(endpoint, true);
      return response;
    } catch (error: any) {
      console.error('Erro ao buscar posts por termo:', error);
      throw error;
    }
  }

  async getPostDetailsComPaginacao(
    id: number,
    pageSize: number = 10,
    lastComentarioId?: number
  ): Promise<PostDetalhesDTO> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('pageSize', pageSize.toString());

      if (lastComentarioId) {
        queryParams.append('lastComentarioId', lastComentarioId.toString());
      }

      const endpoint = `${API_CONFIG.ENDPOINTS.POSTS}/${id}/detalhes?${queryParams.toString()}`;
      const response = await apiService.get<PostDetalhesDTO>(endpoint, true);
      return response;
    } catch (error: any) {
      console.error('Erro ao buscar detalhes do post:', error);
      throw error;
    }
  }
}

export const postService = new PostService();
