import React, { useEffect, useState } from 'react';
import '../../styles/perfil/PerfilEstatisticas.css';
import { buscarResumoTransacoes } from '../../services/historicoService';
import Loading from '../Loading';

type ContribuicaoStats = {
  posts: number;
  comentarios: number;
  upvotesDados: number;
  workshops: number;
};

type TokenStats = {
  ganhos_total: number;
  gastos_total: number;
  saldo_atual: number;
  total_transacoes: number;
};

type PerfilEstatisticasProps = {
  idUsuario: number;
  estatisticasIniciais?: {
    contrib: ContribuicaoStats;
    tokens?: TokenStats;
  };
};

export default function PerfilEstatisticas({ idUsuario, estatisticasIniciais }: PerfilEstatisticasProps) {
  const [contrib, setContrib] = useState<ContribuicaoStats | null>(estatisticasIniciais?.contrib || null);
  const [tokens, setTokens] = useState<TokenStats | null>(estatisticasIniciais?.tokens || null);
  const [loading, setLoading] = useState(!estatisticasIniciais);

  useEffect(() => {
    if (estatisticasIniciais) return;

    const carregarEstatisticas = async () => {
      try {
        setLoading(true);

        const resumo = await buscarResumoTransacoes();
        setTokens({
          ganhos_total: resumo.totalRecebido,
          gastos_total: resumo.totalGasto,
          saldo_atual: resumo.saldoAtual,
          total_transacoes: resumo.totalTransacoes,
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (idUsuario) {
      carregarEstatisticas();
    }
  }, [idUsuario, estatisticasIniciais]);

  const n = (v: number) => v.toLocaleString('pt-BR');

  if (loading) {
    return <Loading fullscreen message="Carregando estatísticas..." />;
  }

  return (
    <section className="stats-wrap">
      <div className="stats-card">
        <h3>Estatísticas de Contribuição</h3>
        <ul className="stats-list">
          <li>
            <span>Posts Publicados</span>
            <strong className="c-green">{contrib ? n(contrib.posts) : '--'}</strong>
          </li>
          <li>
            <span>Comentários</span>
            <strong className="c-green">{contrib ? n(contrib.comentarios) : '--'}</strong>
          </li>
          <li>
            <span>Upvotes Enviados</span>
            <strong className="c-green">{contrib ? n(contrib.upvotesDados) : '--'}</strong>
          </li>
          <li>
            <span>Workshops Ministrados</span>
            <strong className="c-green">{contrib ? n(contrib.workshops) : '--'}</strong>
          </li>
        </ul>
      </div>

      {tokens && (
        <div className="stats-card">
          <h3>Histórico de Tokens</h3>
          <ul className="stats-list">
            <li>
              <span>Tokens Ganhos (Total)</span>
              <strong className="c-green">+{n(tokens.ganhos_total)}</strong>
            </li>
            <li>
              <span>Tokens Gastos (Total)</span>
              <strong className="c-red">-{n(tokens.gastos_total)}</strong>
            </li>
            <li>
              <span>Saldo Atual</span>
              <strong className="c-pink">{n(tokens.saldo_atual)}</strong>
            </li>
            <li>
              <span>Total de Transações</span>
              <strong className="c-green">{n(tokens.total_transacoes)}</strong>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}
