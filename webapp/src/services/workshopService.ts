/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from './apiService';
import API_CONFIG from '../config/api.config';

export type WorkshopStatus = 'ABERTO' | 'FECHADO' | 'ENCERRADO' | 'EM_ANDAMENTO' | 'CONCLUIDO';

export interface WorkshopDescricaoDTO {
  id: number;
  tema: string;
  descricao: string;
  urlImagem?: string | null;
  idImagem?: string | null;
}

export interface WorkshopDescricaoCreateDTO {
  tema: string;
  descricao: string;
}

export interface WorkshopResponseDTO {
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
  capacidade?: number;
  custo?: number;
}

export interface WorkshopCreateDTO {
  titulo: string;
  linkMeet: string;
  dataInicio: string;
  dataTermino: string;
  custo?: number;
  descricao: WorkshopDescricaoCreateDTO;
  capacidade?: number;
}

export interface WorkshopUpdateDTO {
  titulo?: string;
  linkMeet?: string;
  dataInicio?: string;
  dataTermino?: string;
  status?: WorkshopStatus;
  custo?: number;
  capacidade?: number;
  descricao?: WorkshopDescricaoCreateDTO;
}

export interface WorkshopListParams {
  status?: WorkshopStatus;
  instrutorId?: number;
}

class WorkshopService {
  async criar(dados: WorkshopCreateDTO): Promise<WorkshopResponseDTO> {
    const response = await apiService.post<WorkshopResponseDTO>(
      API_CONFIG.ENDPOINTS.WORKSHOPS,
      dados,
      true
    );
    return response;
  }

  async listar(params?: WorkshopListParams): Promise<WorkshopResponseDTO[]> {
    try {
      let endpoint = API_CONFIG.ENDPOINTS.WORKSHOPS;

      if (params && (params.status || params.instrutorId != null)) {
        const queryParams = new URLSearchParams();
        if (params.status) {
          queryParams.append('status', params.status);
        }
        if (params.instrutorId != null) {
          queryParams.append('instrutorId', params.instrutorId.toString());
        }
        endpoint = `${endpoint}?${queryParams.toString()}`;
      }

      const response = await apiService.get<WorkshopResponseDTO[]>(endpoint, true);
      return response;
    } catch (error: any) {
      console.error('Erro ao listar workshops:', error);
      throw error;
    }
  }

  async listarPorStatus(status: WorkshopStatus): Promise<WorkshopResponseDTO[]> {
    return this.listar({ status });
  }

  async buscarPorId(id: number): Promise<WorkshopResponseDTO> {
    try {
      const response = await apiService.get<WorkshopResponseDTO>(
        `${API_CONFIG.ENDPOINTS.WORKSHOPS}/${id}`,
        true
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao buscar workshop:', error);
      throw error;
    }
  }

  async buscarPorTitulo(titulo: string): Promise<WorkshopResponseDTO[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('termo', titulo);

      const response = await apiService.get<WorkshopResponseDTO[]>(
        `${API_CONFIG.ENDPOINTS.WORKSHOPS}/buscar?${queryParams.toString()}`,
        true
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao buscar workshops por título:', error);
      throw error;
    }
  }

  async buscarPorInstrutor(instrutorId: number): Promise<WorkshopResponseDTO[]> {
    return this.listar({ instrutorId });
  }

  async atualizar(id: number, dados: WorkshopUpdateDTO): Promise<WorkshopResponseDTO> {
    try {
      const response = await apiService.patch<WorkshopResponseDTO>(
        `${API_CONFIG.ENDPOINTS.WORKSHOPS}/${id}`,
        dados,
        true
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao atualizar workshop:', error);
      throw error;
    }
  }

  async deletar(id: number): Promise<void> {
    try {
      await apiService.delete<void>(`${API_CONFIG.ENDPOINTS.WORKSHOPS}/${id}`, true);
    } catch (error: any) {
      console.error('Erro ao deletar workshop:', error);
      throw error;
    }
  }

  calcularDuracao(dataInicio: string, dataTermino: string): number {
    const inicio = new Date(dataInicio).getTime();
    const termino = new Date(dataTermino).getTime();
    return Math.round(((termino - inicio) / 36e5) * 10) / 10;
  }

  formatarData(dataISO: string): string {
    if (!dataISO) return '-';

    const meses = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    const [datePart] = dataISO.split('T'); // pega só a parte YYYY-MM-DD
    if (!datePart) return '-';

    const [year, month, day] = datePart.split('-');
    if (!year || !month || !day) return '-';

    const dia = day.padStart(2, '0');
    const mesIndex = Number(month) - 1;
    const mes = meses[mesIndex] ?? month;

    return `${dia} ${mes} ${year}`;
  }

  formatarHora(dataISO: string): string {
    const data = new Date(dataISO);
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    return `${hora}:${minuto}`;
  }

  filtrarPorPeriodo(
    workshops: WorkshopResponseDTO[],
    dataInicio?: Date,
    dataFim?: Date
  ): WorkshopResponseDTO[] {
    return workshops.filter((workshop) => {
      const data = new Date(workshop.dataInicio);

      if (dataInicio && data < dataInicio) return false;
      if (dataFim && data > dataFim) return false;

      return true;
    });
  }

  estaAtivo(workshop: WorkshopResponseDTO): boolean {
    return workshop.status === 'ABERTO';
  }

  estaConcluido(workshop: WorkshopResponseDTO): boolean {
    return workshop.status === 'CONCLUIDO' || workshop.status === 'ENCERRADO';
  }

  estaEmAndamento(workshop: WorkshopResponseDTO): boolean {
    const agora = new Date();
    const inicio = new Date(workshop.dataInicio);
    const termino = new Date(workshop.dataTermino);

    return agora >= inicio && agora <= termino && workshop.status === 'EM_ANDAMENTO';
  }
}

export const workshopService = new WorkshopService();
