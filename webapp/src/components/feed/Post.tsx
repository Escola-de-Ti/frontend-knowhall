import React from 'react';
import '../../styles/feed/Post.css';

export type PostModel = {
  id: number;
  autor: { id?: number; nome: string; iniciais: string; nivel: number };
  titulo: string;
  corpo: string;
  tags: string[];
  metrica: { comentarios: number; upvotes: number };
  tempo: string;
};

type Props = { post: PostModel; onMoreClick?: (id: number) => void };

export default function Post({ post, onMoreClick }: Props) {
  return (
    <article
      className="post-card"
      onClick={() => onMoreClick?.(post.id)}
      style={{ cursor: 'pointer' }}
    >
      <header className="post-head">
        <div className="post-avatar" aria-hidden>
          {post.autor.iniciais}
        </div>

        <div className="post-meta">
          <strong className="post-autor">{post.autor.nome}</strong>
          <div className="post-sub">
            <span className="post-time">{post.tempo}</span>
            <span className="dot" />
            <span className="level-pill">
              <span className="level-text">Nvl. {post.autor.nivel}</span>
            </span>
          </div>
        </div>

        <button
          className="post-more"
          aria-label="Mais opções"
          onClick={(e) => {
            e.stopPropagation();
            onMoreClick?.(post.id);
          }}
        >
          …
        </button>
      </header>

      <h3 className="post-title">{post.titulo}</h3>
      <p className="post-body">{post.corpo}</p>

      <div className="post-tags">
        {post.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>

      <footer className="post-footer">
        <button
          className="kpi kpi-up"
          type="button"
          aria-label="Upvotes"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="ico-up" aria-hidden />
          <span className="kpi-val">{post.metrica.upvotes}</span>
        </button>

        <button
          className="kpi kpi-com"
          type="button"
          aria-label="Comentários"
          onClick={(e) => {
            e.stopPropagation();
            onMoreClick?.(post.id);
          }}
        >
          <span className="ico-com" aria-hidden />
          <span className="kpi-val">{post.metrica.comentarios}</span>
        </button>
      </footer>
    </article>
  );
}
