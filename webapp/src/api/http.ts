import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
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
