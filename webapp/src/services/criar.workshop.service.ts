export type DescricaoPayload = {
    tema: string;
    descricao: string;
  };
  
  export type CreateWorkshopPayload = {
    titulo: string;
    linkMeet: string;
    dataInicio: string;
    dataTermino: string;
    descricao: DescricaoPayload;
  };
  
  export type DescricaoResponse = {
    id: number;
    tema: string;
    descricao: string;
  };
  
  export type CreateWorkshopResponse = {
    id: number;
    titulo: string;
    linkMeet: string;
    status: string;
    instrutorId: number;
    instrutorNome?: string;
    dataCriacao: string;
    dataInicio: string;
    dataTermino: string;
    descricao: DescricaoResponse;
  };
  
  export async function createWorkshop(
    apiUrl: string,
    payload: CreateWorkshopPayload,
    init?: RequestInit
  ): Promise<CreateWorkshopResponse> {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      body: JSON.stringify(payload),
      ...init,
    });
  
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
  
    return (await res.json()) as CreateWorkshopResponse;
  }