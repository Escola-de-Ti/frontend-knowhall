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
        <span className="ico-plus" aria-hidden />
        <span className="label">Criar Post</span>
      </button>

      <button className="btn-ghost" onClick={onFiltros}>
        <span className="ico-filter" aria-hidden />
        <span className="label label-gradient">Filtros</span>
      </button>
    </div>
  );
}
