/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from './apiService';
import API_CONFIG from '../config/api.config';

export type ImagemType = 'POST' | 'WORKSHOP' | 'PERFIL';

export interface ImagemResponseDTO {
  id: number;
  nome: string;
  url: string;
  idImagemSupabase?: string;
  idImagem?: string;
  path: string;
  type?: ImagemType;
}

export interface ImagemUploadParams {
  type: ImagemType;
  id_type: number;
}

class ImagemService {
  /**
   * Faz upload de uma imagem
   * @param file - Arquivo de imagem
   * @param params - Parâmetros do upload (type e id_type)
   * @returns Dados da imagem uploadada
   */
  async upload(file: File, params: ImagemUploadParams): Promise<ImagemResponseDTO | null> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('type', params.type);
      queryParams.append('id_type', params.id_type.toString());

      const url = `${API_CONFIG.ENDPOINTS.IMAGEM_UPLOAD}?${queryParams.toString()}`;

      const token = localStorage.getItem('kh_access_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${url}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': file.type, // image/png, image/jpeg, etc.
        },
        body: file, // Envia o arquivo como binary
      });

      if (!response.ok) {
        throw new Error(`Erro no upload: ${response.status}`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error: any) {
      console.error('Erro ao fazer upload de imagem:', error);
      throw error;
    }
  }

  /**
   * Deleta uma imagem
   * @param id - ID da imagem a ser deletada
   */
  async deletar(id: number): Promise<void> {
    try {
      await apiService.delete<void>(`${API_CONFIG.ENDPOINTS.IMAGEM_DELETE}/${id}`, true);
    } catch (error: any) {
      console.error('Erro ao deletar imagem:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma imagem existente
   * @param id - ID da imagem
   * @param file - Novo arquivo de imagem
   * @returns Dados da imagem atualizada
   */
  async atualizar(id: number, file: File): Promise<ImagemResponseDTO | null> {
    try {
      const token = localStorage.getItem('kh_access_token');
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${API_CONFIG.ENDPOINTS.IMAGEM_UPDATE}/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': file.type,
          },
          body: file,
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao atualizar imagem: ${response.status}`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error: any) {
      console.error('Erro ao atualizar imagem:', error);
      throw error;
    }
  }

  /**
   * Valida se o arquivo é uma imagem válida
   * @param file - Arquivo a ser validado
   * @param maxSizeMB - Tamanho máximo em MB (padrão: 5MB)
   * @returns true se for válido, caso contrário lança um erro
   */
  validarImagem(file: File, maxSizeMB: number = 5): boolean {
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!tiposPermitidos.includes(file.type)) {
      throw new Error('Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou GIF.');
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`);
    }

    return true;
  }

  /**
   * Converte arquivo para base64
   * @param file - Arquivo a ser convertido
   * @returns Promise com string base64
   */
  async converterParaBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Cria uma URL temporária para preview da imagem
   * @param file - Arquivo de imagem
   * @returns URL temporária
   */
  criarUrlPreview(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Revoga uma URL temporária criada para preview
   * @param url - URL a ser revogada
   */
  revogarUrlPreview(url: string): void {
    URL.revokeObjectURL(url);
  }
}

export const imagemService = new ImagemService();
