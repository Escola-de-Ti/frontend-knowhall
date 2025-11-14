import { apiService } from './apiService';
import API_CONFIG from '../config/api.config';

export type WorkshopStatus = 'ABERTO' | 'FECHADO' | 'ENCERRADO' | 'EM_ANDAMENTO' | 'INSCRITO' | 'CONCLUIDO';

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
}

class WorkshopService {
  /**
   * Cria um novo workshop
   * @param dados - Dados do workshop a ser criado
   * @returns Workshop criado
   */
  async criar(dados: WorkshopCreateDTO): Promise<WorkshopResponseDTO> {
    try {
      const response = await apiService.post<WorkshopResponseDTO>(
        API_CONFIG.ENDPOINTS.WORKSHOPS,
        dados,
        true
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao criar workshop:', error);
      throw error;
    }
  }

  /**
   * Lista todos os workshops ou filtra por status
   * @param params - Parâmetros de filtro (opcional)
   * @returns Lista de workshops
   */
  async listar(params?: WorkshopListParams): Promise<WorkshopResponseDTO[]> {
    try {
      let endpoint = API_CONFIG.ENDPOINTS.WORKSHOPS;

      if (params?.status) {
        const queryParams = new URLSearchParams();
        queryParams.append('status', params.status);
        endpoint = `${endpoint}?${queryParams.toString()}`;
      }

      const response = await apiService.get<WorkshopResponseDTO[]>(
        endpoint,
        true
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao listar workshops:', error);
      throw error;
    }
  }

  /**
   * Lista workshops por status
   * @param status - Status do workshop
   * @returns Lista de workshops com o status especificado
   */
  async listarPorStatus(status: WorkshopStatus): Promise<WorkshopResponseDTO[]> {
    return this.listar({ status });
  }

  /**
   * Busca um workshop por ID
   * @param id - ID do workshop
   * @returns Workshop encontrado
   */
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

  /**
   * Busca workshops por título
   * @param titulo - Título ou parte do título para buscar
   * @returns Lista de workshops que correspondem ao título
   */
  async buscarPorTitulo(titulo: string): Promise<WorkshopResponseDTO[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('titulo', titulo);

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

  /**
   * Busca workshops por instrutor
   * @param instrutorId - ID do instrutor
   * @returns Lista de workshops do instrutor
   */
  async buscarPorInstrutor(instrutorId: number): Promise<WorkshopResponseDTO[]> {
    try {
      const response = await apiService.get<WorkshopResponseDTO[]>(
        `${API_CONFIG.ENDPOINTS.WORKSHOPS}/instrutor/${instrutorId}`,
        true
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao buscar workshops por instrutor:', error);
      throw error;
    }
  }

  /**
   * Atualiza um workshop
   * @param id - ID do workshop
   * @param dados - Dados a serem atualizados
   * @returns Workshop atualizado
   */
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

  /**
   * Deleta um workshop
   * @param id - ID do workshop a ser deletado
   */
  async deletar(id: number): Promise<void> {
    try {
      await apiService.delete<void>(
        `${API_CONFIG.ENDPOINTS.WORKSHOPS}/${id}`,
        true
      );
    } catch (error: any) {
      console.error('Erro ao deletar workshop:', error);
      throw error;
    }
  }

  /**
   * Calcula a duração do workshop em horas
   * @param dataInicio - Data de início
   * @param dataTermino - Data de término
   * @returns Duração em horas
   */
  calcularDuracao(dataInicio: string, dataTermino: string): number {
    const inicio = new Date(dataInicio).getTime();
    const termino = new Date(dataTermino).getTime();
    return Math.round(((termino - inicio) / 36e5) * 10) / 10;
  }

  /**
   * Formata a data para exibição
   * @param dataISO - Data em formato ISO
   * @returns Data formatada (ex: "20 Nov 2025")
   */
  formatarData(dataISO: string): string {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = meses[data.getMonth()];
    const ano = data.getFullYear();
    return `${dia} ${mes} ${ano}`;
  }

  /**
   * Formata a hora para exibição
   * @param dataISO - Data em formato ISO
   * @returns Hora formatada (ex: "14:00")
   */
  formatarHora(dataISO: string): string {
    const data = new Date(dataISO);
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    return `${hora}:${minuto}`;
  }

  /**
   * Filtra workshops por período
   * @param workshops - Lista de workshops
   * @param dataInicio - Data de início do período (opcional)
   * @param dataFim - Data de fim do período (opcional)
   * @returns Lista de workshops no período
   */
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

  /**
   * Verifica se o workshop está ativo (aberto para inscrições)
   * @param workshop - Workshop a ser verificado
   * @returns true se estiver ativo
   */
  estaAtivo(workshop: WorkshopResponseDTO): boolean {
    return workshop.status === 'ABERTO';
  }

  /**
   * Verifica se o workshop já foi concluído
   * @param workshop - Workshop a ser verificado
   * @returns true se estiver concluído
   */
  estaConcluido(workshop: WorkshopResponseDTO): boolean {
    return workshop.status === 'CONCLUIDO' || workshop.status === 'ENCERRADO';
  }

  /**
   * Verifica se o workshop está em andamento
   * @param workshop - Workshop a ser verificado
   * @returns true se estiver em andamento
   */
  estaEmAndamento(workshop: WorkshopResponseDTO): boolean {
    const agora = new Date();
    const inicio = new Date(workshop.dataInicio);
    const termino = new Date(workshop.dataTermino);
    
    return agora >= inicio && agora <= termino && workshop.status === 'EM_ANDAMENTO';
  }
}

export const workshopService = new WorkshopService();
