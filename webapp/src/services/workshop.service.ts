import { http } from '../api/http';

export type WorkshopStatus = 'ABERTO' | 'FECHADO' | 'ENCERRADO';

export interface WorkshopDescricaoDTO {
  id: number;
  tema: string;
  descricao: string;
}

export interface WorkshopDTO {
  id: number;
  titulo: string;
  linkMeet: string;
  status: WorkshopStatus;
  instrutorId: number;
  instrutorNome: string;
  dataCriacao: string;
  dataInicio: string;
  dataTermino: string;
  descricao: WorkshopDescricaoDTO;
}

export async function listarWorkshops(): Promise<WorkshopDTO[]> {
  const { data } = await http.get<WorkshopDTO[]>('/api/workshops');
  return data;
}