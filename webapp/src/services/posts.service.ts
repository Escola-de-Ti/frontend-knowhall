import { http } from '../api/http';

export async function listarPosts(params?: Record<string, any>) {
  return (await http.get('/api/posts', { params })).data;
}