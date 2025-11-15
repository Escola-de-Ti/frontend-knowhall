import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/feed/Post.css';

export type PostModel = {
  id: number;
  autor: { id?: number; nome: string; iniciais: string; nivel: number };
  titulo: string;
  corpo: string;
  tags: string[];
  metrica: { comentarios: number; upvotes: number };
  tempo: string;
  jaVotou: boolean;
};

type Props = {
  post: PostModel;
  onMoreClick?: (id: number) => void;
  onVote?: (postId: number) => Promise<void>;
};

export default function Post({ post, onMoreClick, onVote }: Props) {
  const navigate = useNavigate();
  const [isVoting, setIsVoting] = useState(false);

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

  const handleAutorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.autor.id) {
      navigate(`/perfil/${post.autor.id}`);
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
          <strong 
            className="post-autor" 
            onClick={handleAutorClick}
            style={{ cursor: 'pointer' }}
          >
            {post.autor.nome}
          </strong>
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