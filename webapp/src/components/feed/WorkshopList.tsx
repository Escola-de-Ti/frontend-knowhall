import React from 'react';
import '../../styles/feed/WorkshopList.css';

export type WorkshopItem = {
  id: number;
  titulo: string;
  data: string;
  vagas: string;
  duracao: string;
};

type Props = { itens: WorkshopItem[]; onVerMais?: () => void };

export default function WorkshopList({ itens, onVerMais }: Props) {
  return (
    <aside className="ws-panel">
      <header className="ws-head">
        <span className="ws-ico" aria-hidden />
        <div className="ws-txt">
          <h3>Workshops</h3>
          <p>Fique atento às novidades da semana!</p>
        </div>
      </header>

      <ul className="ws-list">
        {itens.map((w) => (
          <li key={w.id} className="ws-item" role="button" tabIndex={0}>
            <div className="ws-line1">
              <span className="ws-title ws-title-pixel">{w.titulo}</span>
              <span className="ws-pill">
                <i className="ws-send" aria-hidden />
              </span>
            </div>

            <div className="ws-meta">
              <span className="meta">
                <i className="m-ico m-cal" />
                {w.data}
              </span>
              <span className="meta">
                <i className="m-ico m-users" />
                {w.vagas}
              </span>
              <span className="meta">
                <i className="m-ico m-time" />
                {w.duracao}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <button className="ws-more" onClick={onVerMais}>
        <span className="ws-more-plus">+</span> <span className="ws-more-text">Ver mais</span>
      </button>
    </aside>
  );
}