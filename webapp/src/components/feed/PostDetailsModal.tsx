import React, { useEffect } from 'react';
import '../../styles/feed/PostDetailsModal.css';

export type PostUser = { id?: number; nome: string; iniciais: string; nivel: number };
export type PostDetails = {
  id: number;
  titulo: string;
  corpo: string;
  autor: PostUser;
  tags: string[];
  metrica: { upvotes: number; supervotes: number; comentarios: number };
  tempo: string;
};
export type PostCommentModel = {
  id: number;
  autor: PostUser;
  texto: string;
  tempo: string;
  upvotes: number;
  supervotes: number;
  respostas?: PostCommentModel[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  post: PostDetails | null;
  comments: PostCommentModel[];
  onResponderClick?: (parentId: number) => void;
};

export default function PostDetailsModal({
  open,
  onClose,
  post,
  comments,
  onResponderClick,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !post) return null;

  return (
    <div className="kh-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="kh-modal-backdrop" />
      <section className="kh-modal-panel" onClick={(e) => e.stopPropagation()}>
        <header className="kh-modal-header">
          {/* avatar do card */}
          <div className="post-avatar" aria-hidden>
            {post.autor.iniciais}
          </div>

          <div className="head-col">
            <h3 className="title">{post.titulo}</h3>
            <div className="meta">
              <span className="autor">{post.autor.nome}</span>
              <span className="dot" />
              {/* nível do autor (mesmo estilo do card) */}
              <span className="level-pill">
                <span className="level-text">Nvl. {post.autor.nivel}</span>
              </span>
              <span className="dot" />
              <span className="tempo">{post.tempo}</span>
            </div>
          </div>

          <button className="close" onClick={onClose} aria-label="Fechar" />
        </header>

        <article className="kh-modal-body">
          <p className="descricao">{post.corpo}</p>

          <div className="tags">
            {post.tags.map((t) => (
              <span key={t} className="tag">
                #{t}
              </span>
            ))}
          </div>

          {/* KPIs do post: upvote, superlike e comentários (balão) */}
          <div className="votes">
            <button className="btn up" type="button" aria-label="Upvote">
              <span className="ico-up" aria-hidden />
              <span>{post.metrica.upvotes}</span>
            </button>
            <button className="btn super" type="button" aria-label="Superlike">
              <span className="ico-star" aria-hidden />
              <span>{post.metrica.supervotes}</span>
            </button>
            <button className="btn com" type="button" aria-label="Comentários">
              <span className="ico-com" aria-hidden />
              <span>{post.metrica.comentarios}</span>
            </button>
          </div>

          {/* Separador “Comentários” com linha e balão roxo */}
          <div className="comments-sep">
            <span className="ico-com" aria-hidden />
            <span className="lbl">Comentários</span>
          </div>

          <section className="comments">
            {comments.map((c) => (
              <CommentNode key={c.id} c={c} depth={0} onResponderClick={onResponderClick} />
            ))}
          </section>
        </article>
      </section>
    </div>
  );
}

function CommentNode({
  c,
  depth = 0,
  onResponderClick,
}: {
  c: PostCommentModel;
  depth?: number;
  onResponderClick?: (parentId: number) => void;
}) {
  return (
    <div className="comment" style={{ marginLeft: depth * 16 }}>
      <div className="comment-head">
        {/* avatar pequeno reaproveitando o do card */}
        <div className="post-avatar post-avatar--sm" aria-hidden>
          {c.autor.iniciais}
        </div>
        <div className="author">
          {/* Comentário só com o NOME (sem tempo, conforme pedido) */}
          <span className="nome">{c.autor.nome}</span>
        </div>
      </div>

      <p className="comment-text">{c.texto}</p>

      <div className="comment-actions">
        <button className="btn sm up" type="button" aria-label="Upvote comentário">
          <span className="ico-up" aria-hidden />
          <span>{c.upvotes}</span>
        </button>
        <button className="btn sm super" type="button" aria-label="Superlike comentário">
          <span className="ico-star" aria-hidden />
          <span>{c.supervotes}</span>
        </button>

        {/* Responder */}
        <button
          className="btn sm link"
          type="button"
          onClick={() => onResponderClick?.(c.id)}
          aria-label="Responder comentário"
        >
          <span className="ico-com" aria-hidden />
          <span>Responder</span>
        </button>
      </div>

      {!!c.respostas?.length && (
        <div className="children">
          {c.respostas!.map((r) => (
            <CommentNode key={r.id} c={r} depth={depth + 1} onResponderClick={onResponderClick} />
          ))}
        </div>
      )}
    </div>
  );
}
