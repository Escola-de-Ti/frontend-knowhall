import { api } from '../api/api';

export type CriarUsuarioDTO = {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  telefone?: string;
};

export async function criarUsuario(payload: CriarUsuarioDTO) {
  try {
    const { data } = await api.post('/api/usuarios', payload);
    return data;
  } catch (e: any) {
    if (e?.response?.status === 404) {
      const { data } = await api.post('/api/auth/register', payload);
      return data;
    }
    throw e;
  }
}