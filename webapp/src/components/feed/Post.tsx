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
    <article className="post-card">
      <header className="post-head">
        <div className="post-avatar">{post.autor.iniciais}</div>

        <div className="post-meta">
          <strong className="post-autor">{post.autor.nome}</strong>
          <div className="post-sub">
            <span className="time">{post.tempo}</span>
            <span className="dot" />
            <span className="level-pill">Nvl. {post.autor.nivel}</span>
          </div>
        </div>

        <button
          className="post-more"
          aria-label="Mais opções"
          onClick={() => onMoreClick?.(post.id)}
        >
          <span />
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
        <div className="kpi kpi-up">
          <span className="ico-up" aria-hidden />
          <span className="kpi-val">{post.metrica.upvotes}</span>
        </div>
        <div className="kpi kpi-com">
          <span className="ico-com" aria-hidden />
          <span className="kpi-val">{post.metrica.comentarios}</span>
        </div>
      </footer>
    </article>
  );
}
