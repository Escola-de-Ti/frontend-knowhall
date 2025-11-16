import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/perfil/PerfilHistorico.css';

type PerfilHistoricoProps = {
  nivel: number;
  tokens?: number | null;
  ranking?: number;
  xpAtual: number;
  xpNecessario: number;
  xpProximoNivel: number;
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
  xpAtual,
  xpProximoNivel,
  posts,
  upvotes,
  comentarios,
  workshops,
  medalSrc = '/medalhaHistorico.png',
  isOwnProfile = false,
}: PerfilHistoricoProps) {
  const navigate = useNavigate();
  const fmt = (n: number | null | undefined) => (n ?? 0).toLocaleString('pt-BR');
  const rankStr = `#${String(ranking || 0).padStart(2, '0')}`;
  
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

      <div className="xp-progress-bar">
        <div className="xp-info">
          <div className="xp-labels">
            <span className="xp-current">Nível {nivel}</span>
            <span className="xp-next">Nível {nivel + 1}</span>
          </div>
          <div className="xp-numbers">
            <span className="xp-value">{xpAtual.toLocaleString('pt-BR')} XP</span>
            <span className="xp-remaining">{xpProximoNivel.toLocaleString('pt-BR')} XP restantes</span>
          </div>
        </div>
        <div className="xp-bar-container">
          <div 
            className="xp-bar-fill" 
            style={{
              width: `${Math.min(100, (xpAtual / (xpAtual + xpProximoNivel)) * 100)}%`
            }}
          >
            <div className="xp-bar-glow"></div>
          </div>
        </div>
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
