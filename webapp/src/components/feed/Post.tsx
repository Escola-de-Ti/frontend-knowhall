import React from 'react';
import '../../styles/feed/Post.css';

export type Post = {
  id: number;
  autor: { nome: string; iniciais: string; nivel: number };
  titulo: string;
  corpo: string;
  tags: string[];
  metrica: { comentarios: number; upvotes: number };
  tempo: string;
};

type Props = { post: Post };

export default function PostCard({ post }: Props) {
  return (
    <article className="post-card">
      <header className="post-head">
        <div className="post-avatar">{post.autor.iniciais}</div>
        <div className="post-meta">
          <strong className="post-autor">{post.autor.nome}</strong>
          <div className="post-sub">
            <span>{post.tempo}</span>
            <span className="dot" />
            <span>Nvl. {post.autor.nivel}</span>
          </div>
        </div>
        <button className="post-more" aria-label="Mais opções">
          ⋯
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
        <div className="pf-item">💬 {post.metrica.comentarios}</div>
        <div className="pf-item">⬆️ {post.metrica.upvotes}</div>
      </footer>
    </article>
  );
}
