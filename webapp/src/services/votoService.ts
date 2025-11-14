import {apiService} from './apiService';
import API_CONFIG from '../config/api.config';

export interface VotoResponseDTO {
  votado: boolean;       
  totalUpVotes: number;  
}


class VotoService {

  async votarEmPost(postId: string): Promise<VotoResponseDTO> {
    const endpoint = `${API_CONFIG.ENDPOINTS.VOTOS}/post/${postId}`;
    
    return apiService.post<VotoResponseDTO>(endpoint, null, true);
  }

  async votarEmComentario(comentarioId: string): Promise<VotoResponseDTO> {
    const endpoint = `${API_CONFIG.ENDPOINTS.VOTOS}/comentario/${comentarioId}`;
    
    return apiService.post<VotoResponseDTO>(endpoint, null, true);
  }

  async superVotarEmComentario(comentarioId: string): Promise<VotoResponseDTO> {
    const endpoint = `${API_CONFIG.ENDPOINTS.VOTOS}/comentario/${comentarioId}/super`;
    
    return apiService.post<VotoResponseDTO>(endpoint, null, true);
  }
}

export const votoService = new VotoService();