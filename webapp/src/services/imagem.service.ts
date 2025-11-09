import { http } from '../api/http';

export async function uploadImagem(file: File, type: string) {
  const form = new FormData();
  form.append('file', file);
  return (await http.post('/api/imagem/upload', form, {
    params: { type },
    headers: { 'Content-Type': 'multipart/form-data' },
  })).data;
}

export async function deletarImagem(id: number) {
  await http.delete(`/api/imagem/delete/${id}`);
}