import {apiService} from './apiService';
import API_CONFIG from '../config/api.config';

// ========================================
// INTERFACES E DTOs
// ========================================

export interface VotoResponseDTO {
  votado: boolean;       // Se o usuário votou após a ação
  totalUpVotes: number;  // Total de votos do post após a ação
}

// ========================================
// SERVICE
// ========================================

class VotoService {
  /**
   * Vota ou remove voto de um post (toggle)
   * @param postId - ID do post (como string, pois vem do BigInteger)
   * @returns Resposta com estado do voto e total de upvotes
   */
  async votarEmPost(postId: string): Promise<VotoResponseDTO> {
    const endpoint = `${API_CONFIG.ENDPOINTS.VOTOS}/post/${postId}`;
    
    // POST sem body (null), requer autenticação
    return apiService.post<VotoResponseDTO>(endpoint, null, true);
  }
}

export const votoService = new VotoService();