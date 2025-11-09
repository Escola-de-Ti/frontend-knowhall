import { http } from '../api/http';

export async function getTagsPopulares(qtd = 10) {
  return (await http.get<Array<{ id: number; nome: string }>>(
    '/api/tags/popular',
    { params: { quantidade: qtd } }
  )).data;
}