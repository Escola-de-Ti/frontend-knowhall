/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from './apiService';
import API_CONFIG from '../config/api.config';

export type TierType = 'BRONZE' | 'PRATA' | 'OURO' | 'PLATINA' | 'DIAMANTE';
export type TipoConquista = 'INSIGNIA' | 'TITULO' | 'EMBLEMA';

export interface TierDTO {
  id: number;
  tier: TierType;
  quantidadeNecessaria: number;
  descricaoTier: string | null;
  corHex: string | null;
  nivel: number;
}

export interface ConquistaResponseDTO {
  id: number;
  nome: string;
  descricao: string;
  tipoConquista: TipoConquista;
  campoValidacao: string;
  iconeUrl: string | null;
  tiers: TierDTO[];
}

export interface ConquistaCreateDTO {
  nome: string;
  descricao: string;
  tipoConquista: TipoConquista;
  campoValidacao: string;
  iconeUrl?: string;
  tiers: {
    [key in TierType]?: number;
  };
}

export interface ConquistaListParams {
  tipo?: TipoConquista;
}

class ConquistaService {
  /**
   * Cria uma nova conquista
   * @param dados - Dados da conquista a ser criada
   * @returns Conquista criada
   */
  async criar(dados: ConquistaCreateDTO): Promise<ConquistaResponseDTO> {
    try {
      const response = await apiService.post<ConquistaResponseDTO>(
        API_CONFIG.ENDPOINTS.CONQUISTAS,
        dados,
        true
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao criar conquista:', error);
      throw error;
    }
  }

  /**
   * Lista todas as conquistas ou filtra por tipo
   * @param params - Parâmetros de filtro (opcional)
   * @returns Lista de conquistas
   */
  async listar(params?: ConquistaListParams): Promise<ConquistaResponseDTO[]> {
    try {
      let endpoint = API_CONFIG.ENDPOINTS.CONQUISTAS;

      if (params?.tipo) {
        const queryParams = new URLSearchParams();
        queryParams.append('tipo', params.tipo);
        endpoint = `${endpoint}?${queryParams.toString()}`;
      }

      const response = await apiService.get<ConquistaResponseDTO[]>(endpoint, true);
      return response;
    } catch (error: any) {
      console.error('Erro ao listar conquistas:', error);
      throw error;
    }
  }

  /**
   * Lista conquistas por tipo específico
   * @param tipo - Tipo da conquista (INSIGNIA, TITULO, EMBLEMA)
   * @returns Lista de conquistas do tipo especificado
   */
  async listarPorTipo(tipo: TipoConquista): Promise<ConquistaResponseDTO[]> {
    return this.listar({ tipo });
  }

  /**
   * Lista conquistas por campo de validação
   * @param campo - Nome do campo de validação (ex: 'total_posts')
   * @returns Lista de conquistas que validam o campo especificado
   */
  async listarPorCampo(campo: string): Promise<ConquistaResponseDTO[]> {
    try {
      const response = await apiService.get<ConquistaResponseDTO[]>(
        `${API_CONFIG.ENDPOINTS.CONQUISTAS_CAMPO}/${campo}`,
        true
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao listar conquistas por campo:', error);
      throw error;
    }
  }

  /**
   * Agrupa conquistas por tipo
   * @param conquistas - Lista de conquistas
   * @returns Objeto com conquistas agrupadas por tipo
   */
  agruparPorTipo(
    conquistas: ConquistaResponseDTO[]
  ): Record<TipoConquista, ConquistaResponseDTO[]> {
    return conquistas.reduce(
      (acc, conquista) => {
        if (!acc[conquista.tipoConquista]) {
          acc[conquista.tipoConquista] = [];
        }
        acc[conquista.tipoConquista].push(conquista);
        return acc;
      },
      {} as Record<TipoConquista, ConquistaResponseDTO[]>
    );
  }

  /**
   * Ordena os tiers de uma conquista por nível
   * @param conquista - Conquista com tiers
   * @returns Conquista com tiers ordenados
   */
  ordenarTiers(conquista: ConquistaResponseDTO): ConquistaResponseDTO {
    return {
      ...conquista,
      tiers: [...conquista.tiers].sort((a, b) => a.nivel - b.nivel),
    };
  }

  /**
   * Calcula o progresso do usuário em uma conquista
   * @param quantidadeAtual - Quantidade atual do usuário
   * @param tiers - Lista de tiers da conquista
   * @returns Informações sobre o progresso
   */
  calcularProgresso(
    quantidadeAtual: number,
    tiers: TierDTO[]
  ): {
    tierAtual: TierDTO | null;
    proximoTier: TierDTO | null;
    progresso: number;
    completo: boolean;
  } {
    const tiersOrdenados = [...tiers].sort((a, b) => a.nivel - b.nivel);

    let tierAtual: TierDTO | null = null;
    let proximoTier: TierDTO | null = null;

    for (let i = 0; i < tiersOrdenados.length; i++) {
      if (quantidadeAtual >= tiersOrdenados[i].quantidadeNecessaria) {
        tierAtual = tiersOrdenados[i];
      } else {
        proximoTier = tiersOrdenados[i];
        break;
      }
    }

    const completo = tierAtual?.nivel === tiersOrdenados[tiersOrdenados.length - 1]?.nivel;

    let progresso = 0;
    if (proximoTier && tierAtual) {
      const inicio = tierAtual.quantidadeNecessaria;
      const fim = proximoTier.quantidadeNecessaria;
      progresso = ((quantidadeAtual - inicio) / (fim - inicio)) * 100;
    } else if (completo && tierAtual) {
      progresso = 100;
    } else if (proximoTier && !tierAtual) {
      progresso = (quantidadeAtual / proximoTier.quantidadeNecessaria) * 100;
    }

    return {
      tierAtual,
      proximoTier,
      progresso: Math.min(Math.max(progresso, 0), 100),
      completo,
    };
  }
}

export const conquistaService = new ConquistaService();
