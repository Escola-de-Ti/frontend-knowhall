import React, { useState } from 'react';
import '../../styles/feed/Post.css';

export type PostModel = {
  id: number;
  autor: { id?: number; nome: string; iniciais: string; nivel: number };
  titulo: string;
  corpo: string;
  tags: string[];
  metrica: { comentarios: number; upvotes: number };
  tempo: string;
  jaVotou: boolean; // ← NOVO: Indica se o usuário já votou neste post
};

type Props = {
  post: PostModel;
  onMoreClick?: (id: number) => void;
  onVote?: (postId: number) => Promise<void>; // ← NOVO: Handler para votar
};

export default function Post({ post, onMoreClick, onVote }: Props) {
  const [isVoting, setIsVoting] = useState(false);

  /**
   * Handler do botão de upvote
   */
  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isVoting || !onVote) return;

    setIsVoting(true);
    try {
      await onVote(post.id);
    } catch (error) {
      console.error('Erro ao votar:', error);
    } finally {
      setIsVoting(false);
    }
  };

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
          </div>
        </div>
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
          className={`kpi kpi-up ${post.jaVotou ? 'active' : ''} ${isVoting ? 'voting' : ''}`}
          type="button"
          aria-label={post.jaVotou ? 'Remover voto' : 'Votar'}
          onClick={handleVote}
          disabled={isVoting}
        >
          <span className="ico-up" aria-hidden />
          <span className="kpi-val">{post.metrica.upvotes}</span>
        </button>
      </footer>
    </article>
  );
}