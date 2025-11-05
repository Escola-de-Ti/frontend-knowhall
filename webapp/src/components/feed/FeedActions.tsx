import React from 'react';
import '../../styles/feed/FeedActions.css';

type Props = {
  onCriarPost: () => void;
  onFiltros: () => void;
};

export default function FeedActions({ onCriarPost, onFiltros }: Props) {
  return (
    <div className="feed-actions">
      <button className="btn-primary" onClick={onCriarPost}>
        + Criar Post
      </button>
      <button className="btn-ghost" onClick={onFiltros}>
        ⚙️ Filtros
      </button>
    </div>
  );
}
