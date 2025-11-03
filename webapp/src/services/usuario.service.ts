import axios from 'axios';

export type CriarUsuarioDTO = {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  telefone?: string;
};

const baseURL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL ?? 'http://localhost:8080');

export async function criarUsuario(payload: CriarUsuarioDTO) {
  try {
    const { data } = await axios.post(`${baseURL}/usuarios`, payload, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false,
    });
    return data;
  } catch (e: any) {
    if (e?.response?.status === 404) {
      const { data } = await axios.post(`${baseURL}/auth/register`, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: false,
      });
      return data;
    }
    throw e;
  }
}