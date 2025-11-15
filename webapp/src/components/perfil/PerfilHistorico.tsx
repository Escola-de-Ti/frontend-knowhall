import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/perfil/PerfilHistorico.css';

type PerfilHistoricoProps = {
  nivel: number;
  tokens?: number | null;
  ranking?: number;
  xpAtual: number;
  xpNecessario: number;
  progresso: number;
  posts?: number;
  upvotes?: number;
  comentarios?: number;
  workshops?: number;
  medalSrc?: string;
  isOwnProfile?: boolean;
};

export default function PerfilHistorico({
  nivel,
  tokens,
  ranking,
  posts,
  upvotes,
  comentarios,
  workshops,
  medalSrc = '/medalhaHistorico.png',
  isOwnProfile = false,
}: PerfilHistoricoProps) {
  const navigate = useNavigate();
  const fmt = (n: number | null | undefined) => (n ?? 0).toLocaleString('pt-BR');
  const rankStr = `#${String(ranking ?? 0).padStart(2, '0')}`;

  return (
    <section className="history-container" aria-labelledby="history-title">
      <header className="history-header">
        {isOwnProfile && (
          <button
            id="history-title"
            className="history-title"
            type="button"
            onClick={() => navigate('/historico-transacoes')}
          >
            <span className="title-icon" aria-hidden />
            Histórico de transferências
          </button>
        )}

        <div className="ranking-global" aria-label="Ranking Global">
          <span className="ranking-label">Ranking Global</span>
          <img className="ranking-medal" src={medalSrc} alt="" />
          <div className="position-ranking">{rankStr}</div>
        </div>
      </header>

      <div className="history-chips">
        <span className="chip chip-level">Nvl. {nivel}</span>
        {tokens != null && <span className="chip chip-tokens">T {fmt(tokens)}</span>}
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
          <span>Comentario</span>
        </div>
        <div className="kpi kpi-workshops">
          <strong>{fmt(workshops)}</strong>
          <span>Workshops</span>
        </div>
      </div>
    </section>
  );
}
