/* eslint-disable @typescript-eslint/no-explicit-any */
import { buildApiUrl } from '../config/api.config';
import API_CONFIG from '../config/api.config';

interface JwtTokenDTO {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

interface DecodedToken {
  sub: string;
  iss?: string;
  iat?: number;
  exp?: number;
  typ?: string;
  [key: string]: any;
}

const TOKEN_KEY = 'kh_access_token';
const REFRESH_TOKEN_KEY = 'kh_refresh_token';
const TOKEN_EXPIRY_KEY = 'kh_token_expiry';

class AuthService {
  saveTokens(tokenData: JwtTokenDTO): void {
    const expiresAt = Date.now() + tokenData.expires_in * 1000;
    localStorage.setItem(TOKEN_KEY, tokenData.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refresh_token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiresAt));
  }

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    return !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;

    const expiryTime = parseInt(expiry, 10);
    const now = Date.now();

    return now >= expiryTime;
  }

  decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  private getDecodedToken(): DecodedToken | null {
    const token = this.getAccessToken();
    if (!token) return null;
    return this.decodeToken(token);
  }

  getUserEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.sub || null;
  }

  getUsuarioNome(): string | null {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;

    const possibleKeys = ['nome', 'name', 'fullName', 'usuarioNome'];

    for (const key of possibleKeys) {
      const value = decoded[key];
      if (typeof value === 'string' && value.trim()) return value;
    }

    return null;
  }

  getUsuarioId(): number | null {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;

    const candidateKeys = ['id', 'userId', 'usuarioId', 'instrutorId', 'user_id', 'usuario_id'];

    for (const key of candidateKeys) {
      const value = decoded[key];
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const num = Number(value);
        if (!Number.isNaN(num)) return num;
      }
    }

    const subNum = Number(decoded.sub);
    if (!Number.isNaN(subNum)) return subNum;

    for (const [key, value] of Object.entries(decoded)) {
      if (key === 'iat' || key === 'exp' || key === 'nbf') continue;

      if (typeof value === 'number' && Number.isInteger(value)) return value;

      if (typeof value === 'string') {
        const num = Number(value);
        if (!Number.isNaN(num)) return num;
      }
    }

    return null;
  }

  getInstrutorId(): number | null {
    return this.getUsuarioId();
  }

  clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  logout(): void {
    this.clearTokens();
    window.location.href = '/login';
  }

  async login(email: string, senha: string): Promise<JwtTokenDTO> {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao fazer login');
    }

    const tokenData: JwtTokenDTO = await response.json();
    this.saveTokens(tokenData);
    return tokenData;
  }

  async refreshAccessToken(): Promise<JwtTokenDTO> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    const url = buildApiUrl(API_CONFIG.ENDPOINTS.REFRESH);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      this.logout();
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    const tokenData: JwtTokenDTO = await response.json();
    this.saveTokens(tokenData);
    return tokenData;
  }
}

export const authService = new AuthService();
export type { JwtTokenDTO, DecodedToken };