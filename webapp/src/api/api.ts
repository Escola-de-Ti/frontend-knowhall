import axios from 'axios';

const baseURL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL ?? 'http://localhost:8080');

export const api = axios.create({
  baseURL,
  auth: {
    username: import.meta.env.VITE_API_USER ?? 'user',
    password: import.meta.env.VITE_API_PASS ?? '',
  },
});