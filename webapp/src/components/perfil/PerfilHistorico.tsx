import React from 'react';
import '../../styles/perfil/PerfilHistorico.css';

type PerfilHistoricoProps = {
  nivel: number;
  tokens: number;
  ranking: number;
  xpAtual: number;
  xpNecessario: number;
  progresso: number; // 0–100
  posts: number;
  upvotes: number;
  comentarios: number;
  workshops: number;
  medalSrc?: string;
};

export default function PerfilHistorico({
  nivel,
  tokens,
  ranking,
  xpAtual,
  xpNecessario,
  progresso,
  posts,
  upvotes,
  comentarios,
  workshops,
  medalSrc = '/medalhaHistorico.png',
}: PerfilHistoricoProps) {
  const fmt = (n: number) => n.toLocaleString('pt-BR');
  const rankStr = `#${String(ranking).padStart(2, '0')}`;

  return (
    <section className="history-container" aria-labelledby="history-title">
      <header className="history-header">
        <button id="history-title" className="history-title" type="button">
          <span className="title-icon" aria-hidden />
          Histórico de transferências
        </button>

        <div className="ranking-global" aria-label="Ranking Global">
          <span className="ranking-label">Ranking Global</span>
          <img className="ranking-medal" src={medalSrc} alt="" />
          <div className="position-ranking">{rankStr}</div>
        </div>
      </header>

      <div className="history-chips">
        <span className="chip chip-level">Nvl. {nivel}</span>
        <span className="chip chip-tokens">T {fmt(tokens)}</span>
      </div>

      <div className="next-level-container">
        <span className="next-level-label">Progresso para o próximo nível</span>
        <div
          className="next-level-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progresso}
        >
          <div className="next-level-progress" style={{ width: `${progresso}%` }} />
        </div>
        <span className="xp-legend">
          {fmt(xpAtual)} / {fmt(xpNecessario)} XP
        </span>
      </div>

      <div className="kpis">
        <div className="kpi kpi-posts">
          <strong>{fmt(posts)}</strong>
          <span>Posts</span>
        </div>
        <div className="kpi kpi-upvotes">
          <strong>{fmt(upvotes)}</strong>
          <span>Upvotes</span>
        </div>
        <div className="kpi kpi-comments">
          <strong>{fmt(comentarios)}</strong>
          <span>Comentários</span>
        </div>
        <div className="kpi kpi-workshops">
          <strong>{fmt(workshops)}</strong>
          <span>Workshops</span>
        </div>
      </div>
    </section>
  );
}
