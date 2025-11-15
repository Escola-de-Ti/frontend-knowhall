import React, { useEffect, useState } from 'react';
import '../styles/HistoricoTransacoes.css';
import NavBar from '../components/NavBar';
import { buscarHistoricoTransacoes } from '../services/historicoService';
import { MoreHorizontal } from 'lucide-react';

interface Transacao {
  id: number;
  quantidade: number;
  motivoDescricao: string;
  descricao: string;
  dataTransacao: string;
}

interface HistoricoTransacaoListResponse {
  transacoes: Transacao[];
  totalRecebido: number;
  totalGasto: number;
  saldoAtual: number;
  hasMore: boolean;
  totalPages: number;
  totalElements: number;
}

const mockTransacoes: HistoricoTransacaoListResponse = {
  transacoes: [
    {
      id: 1,
      quantidade: 50,
      motivoDescricao: 'Up vote em comentário',
      descricao: 'Recebimento por comentário',
      dataTransacao: '2025-09-13T21:40:00Z',
    },
    {
      id: 2,
      quantidade: -650,
      motivoDescricao: 'Inscrição em workshop como aluno',
      descricao: 'Compra de Workshop',
      dataTransacao: '2025-09-12T20:40:00Z',
    },
    {
      id: 3,
      quantidade: 100,
      motivoDescricao: 'Super vote em comentário',
      descricao: 'Recebimento por SuperVote',
      dataTransacao: '2025-06-13T14:10:00Z',
    },
  ],
  totalRecebido: 150,
  totalGasto: 650,
  saldoAtual: 2780,
  hasMore: false,
  totalPages: 1,
  totalElements: 3,
};

export default function HistoricoTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await buscarHistoricoTransacoes(0, 20);
        if (resposta && Array.isArray(resposta.transacoes)) {
          setTransacoes(resposta.transacoes);
        } else {
          console.warn('Usando mock temporário');
          setTransacoes(mockTransacoes.transacoes);
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        setTransacoes(mockTransacoes.transacoes);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const handleToggle = (id: number) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="historico-page">
      <NavBar />

      <div className="historico-container">
        <h1 className="historico-title">Histórico de Transações</h1>

        {loading ? (
          <div className="historico-loading">Carregando...</div>
        ) : (
          <div className="transacoes-list">
            {transacoes.map((item) => {
              const isPositive = item.quantidade > 0;
              const color = isPositive ? '#6ef7c3' : '#F08E90';
              const sign = isPositive ? '+' : '';

              return (
                <div key={item.id} className="transacao-card">
                  <div className="transacao-row">
                    <div className="transacao-info">
                      <p className="transacao-motivo">{item.motivoDescricao}</p>
                      <p className="transacao-quantidade" style={{ color: color }}>
                        {sign}
                        {item.quantidade} tokens
                      </p>
                    </div>

                    <div className="transacao-acoes">
                      {expanded === item.id && (
                        <button
                          className="btn-suporte"
                          onClick={() => alert('Você entrou em contato com o suporte.')}
                        >
                          Contatar suporte
                        </button>
                      )}
                      <button className="btn-toggle" onClick={() => handleToggle(item.id)}>
                        <MoreHorizontal size={18} color="#ccc" />
                      </button>
                    </div>
                  </div>

                  <p className="transacao-data">{formatDateTime(item.dataTransacao)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
