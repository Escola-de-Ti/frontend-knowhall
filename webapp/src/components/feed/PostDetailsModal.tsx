import React, { useEffect, useMemo, useState } from 'react';
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
};

export default function PostDetailsModal({ open, onClose, post, comments }: Props) {
  const [localComments, setLocalComments] = useState<PostCommentModel[]>([]);
  const [replyTarget, setReplyTarget] = useState<null | 'post' | number>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (!open) return;
    setLocalComments(comments);
    setReplyTarget(null);
    setReplyText('');
  }, [open, comments]);

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

  const CURRENT_USER: PostUser = useMemo(() => ({ nome: 'Você', iniciais: 'VC', nivel: 1 }), []);

  if (!open || !post) return null;

  function openReplyForPost() {
    setReplyTarget('post');
    setReplyText('');
  }
  function openReplyForComment(id: number) {
    setReplyTarget(id);
    setReplyText('');
  }
  function cancelReply() {
    setReplyTarget(null);
    setReplyText('');
  }

  function submitReply() {
    const text = replyText.trim();
    if (!text) return;

    const newItem: PostCommentModel = {
      id: Date.now(),
      autor: CURRENT_USER,
      texto: text,
      tempo: 'agora',
      upvotes: 0,
      supervotes: 0,
      respostas: [],
    };

    if (replyTarget === 'post') {
      setLocalComments((prev) => [newItem, ...prev]);
    } else if (typeof replyTarget === 'number') {
      setLocalComments((prev) => addReply(prev, replyTarget, newItem));
    }
    setReplyTarget(null);
    setReplyText('');
  }

  function onReplyKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      submitReply();
    }
  }

  return (
    <div className="kh-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="kh-modal-backdrop" />
      <section className="kh-modal-panel" onClick={(e) => e.stopPropagation()}>
        <header className="kh-modal-header">
          <div className="post-avatar" aria-hidden>
            {post.autor.iniciais}
          </div>

          <div className="head-col">
            <h3 className="title">{post.titulo}</h3>
            <div className="meta">
              <span className="autor">{post.autor.nome}</span>
              <span className="dot" />
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

          <div className="votes">
            <button className="btn up" type="button" aria-label="Upvote">
              <span className="ico-up" aria-hidden />
              <span>{post.metrica.upvotes}</span>
            </button>
            <button className="btn super" type="button" aria-label="Superlike">
              <span className="ico-star" aria-hidden />
              <span>{post.metrica.supervotes}</span>
            </button>
            <button
              className="btn com"
              type="button"
              aria-label="Comentários"
              onClick={openReplyForPost}
            >
              <span className="ico-com" aria-hidden />
              <span>{post.metrica.comentarios}</span>
            </button>
          </div>

          {replyTarget === 'post' && (
            <ReplyBox
              value={replyText}
              onChange={setReplyText}
              onCancel={cancelReply}
              onSubmit={submitReply}
              onKeyDown={onReplyKeyDown}
              placeholder="Comentar este post…"
            />
          )}

          <div className="comments-sep">
            <span className="ico-com" aria-hidden />
            <span className="lbl">Comentários</span>
          </div>

          <section className="comments">
            {localComments.map((c) => (
              <CommentNode
                key={c.id}
                c={c}
                depth={0}
                onResponderClick={openReplyForComment}
                replyTarget={replyTarget}
                replyText={replyText}
                setReplyText={setReplyText}
                cancelReply={cancelReply}
                submitReply={submitReply}
                onReplyKeyDown={onReplyKeyDown}
              />
            ))}
          </section>
        </article>
      </section>
    </div>
  );
}

function addReply(
  tree: PostCommentModel[],
  parentId: number,
  item: PostCommentModel
): PostCommentModel[] {
  return tree.map((n) => {
    if (n.id === parentId) {
      const respostas = Array.isArray(n.respostas) ? n.respostas : [];
      return { ...n, respostas: [item, ...respostas] };
    }
    if (n.respostas?.length) {
      return { ...n, respostas: addReply(n.respostas, parentId, item) };
    }
    return n;
  });
}

function ReplyBox({
  value,
  onChange,
  onCancel,
  onSubmit,
  onKeyDown,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}) {
  return (
    <div className="reply-box">
      <textarea
        className="reply-input"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
      <div className="reply-actions">
        <button type="button" className="btn sm" onClick={onCancel}>
          Cancelar
        </button>
        <button
          type="button"
          className="btn sm primary"
          onClick={onSubmit}
          disabled={!value.trim()}
          title="Ctrl+Enter para enviar"
        >
          <span className="ico-send" aria-hidden />
          <span>Enviar</span>
        </button>
      </div>
    </div>
  );
}

function CommentNode({
  c,
  depth,
  onResponderClick,
  replyTarget,
  replyText,
  setReplyText,
  cancelReply,
  submitReply,
  onReplyKeyDown,
}: {
  c: PostCommentModel;
  depth: number;
  onResponderClick: (parentId: number) => void;
  replyTarget: null | 'post' | number;
  replyText: string;
  setReplyText: (v: string) => void;
  cancelReply: () => void;
  submitReply: () => void;
  onReplyKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  const isReplyingHere = replyTarget === c.id;

  return (
    <div className="comment" style={{ marginLeft: depth * 16 }}>
      <div className="comment-head">
        <div className="post-avatar post-avatar--sm" aria-hidden>
          {c.autor.iniciais}
        </div>
        <div className="author">
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
        <button
          className="btn sm link"
          type="button"
          onClick={() => onResponderClick(c.id)}
          aria-label="Responder comentário"
        >
          <span className="ico-com" aria-hidden />
          <span>Responder</span>
        </button>
      </div>

      {isReplyingHere && (
        <ReplyBox
          value={replyText}
          onChange={setReplyText}
          onCancel={cancelReply}
          onSubmit={submitReply}
          onKeyDown={onReplyKeyDown}
          placeholder="Responder este comentário…"
        />
      )}

      {!!c.respostas?.length && (
        <div className="children">
          {c.respostas!.map((r) => (
            <CommentNode
              key={r.id}
              c={r}
              depth={depth + 1}
              onResponderClick={onResponderClick}
              replyTarget={replyTarget}
              replyText={replyText}
              setReplyText={setReplyText}
              cancelReply={cancelReply}
              submitReply={submitReply}
              onReplyKeyDown={onReplyKeyDown}
            />
          ))}
        </div>
      )}
    </div>
  );
}
