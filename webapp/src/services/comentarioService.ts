import { apiService } from './apiService';
import API_CONFIG from '../config/api.config';

// ============================================================
// TIPOS E INTERFACES
// ============================================================

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

export interface ComentarioPaginadoResponseDTO {
  comentarios: ComentarioResponseDTO[];
  hasMore: boolean;
  lastComentarioId: number;
}

export interface CreateComentarioDTO {
  postId: number;
  texto: string;
  comentarioPaiId?: number | null;
}

export interface UpdateComentarioDTO {
  texto: string;
}

export interface ComentarioUsuarioDTO {
  comentarioId: number;
  postId: number;
  texto: string;
}

// ============================================================
// SERVIÇO DE COMENTÁRIOS
// ============================================================

class ComentarioService {
  /**
   * Cria um novo comentário para um post
   */
  async criar(data: CreateComentarioDTO): Promise<ComentarioResponseDTO> {
    try {
      return await apiService.post<ComentarioResponseDTO>(
        API_CONFIG.ENDPOINTS.COMENTARIOS,
        data
      );
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      throw error;
    }
  }

  /**
   * Responde a um comentário existente
   */
  async responder(data: CreateComentarioDTO): Promise<ComentarioResponseDTO> {
    try {
      return await apiService.post<ComentarioResponseDTO>(
        API_CONFIG.ENDPOINTS.COMENTARIOS,
        data
      );
    } catch (error) {
      console.error('Erro ao responder comentário:', error);
      throw error;
    }
  }

  /**
   * Busca comentários de um post (sem paginação)
   */
  async buscarPorPost(
    postId: number,
    pageSize: number = 20
  ): Promise<ComentarioPaginadoResponseDTO> {
    try {
      return await apiService.get<ComentarioPaginadoResponseDTO>(
        `${API_CONFIG.ENDPOINTS.COMENTARIOS_POST}/${postId}?pageSize=${pageSize}`
      );
    } catch (error) {
      console.error('Erro ao buscar comentários do post:', error);
      throw error;
    }
  }

  /**
   * Busca comentários de um post com paginação
   */
  async buscarPorPostPaginado(
    postId: number,
    pageSize: number = 20,
    lastComentarioId?: number
  ): Promise<ComentarioPaginadoResponseDTO> {
    try {
      let url = `${API_CONFIG.ENDPOINTS.COMENTARIOS_POST}/${postId}?pageSize=${pageSize}`;
      if (lastComentarioId) {
        url += `&lastComentarioId=${lastComentarioId}`;
      }
      return await apiService.get<ComentarioPaginadoResponseDTO>(url);
    } catch (error) {
      console.error('Erro ao buscar comentários paginados do post:', error);
      throw error;
    }
  }

  /**
   * Busca respostas de um comentário (sem paginação)
   */
  async buscarRespostas(
    comentarioId: number,
    pageSize: number = 10
  ): Promise<ComentarioPaginadoResponseDTO> {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.COMENTARIOS_RESPOSTAS.replace(
        ':id',
        comentarioId.toString()
      );
      return await apiService.get<ComentarioPaginadoResponseDTO>(
        `${endpoint}?pageSize=${pageSize}`
      );
    } catch (error) {
      console.error('Erro ao buscar respostas do comentário:', error);
      throw error;
    }
  }

  /**
   * Busca respostas de um comentário com paginação
   */
  async buscarRespostasPaginado(
    comentarioId: number,
    pageSize: number = 10,
    lastComentarioId?: number
  ): Promise<ComentarioPaginadoResponseDTO> {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.COMENTARIOS_RESPOSTAS.replace(
        ':id',
        comentarioId.toString()
      );
      let url = `${endpoint}?pageSize=${pageSize}`;
      if (lastComentarioId) {
        url += `&lastComentarioId=${lastComentarioId}`;
      }
      return await apiService.get<ComentarioPaginadoResponseDTO>(url);
    } catch (error) {
      console.error('Erro ao buscar respostas paginadas do comentário:', error);
      throw error;
    }
  }

  /**
   * Atualiza o texto de um comentário
   */
  async atualizar(
    comentarioId: number,
    data: UpdateComentarioDTO
  ): Promise<ComentarioResponseDTO> {
    try {
      return await apiService.patch<ComentarioResponseDTO>(
        `${API_CONFIG.ENDPOINTS.COMENTARIOS}/${comentarioId}`,
        data
      );
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error);
      throw error;
    }
  }

  /**
   * Deleta um comentário
   */
  async deletar(comentarioId: number): Promise<void> {
    try {
      await apiService.delete<void>(
        `${API_CONFIG.ENDPOINTS.COMENTARIOS}/${comentarioId}`
      );
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      throw error;
    }
  }

  /**
   * Lista todos os comentários de um usuário
   */
  async listarPorUsuario(usuarioId: number): Promise<ComentarioUsuarioDTO[]> {
    try {
      return await apiService.get<ComentarioUsuarioDTO[]>(
        `${API_CONFIG.ENDPOINTS.COMENTARIOS_USUARIO}/${usuarioId}`
      );
    } catch (error) {
      console.error('Erro ao listar comentários do usuário:', error);
      throw error;
    }
  }

  // ============================================================
  // MÉTODOS UTILITÁRIOS
  // ============================================================

  /**
   * Verifica se um comentário é uma resposta
   */
  isResposta(comentario: ComentarioResponseDTO): boolean {
    return comentario.comentarioPaiId !== null;
  }

  /**
   * Formata a data de criação do comentário
   */
  formatarDataCriacao(dataCriacao: string): string {
    const data = new Date(dataCriacao);
    const agora = new Date();
    const diffMs = agora.getTime() - data.getTime();
    const diffMinutos = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMinutos < 1) return 'agora';
    if (diffMinutos < 60) return `${diffMinutos}m`;
    if (diffHoras < 24) return `${diffHoras}h`;
    if (diffDias < 7) return `${diffDias}d`;
    
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Calcula o total de votos de um comentário
   */
  calcularTotalVotos(comentario: ComentarioResponseDTO): number {
    return comentario.totalUpVotes + comentario.totalSuperVotes;
  }

  /**
   * Verifica se o comentário foi editado (baseado na estrutura de resposta)
   */
  foiEditado(comentario: ComentarioResponseDTO): boolean {
    // Se a API retornar dataAtualizacao no futuro, podemos implementar:
    // return comentario.dataAtualizacao && comentario.dataAtualizacao !== comentario.dataCriacao;
    return false; // Por enquanto, não temos essa informação
  }
}

export const comentarioService = new ComentarioService();
export default comentarioService;
