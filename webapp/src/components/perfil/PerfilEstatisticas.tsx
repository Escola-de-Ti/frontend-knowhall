import React, { useEffect, useState } from 'react';
import '../../styles/perfil/PerfilEstatisticas.css';

type ContribuicaoStats = {
  posts: number;
  comentarios: number;
  upvotes: number;
  workshops: number;
};

type TokenStats = {
  ganhos_total: number;
  gastos_total: number;
  saldo_atual: number;
  media_mensal: number;
};

export default function PerfilEstatisticas() {
  const [contrib, setContrib] = useState<ContribuicaoStats | null>(null);
  const [tokens, setTokens] = useState<TokenStats | null>(null);

  useEffect(() => {
    setContrib({ posts: 47, comentarios: 238, upvotes: 1205, workshops: 12 });
    setTokens({ ganhos_total: 27131, gastos_total: 2740, saldo_atual: 5680, media_mensal: 420 });
  }, []);

  const n = (v: number) => v.toLocaleString('pt-BR');

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
            <span>Upvotes Recebidos</span>
            <strong className="c-green">{contrib ? n(contrib.upvotes) : '--'}</strong>
          </li>
          <li>
            <span>Workshops Ministrados</span>
            <strong className="c-green">{contrib ? n(contrib.workshops) : '--'}</strong>
          </li>
        </ul>
      </div>

      <div className="stats-card">
        <h3>Histórico de Tokens</h3>
        <ul className="stats-list">
          <li>
            <span>Tokens Ganhos (Total)</span>
            <strong className="c-green">+{tokens ? n(tokens.ganhos_total) : '--'}</strong>
          </li>
          <li>
            <span>Tokens Gastos (Total)</span>
            <strong className="c-red">-{tokens ? n(tokens.gastos_total) : '--'}</strong>
          </li>
          <li>
            <span>Saldo Atual</span>
            <strong className="c-pink">{tokens ? n(tokens.saldo_atual) : '--'}</strong>
          </li>
          <li>
            <span>Média Mensal</span>
            <strong className="c-green">+{tokens ? n(tokens.media_mensal) : '--'}</strong>
          </li>
        </ul>
      </div>
    </section>
  );
}
