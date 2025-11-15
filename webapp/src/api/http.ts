import axios from 'axios';
import API_CONFIG from '../config/api.config';

// Em desenvolvimento, usa apenas /api (proxy do Vite cuida do resto)
// Em produção, usa URL completa
const baseURL = import.meta.env.DEV
  ? API_CONFIG.API_PREFIX
  : `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}`;

const basicUser = import.meta.env.VITE_API_USER;
const basicPass = import.meta.env.VITE_API_PASS;

export const http = axios.create({
  baseURL,
  timeout: 15000,
});

http.interceptors.request.use((cfg) => {
  if (basicUser) {
    const token = btoa(`${basicUser}:${basicPass ?? ''}`);
    cfg.headers.Authorization = `Basic ${token}`;
  } else {
    const t = localStorage.getItem('kh_access_token') || localStorage.getItem('kh_token');
    if (t) cfg.headers.Authorization = `Bearer ${t}`;
  }
  return cfg;
});
