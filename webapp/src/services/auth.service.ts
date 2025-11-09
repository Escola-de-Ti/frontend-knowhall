import { http } from '../api/http';
import { setTokens, getRefreshToken, clearTokens } from '../api/auth';

type JwtTokenDTO = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
};

const isBasic = !!import.meta.env.VITE_API_USER;

export async function login(email: string, senha: string) {
  if (isBasic) {
    await http.get('/actuator/health');
    setTokens('dev-basic');
    return { access_token: 'dev-basic', refresh_token: 'dev-basic' };
  } else {
    const { data } = await http.post<JwtTokenDTO>('/api/usuarios/login', { email, senha });
    setTokens(data.access_token, data.refresh_token);
    return data;
  }
}

export async function refresh() {
  if (isBasic) return { access_token: 'dev-basic', refresh_token: 'dev-basic' };
  const rt = getRefreshToken();
  if (!rt) throw new Error('Sem refresh token');
  const { data } = await http.post<JwtTokenDTO>('/api/usuarios/refresh', { refresh_token: rt });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export function logout() {
  clearTokens();
}