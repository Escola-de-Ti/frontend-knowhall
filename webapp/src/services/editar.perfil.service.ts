export type TagItem = { name: string };

export type EditarPerfilPayload = {
  email?: string;
  cpf?: string;
  telefone?: string;
  telefone2?: string;
  nome?: string;
  biografia?: string;
  senha?: string;
  tipoUsuario?: 'ALUNO' | 'PROFESSOR' | string;
  tags?: TagItem[];
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8080';

function clean<T extends object>(obj: T): T {
  const o: Record<string, unknown> = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') o[k] = v;
  });
  return o as T;
}

export async function editarPerfil(payload: EditarPerfilPayload, token: string) {
  const body = JSON.stringify(clean(payload));
  const r = await fetch(`${BASE_URL}/api/usuarios/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg =
      typeof data === 'object' && data && 'message' in data
        ? (data.message as string)
        : 'Erro ao salvar perfil';
    throw new Error(msg);
  }
  return data;
}
