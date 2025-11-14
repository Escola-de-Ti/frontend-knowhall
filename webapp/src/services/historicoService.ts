import { http } from '../api/http';

export type TransacaoDTO = {
  id: number;
  quantidade: number;
  motivo: string;
  motivoDescricao: string;
  descricao: string;
  dataTransacao: string;
};

export type HistoricoTransacoesResponseDTO = {
  transacoes: TransacaoDTO[];
  totalRecebido: number;
  totalGasto: number;
  saldoAtual: number;
  hasMore: boolean;
  totalPages: number;
  totalElements: number;
};

export type ResumoTransacoesDTO = {
  totalRecebido: number;
  totalGasto: number;
  saldoAtual: number;
  totalTransacoes: number;
};

export async function buscarHistoricoTransacoes(
  page = 0,
  size = 20
): Promise<HistoricoTransacoesResponseDTO> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());

  return (
    await http.get<HistoricoTransacoesResponseDTO>(
      `/api/historico-transacoes?${params.toString()}`
    )
  ).data;
}

export async function buscarResumoTransacoes(): Promise<ResumoTransacoesDTO> {
  return (await http.get<ResumoTransacoesDTO>('/api/historico-transacoes/resumo')).data;
}
