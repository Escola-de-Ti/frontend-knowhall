import React, { useEffect } from 'react';

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
    <div
      role="dialog"
      aria-modal="true"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'grid', placeItems: 'center' }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15,15,20,.66)',
          backdropFilter: 'blur(2px)',
        }}
      />
      <section
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: 'min(960px, 92vw)',
          maxHeight: '88vh',
          overflow: 'auto',
          background: '#0b0f14',
          border: '1px solid #1c232c',
          borderRadius: 16,
          boxShadow: '0 10px 40px rgba(0,0,0,.5)',
          color: '#e6edf3',
        }}
      >
        <header
          style={{
            display: 'grid',
            gridTemplateColumns: '48px 1fr 32px',
            gap: 12,
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid #131a22',
            background: 'linear-gradient(180deg, rgba(255,255,255,.02), transparent)',
          }}
        >
          <div
            aria-hidden
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, #3c77ff, #7d3cff)',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            {post.autor.iniciais}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 18 }}>{post.titulo}</h3>
            <div
              style={{
                color: '#a8b3c0',
                fontSize: 12,
                display: 'inline-flex',
                gap: 6,
                alignItems: 'center',
              }}
            >
              <span>{post.autor.nome}</span>
              <span>•</span>
              <span>{post.tempo}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              width: 32,
              height: 32,
              border: '1px solid #1c232c',
              borderRadius: 8,
              background: '#0f141a',
              color: '#9fb3c8',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </header>

        <article style={{ padding: '16px 20px 24px 20px' }}>
          <p style={{ color: '#c7d1db', whiteSpace: 'pre-wrap' }}>{post.corpo}</p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {post.tags.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 12,
                  color: '#a8b3c0',
                  background: '#0f141a',
                  border: '1px solid #1c232c',
                  padding: '6px 10px',
                  borderRadius: 999,
                }}
              >
                #{t}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <button
              style={{
                display: 'inline-flex',
                gap: 6,
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid #1c232c',
                background: '#0f141a',
                color: '#c7d1db',
                cursor: 'pointer',
              }}
            >
              ⬆ <span>{post.metrica.upvotes}</span>
            </button>
            <button
              style={{
                display: 'inline-flex',
                gap: 6,
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid #1c232c',
                background: '#0f141a',
                color: '#c7d1db',
                cursor: 'pointer',
              }}
            >
              ⭐ <span>{post.metrica.supervotes}</span>
            </button>
            <span style={{ width: 1, height: 20, background: '#1c232c', margin: '0 6px' }} />
            <span style={{ color: '#9fb3c8', fontSize: 12 }}>
              {post.metrica.comentarios} comentários
            </span>
          </div>

          <section style={{ display: 'grid', gap: 12 }}>
            {comments.map((c) => (
              <div
                key={c.id}
                style={{
                  border: '1px solid #121a22',
                  background: '#0e1319',
                  borderRadius: 12,
                  padding: '10px 12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    aria-hidden
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      display: 'grid',
                      placeItems: 'center',
                      background: 'linear-gradient(135deg, #3c77ff, #7d3cff)',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {c.autor.iniciais}
                  </div>
                  <div style={{ color: '#a8b3c0', fontSize: 12 }}>
                    <span>{c.autor.nome}</span>
                    <span style={{ margin: '0 6px' }}>•</span>
                    <span>{c.tempo}</span>
                  </div>
                </div>
                <p style={{ color: '#d5dee7', margin: '8px 0 6px 0' }}>{c.texto}</p>
                {c.respostas?.length ? (
                  <div style={{ display: 'grid', gap: 8, marginTop: 8, marginLeft: 16 }}>
                    {c.respostas.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          border: '1px solid #121a22',
                          background: '#0e1319',
                          borderRadius: 12,
                          padding: '10px 12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div
                            aria-hidden
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              display: 'grid',
                              placeItems: 'center',
                              background: 'linear-gradient(135deg, #3c77ff, #7d3cff)',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {r.autor.iniciais}
                          </div>
                          <div style={{ color: '#a8b3c0', fontSize: 12 }}>
                            <span>{r.autor.nome}</span>
                            <span style={{ margin: '0 6px' }}>•</span>
                            <span>{r.tempo}</span>
                          </div>
                        </div>
                        <p style={{ color: '#d5dee7', margin: '8px 0 6px 0' }}>{r.texto}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </section>
        </article>
      </section>
    </div>
  );
}
