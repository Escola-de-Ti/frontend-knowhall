import { apiService } from './apiService';
import API_CONFIG from '../config/api.config';

export interface TagResponseDTO {
  id: number;
  name: string;
}

export interface TagCreateDTO {
  name: string;
}

class TagService {
  async createOrGet(name: string): Promise<TagResponseDTO> {
    const dto: TagCreateDTO = { name: name.trim() };
    return apiService.post<TagResponseDTO>(API_CONFIG.ENDPOINTS.TAGS, dto, true);
  }

  async getMostPopular(quantidade: number = 10): Promise<TagResponseDTO[]> {
    const endpoint = `${API_CONFIG.ENDPOINTS.TAGS_POPULAR}?quantidade=${quantidade}`;
    return apiService.get<TagResponseDTO[]>(endpoint, true);
  }

  async processMultipleTags(tagNames: string[]): Promise<number[]> {
    const uniqueNames = [...new Set(tagNames.map((name) => name.trim()).filter(Boolean))];

    const promises = uniqueNames.map((name) => this.createOrGet(name));
    const tags = await Promise.all(promises);

    return tags.map((tag) => tag.id);
  }
}

export const tagService = new TagService();
