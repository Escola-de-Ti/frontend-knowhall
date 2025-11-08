import React from 'react';
import '../../styles/feed/RankingList.css';

export type RankUser = {
  id: number;
  nome: string;
  iniciais: string;
  nivel: number;
  tokens: string;
};

type Props = { users: RankUser[]; onVerMais?: () => void };

export default function RankingList({ users, onVerMais }: Props) {
  return (
    <aside className="rk-panel">
      <header className="rk-head">
        <span className="rk-trophy" aria-hidden />
        <div className="rk-headtxt">
          <h3>Top 10 Ranking</h3>
          <p>Os melhores desenvolvedores da comunidade</p>
        </div>
      </header>

      <ul className="rk-list">
        {users.map((u, idx) => {
          const pos = idx + 1;
          const topClass = pos <= 3 ? `rk-top rk-${pos}` : '';
          return (
            <li key={u.id} className={`rk-item ${topClass}`}>
              <span className="rk-pos">{pos}</span>

              <div className="rk-avatar">{u.iniciais}</div>

              <div className="rk-main">
                <strong className="rk-name" title={u.nome}>
                  {u.nome}
                </strong>

                <div className="rk-badges">
                  <span className="pill level-pill">Nvl. {u.nivel}</span>
                  <span className="pill token-pill">
                    <img src="/token_ico.svg" alt="" className="rk-token-ico" />
                    <span className="rk-token-val">{u.tokens}</span>
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <button className="rk-more" onClick={onVerMais} type="button">
        <span className="rk-more-plus" aria-hidden />
        <span className="rk-more-text">Ver mais</span>
      </button>
    </aside>
  );
}
