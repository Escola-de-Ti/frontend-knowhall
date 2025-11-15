import { apiService } from './apiService';
import API_CONFIG from '../config/api.config';

export type TagDTO = {
  id: number;
  name: string;
};

export type UsuarioDTO = {
  id: number;
  email: string;
  nome: string;
  biografia?: string;
  telefone?: string;
  telefone2?: string;
  statusUsuario?: string;
  tipoUsuario?: string;
  qntdToken?: number;
  qntdXp?: number;
  idImagemPerfil?: number;
  tags?: string[];
};

export type UsuarioDetalhesDTO = {
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
  imagemUrl: string;
};

export async function getUsuario(id: number) {
  return await apiService.get<UsuarioDTO>(`${API_CONFIG.ENDPOINTS.USUARIOS}/${id}`);
}

export async function getMyUser() {
  return await apiService.get<UsuarioDTO>(API_CONFIG.ENDPOINTS.USUARIOS_USER);
}

export async function getUsuarioDetalhes(id: number) {
  return await apiService.get<UsuarioDetalhesDTO>(
    `${API_CONFIG.ENDPOINTS.USUARIOS_DETALHES}/${id}`
  );
}

export async function updateUsuario(id: number, payload: Partial<UsuarioDTO>) {
  return await apiService.put<UsuarioDTO>(`${API_CONFIG.ENDPOINTS.USUARIOS}/${id}`, payload);
}

export async function getConquistasDoUsuario(usuarioId: number) {
  return await apiService.get<
    Array<{
      id: number;
      titulo: string;
      descricao?: string;
      tipo: string;
    }>
  >(`${API_CONFIG.ENDPOINTS.USUARIOS}/${usuarioId}/conquistas`);
}
