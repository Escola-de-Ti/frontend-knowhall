import { http } from '../api/http';

export type UsuarioDTO = {
  id: number;
  nome: string;
  email: string;
  biografia?: string;
  imagemPerfil?: string;
  status?: string;
  tipo?: string;
  interesses: string[];
};

export async function getUsuario(id: number) {
  return (await http.get<UsuarioDTO>(`/api/usuarios/${id}`)).data;
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