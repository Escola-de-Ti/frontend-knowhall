/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from './apiService';
import API_CONFIG from '../config/api.config';

interface UsuarioCreateDTO {
  email: string;
  cpf: string;
  telefone?: string;
  telefone2?: string;
  nome: string;
  biografia?: string;
  senha: string;
  imageBase64?: string;
  tipoUsuario: 'ALUNO' | 'INSTRUTOR' | 'ADMINISTRADOR';
  tags?: any[];
}

interface UsuarioUpdateDTO {
  email?: string;
  telefone?: string;
  telefone2?: string;
  nome?: string;
  biografia?: string;
  senha?: string;
  imageBase64?: string;
  tags?: any[];
}

interface UsuarioResponseDTO {
  id: string;
  email: string;
  nome: string;
  biografia?: string;
  telefone?: string;
  telefone2?: string;
  statusUsuario: string;
  tipoUsuario: string;
  qntdToken: number;
  qntdXp: number;
  idImagemPerfil?: string;
  tags: string[];
}

interface RankingUsuarioDTO {
  id: number;
  posicao: number;
  nome: string;
  qntdXp: number;
  nivel: number;
}

interface RankingResponseDTO {
  rankingList: RankingUsuarioDTO[];
  usuarioLogado: {
    posicao: number;
    xpRecebidoUltimos30Dias: number;
  };
}

interface TagDTO {
  id: number;
  name: string;
}

interface UsuarioDetalhesDTO {
  nome: string;
  tags: TagDTO[];
  biografia: string;
  nivel: number;
  xp: number;
  tokens: number;
  qtdPosts: number;
  qtdComentarios: number;
  qtdUpVotes: number;
  qtdSuperVotes: number;
  qtdWorkshops: number;
  imagemUrl: string | null;
  posicaoRanking: number;
}

interface RefreshTokenDTO {
  refresh_token: string;
}

interface TokenResponseDTO {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

class UsuarioService {
  async criar(dados: UsuarioCreateDTO): Promise<UsuarioResponseDTO> {
    try {
      const response = await apiService.post<UsuarioResponseDTO>(
        API_CONFIG.ENDPOINTS.USUARIOS,
        dados,
        false
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async listar(): Promise<UsuarioResponseDTO[]> {
    try {
      const response = await apiService.get<UsuarioResponseDTO[]>(API_CONFIG.ENDPOINTS.USUARIOS);
      return response;
    } catch (error: any) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  }

  async buscarPorId(id: string): Promise<UsuarioResponseDTO> {
    try {
      const response = await apiService.get<UsuarioResponseDTO>(
        `${API_CONFIG.ENDPOINTS.USUARIOS}/${id}`
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  async atualizarUsuarioAutenticado(dados: UsuarioUpdateDTO): Promise<UsuarioResponseDTO> {
    try {
      const response = await apiService.put<UsuarioResponseDTO>(
        API_CONFIG.ENDPOINTS.USUARIOS_USER,
        dados
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await apiService.delete<void>(`${API_CONFIG.ENDPOINTS.USUARIOS}/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponseDTO> {
    try {
      const response = await apiService.post<TokenResponseDTO>(
        API_CONFIG.ENDPOINTS.REFRESH,
        { refresh_token: refreshToken },
        false
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao fazer refresh do token:', error);
      throw error;
    }
  }

  async buscarRanking(): Promise<RankingResponseDTO> {
    try {
      const response = await apiService.get<RankingResponseDTO>(
        `${API_CONFIG.ENDPOINTS.USUARIOS}/ranking`
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao buscar ranking:', error);
      throw error;
    }
  }

  async buscarDetalhesUsuario(id: string): Promise<UsuarioDetalhesDTO> {
    try {
      const response = await apiService.get<UsuarioDetalhesDTO>(
        `${API_CONFIG.ENDPOINTS.USUARIOS}/detalhes/${id}`
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao buscar detalhes do usuário:', error);
      throw error;
    }
  }
}

export const usuarioService = new UsuarioService();
export type {
  UsuarioCreateDTO,
  UsuarioUpdateDTO,
  UsuarioResponseDTO,
  RankingUsuarioDTO,
  RankingResponseDTO,
  TagDTO,
  UsuarioDetalhesDTO,
  RefreshTokenDTO,
  TokenResponseDTO,
};
