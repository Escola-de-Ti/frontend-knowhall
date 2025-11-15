import axios from 'axios';
import API_CONFIG from '../config/api.config';

const baseURL = import.meta.env.DEV
  ? '/api'
  : `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}`;

export const api = axios.create({
  baseURL,
  auth: {
    username: import.meta.env.VITE_API_USER ?? 'user',
    password: import.meta.env.VITE_API_PASS ?? '',
  },
});
