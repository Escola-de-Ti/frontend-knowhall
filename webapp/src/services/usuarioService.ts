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
  tipoUsuario: 'ALUNO' | 'PROFESSOR' | 'ADMIN';
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
      const response = await apiService.get<UsuarioResponseDTO[]>(
        API_CONFIG.ENDPOINTS.USUARIOS
      );
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
      await apiService.delete<void>(
        `${API_CONFIG.ENDPOINTS.USUARIOS}/${id}`
      );
    } catch (error: any) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
}

export const usuarioService = new UsuarioService();
export type { UsuarioCreateDTO, UsuarioUpdateDTO, UsuarioResponseDTO };