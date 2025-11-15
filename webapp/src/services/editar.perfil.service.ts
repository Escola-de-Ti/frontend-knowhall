export type EditarPerfilPayload = {
  email?: string;
  cpf?: string;
  telefone?: string;
  telefone2?: string;
  nome?: string;
  biografia?: string;
  senha?: string;
  tipoUsuario?: 'ALUNO' | 'PROFESSOR' | 'INSTRUTOR' | string;
  tags?: number[]; // Array de IDs das tags (números)
  nivel?: number;
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8080';

function clean<T extends object>(obj: T, keepEmpty: string[] = []): T {
  const o: Record<string, unknown> = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v === '' && keepEmpty.includes(k)) o[k] = v;
    else if (v !== undefined && v !== null && v !== '') o[k] = v;
  });
  return o as T;
}

export async function editarPerfil(payload: EditarPerfilPayload, token: string) {
  const body = JSON.stringify(clean(payload, ['biografia']));
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

export async function uploadAvatar(file: File, token: string) {
  const fd = new FormData();
  fd.append('file', file);
  const r = await fetch(`${BASE_URL}/api/usuarios/user/avatar`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg =
      typeof data === 'object' && data && 'message' in data
        ? (data.message as string)
        : 'Erro ao enviar avatar';
    throw new Error(msg);
  }
  return data;
}
