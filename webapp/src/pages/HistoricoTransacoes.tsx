import React, { useEffect, useState } from 'react';
import '../styles/HistoricoTransacoes.css';
import NavBar from '../components/NavBar';
import Loading from '../components/Loading';
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
          setTransacoes([]);
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        setTransacoes([]);
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
          <Loading fullscreen message="Carregando histórico..." />
        ) : transacoes.length === 0 ? (
          <div className="historico-empty">
            <div className="empty-icon">📊</div>
            <h2 className="empty-title">Nenhuma transação ainda</h2>
            <p className="empty-description">
              Comece a interagir com a comunidade para ganhar tokens!
            </p>
            <div className="empty-tips">
              <div className="tip-item">
                <span className="tip-icon">✍️</span>
                <span className="tip-text">Crie posts e compartilhe conhecimento</span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">💬</span>
                <span className="tip-text">Comente e ajude outros membros</span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">👍</span>
                <span className="tip-text">Receba upvotes e supervotes</span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🎓</span>
                <span className="tip-text">Ministre workshops e ensine</span>
              </div>
            </div>
          </div>
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
