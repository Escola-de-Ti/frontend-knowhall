import { http } from '../api/http';

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
  return (await http.get<UsuarioDTO>(`/api/usuarios/${id}`)).data;
}

export async function getMyUser() {
  return (await http.get<UsuarioDTO>(`/api/usuarios/user`)).data;
}

export async function getUsuarioDetalhes(id: number) {
  return (await http.get<UsuarioDetalhesDTO>(`/api/usuarios/detalhes/${id}`)).data;
}

export async function updateUsuario(id: number, payload: Partial<UsuarioDTO>) {
  return (await http.put<UsuarioDTO>(`/api/usuarios/${id}`, payload)).data;
}

export async function getConquistasDoUsuario(usuarioId: number) {
  return (await http.get<Array<{
    id: number;
    titulo: string;
    descricao?: string;
    tipo: string;
  }>>(`/api/usuarios/${usuarioId}/conquistas`)).data;
}