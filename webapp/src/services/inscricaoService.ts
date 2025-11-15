/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from './apiService';
import API_CONFIG from '../config/api.config';

export type InscricaoStatus = 'INSCRITO' | 'CANCELADO';

export interface InscricaoResponseDTO {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  workshopId: number;
  workshopTitulo: string;
  status: InscricaoStatus;
  dataInscricao: string;
}

class InscricaoService {
  async inscrever(workshopId: number): Promise<InscricaoResponseDTO> {
    const response = await apiService.post<InscricaoResponseDTO>(
      `${API_CONFIG.ENDPOINTS.INSCRICOES}/workshops/${workshopId}`,
      null,
      true
    );
    return response;
  }

  async listarMinhas(): Promise<InscricaoResponseDTO[]> {
    const response = await apiService.get<InscricaoResponseDTO[]>(
      `${API_CONFIG.ENDPOINTS.INSCRICOES}/minhas`,
      true
    );
    return response;
  }

  async listarParticipantes(workshopId: number): Promise<InscricaoResponseDTO[]> {
    const response = await apiService.get<InscricaoResponseDTO[]>(
      `${API_CONFIG.ENDPOINTS.INSCRICOES}/workshops/${workshopId}/participantes`,
      true
    );
    return response;
  }

  async cancelar(workshopId: number): Promise<void> {
    await apiService.delete<void>(
      `${API_CONFIG.ENDPOINTS.INSCRICOES}/workshops/${workshopId}`,
      true
    );
  }
}

export const inscricaoService = new InscricaoService();
