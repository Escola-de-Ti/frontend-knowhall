import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  auth: {
    username: import.meta.env.VITE_API_USER ?? 'user',
    password: import.meta.env.VITE_API_PASS ?? '',
  },
});