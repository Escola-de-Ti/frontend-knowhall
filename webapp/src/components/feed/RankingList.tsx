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
        <div>
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

              <div className="rk-info">
                <strong className="rk-name">{u.nome}</strong>
                <span className="rk-level">Nvl. {u.nivel}</span>
              </div>

              <div className="rk-tokens">
                <img src="/token_ico.svg" alt="Token" className="token-ico" />
                <span className="rk-txt">{u.tokens}</span>
              </div>
            </li>
          );
        })}
      </ul>

      <button className="rk-more" onClick={onVerMais}>
        + Ver mais
      </button>
    </aside>
  );
}
