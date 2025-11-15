import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/feed/PostDetailsModal.css';
import { postService, PostDetalhesDTO } from '../../services/postService';
import { comentarioService, ComentarioResponseDTO } from '../../services/comentarioService';
import { votoService } from '../../services/votoService';
import { getInitials, getRelativeTime } from '../../utils/feedHelpers';

export type PostUser = { id?: number; nome: string; iniciais: string; nivel: number };

export type PostDetails = {
  id: number;
  titulo: string;
  corpo: string;
  autor: PostUser;
  tags: string[];
  metrica: { upvotes: number; supervotes: number; comentarios: number };
  tempo: string;
  jaVotou: boolean;
};

export type PostCommentModel = {
  id: number;
  autor: PostUser;
  texto: string;
  tempo: string;
  upvotes: number;
  supervotes: number;
  respostas?: PostCommentModel[];
  hasMoreReplies?: boolean;
  repliesLoaded?: boolean; 
  totalRespostas?: number; 
  jaVotou?: boolean;
  jaSuperVotou?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  post: PostDetails | null;
};

export default function PostDetailsModal({ open, onClose, post: initialPost }: Props) {
  const navigate = useNavigate();
  const [details, setDetails] = useState<PostDetails | null>(null);
  const [localComments, setLocalComments] = useState<PostCommentModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState<Set<number>>(new Set());
  const [submittingComment, setSubmittingComment] = useState(false);
  const [votingPost, setVotingPost] = useState(false);
  const [votingComments, setVotingComments] = useState<Set<number>>(new Set());
  const [superVotingComments, setSuperVotingComments] = useState<Set<number>>(new Set());

  const [replyTarget, setReplyTarget] = useState<null | 'post' | number>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (!open || !initialPost) return;

    setLoading(true);
    setReplyTarget(null);
    setReplyText('');
    setDetails(initialPost);
    setLocalComments([]);
    setLoadingReplies(new Set());

    const fetchDetails = async () => {
      try {
        const data = await postService.getPostDetails(initialPost.id);

        const mappedPost: PostDetails = {
          id: data.id,
          titulo: data.titulo,
          corpo: data.descricao,
          autor: {
            id: data.usuarioId,
            nome: data.usuarioNome,
            iniciais: getInitials(data.usuarioNome),
            nivel: 10,
          },
          tags: data.tags.map(t => t.name),
          metrica: {
            upvotes: data.totalUpVotes,
            supervotes: 0,
            comentarios: data.comentarios.length,
          },
          tempo: getRelativeTime(data.dataCriacao),
          jaVotou: (data as any).jaVotou || false,
        };

        const rootComments = data.comentarios
          .filter(c => !c.comentarioPaiId)
          .map(dto => mapComentarioDTO(dto));

        setDetails(mappedPost);
        setLocalComments(rootComments);
      } catch (error) {
        console.error('Erro ao carregar detalhes do post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [open, initialPost]);

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

  if (!open) return null;

  const activePost = details || initialPost;
  if (!activePost) return null;

  function mapComentarioDTO(dto: ComentarioResponseDTO): PostCommentModel {
    return {
      id: dto.id,
      autor: {
        id: dto.usuarioId,
        nome: dto.usuarioNome,
        iniciais: getInitials(dto.usuarioNome),
        nivel: 1,
      },
      texto: dto.texto,
      tempo: getRelativeTime(dto.dataCriacao),
      upvotes: dto.totalUpVotes,
      supervotes: dto.totalSuperVotes,
      respostas: [],
      repliesLoaded: false,
      hasMoreReplies: false,
      jaVotou: (dto as any).jaVotou || false,
      jaSuperVotou: (dto as any).jaSuperVotou || false,
    };
  }

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

  async function submitReply() {
    const text = replyText.trim();
    if (!text || !activePost) return;

    setSubmittingComment(true);

    try {
      const createData = {
        postId: activePost.id,
        texto: text,
        comentarioPaiId: replyTarget === 'post' ? null : (replyTarget as number),
      };

      const novoComentario = await comentarioService.criar(createData);
      const mapped = mapComentarioDTO(novoComentario);

      if (replyTarget === 'post') {
        setLocalComments((prev) => [mapped, ...prev]);
        
        setDetails((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            metrica: {
              ...prev.metrica,
              comentarios: prev.metrica.comentarios + 1,
            },
          };
        });
      } else if (typeof replyTarget === 'number') {
        setLocalComments((prev) => addReplyToTree(prev, replyTarget, mapped));
      }

      setReplyTarget(null);
      setReplyText('');
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
      alert('Erro ao enviar comentário. Tente novamente.');
    } finally {
      setSubmittingComment(false);
    }
  }

  async function loadReplies(comentarioId: number) {
    if (loadingReplies.has(comentarioId)) return;

    setLoadingReplies((prev) => new Set(prev).add(comentarioId));

    try {
      const response = await comentarioService.buscarRespostas(comentarioId, 10);
      const mappedReplies = response.comentarios.map(mapComentarioDTO);

      setLocalComments((prev) =>
        updateCommentReplies(prev, comentarioId, mappedReplies, response.hasMore)
      );
    } catch (error) {
      console.error('Erro ao carregar respostas:', error);
    } finally {
      setLoadingReplies((prev) => {
        const next = new Set(prev);
        next.delete(comentarioId);
        return next;
      });
    }
  }

  async function handleVoteComment(comentarioId: number) {
    if (votingComments.has(comentarioId)) return;

    setVotingComments((prev) => new Set(prev).add(comentarioId));

    try {
      const response = await votoService.votarEmComentario(comentarioId.toString());

      setLocalComments((prev) =>
        updateCommentVotes(prev, comentarioId, response.totalUpVotes, response.votado)
      );
    } catch (error) {
      console.error('Erro ao votar no comentário:', error);
    } finally {
      setVotingComments((prev) => {
        const next = new Set(prev);
        next.delete(comentarioId);
        return next;
      });
    }
  }

  async function handleSuperVoteComment(comentarioId: number) {
    if (superVotingComments.has(comentarioId)) return;

    setSuperVotingComments((prev) => new Set(prev).add(comentarioId));

    try {
      const response = await votoService.superVotarEmComentario(comentarioId.toString());

      setLocalComments((prev) =>
        updateCommentSuperVotes(prev, comentarioId, response.totalUpVotes, response.votado)
      );
    } catch (error) {
      console.error('Erro ao super votar no comentário:', error);
    } finally {
      setSuperVotingComments((prev) => {
        const next = new Set(prev);
        next.delete(comentarioId);
        return next;
      });
    }
  }

  async function handleVotePost() {
    if (votingPost || !activePost) return;

    setVotingPost(true);

    try {
      const response = await votoService.votarEmPost(activePost.id.toString());

      setDetails((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          metrica: {
            ...prev.metrica,
            upvotes: response.totalUpVotes,
          },
          jaVotou: response.votado,
        };
      });
    } catch (error) {
      console.error('Erro ao votar no post:', error);
    } finally {
      setVotingPost(false);
    }
  }

  function onReplyKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      submitReply();
    }
  }

  /**
   * Navega para o perfil do autor do post
   */
  function handleAutorClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (activePost?.autor?.id) {
      navigate(`/perfil/${activePost.autor.id}`);
    }
  }

  return (
    <div className="kh-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="kh-modal-backdrop" />
      <section className="kh-modal-panel" onClick={(e) => e.stopPropagation()}>
        <header className="kh-modal-header">
          <div className="post-avatar" aria-hidden>
            {activePost.autor.iniciais}
          </div>

          <div className="head-col">
            <h3 className="title">{activePost.titulo}</h3>
            <div className="meta">
              <span 
                className="autor" 
                onClick={handleAutorClick}
                style={{ cursor: 'pointer' }}
              >
                {activePost.autor.nome}
              </span>
              <span className="dot" />
              <span className="level-pill">
                <span className="level-text">Nvl. {activePost.autor.nivel}</span>
              </span>
              <span className="dot" />
              <span className="tempo">{activePost.tempo}</span>
            </div>
          </div>

          <button className="close" onClick={onClose} aria-label="Fechar" />
        </header>

        <article className="kh-modal-body">
          <p className="descricao">{activePost.corpo}</p>

          <div className="tags">
            {activePost.tags.map((t) => (
              <span key={t} className="tag">
                #{t}
              </span>
            ))}
          </div>

          <div className="votes">
            <button
              className={`btn up ${activePost.jaVotou ? 'active' : ''} ${votingPost ? 'voting' : ''}`}
              type="button"
              onClick={handleVotePost}
              disabled={votingPost}
              aria-label={activePost.jaVotou ? 'Remover voto' : 'Votar no post'}
            >
              <span className="ico-up" aria-hidden />
              <span>{activePost.metrica.upvotes}</span>
            </button>          
            <button className="btn com" type="button" onClick={openReplyForPost}>
              <span className="ico-com" aria-hidden />
              <span>{activePost.metrica.comentarios}</span>
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
              disabled={submittingComment}
              isSubmitting={submittingComment}
            />
          )}

          <div className="comments-sep">
            <span className="ico-com" aria-hidden />
            <span className="lbl">Comentários ({localComments.length})</span>
            {loading && <span style={{ marginLeft: 10, fontSize: '0.8em' }}>Carregando...</span>}
          </div>

          <section className="comments">
            {localComments.map((c) => (
              <CommentNode
                key={c.id}
                c={c}
                depth={0}
                onResponderClick={openReplyForComment}
                onLoadReplies={loadReplies}
                onVoteComment={handleVoteComment}
                onSuperVoteComment={handleSuperVoteComment}
                replyTarget={replyTarget}
                replyText={replyText}
                setReplyText={setReplyText}
                cancelReply={cancelReply}
                submitReply={submitReply}
                onReplyKeyDown={onReplyKeyDown}
                isLoadingReplies={loadingReplies.has(c.id)}
                submittingComment={submittingComment}
                isVoting={votingComments.has(c.id)}
                isSuperVoting={superVotingComments.has(c.id)}
                onAutorClick={(autorId) => navigate(`/perfil/${autorId}`)}
              />
            ))}
          </section>
        </article>
      </section>
    </div>
  );
}

function updateCommentReplies(
  tree: PostCommentModel[],
  comentarioId: number,
  respostas: PostCommentModel[],
  hasMore: boolean
): PostCommentModel[] {
  return tree.map((n) => {
    if (n.id === comentarioId) {
      return {
        ...n,
        respostas,
        repliesLoaded: true,
        hasMoreReplies: hasMore,
      };
    }
    if (n.respostas?.length) {
      return {
        ...n,
        respostas: updateCommentReplies(n.respostas, comentarioId, respostas, hasMore),
      };
    }
    return n;
  });
}

function updateCommentVotes(
  tree: PostCommentModel[],
  comentarioId: number,
  newUpvotes: number,
  jaVotou: boolean
): PostCommentModel[] {
  return tree.map((n) => {
    if (n.id === comentarioId) {
      return {
        ...n,
        upvotes: newUpvotes,
        jaVotou,
      };
    }
    if (n.respostas?.length) {
      return {
        ...n,
        respostas: updateCommentVotes(n.respostas, comentarioId, newUpvotes, jaVotou),
      };
    }
    return n;
  });
}

function updateCommentSuperVotes(
  tree: PostCommentModel[],
  comentarioId: number,
  newSuperVotes: number,
  jaSuperVotou: boolean
): PostCommentModel[] {
  return tree.map((n) => {
    if (n.id === comentarioId) {
      return {
        ...n,
        supervotes: newSuperVotes,
        jaSuperVotou,
      };
    }
    if (n.respostas?.length) {
      return {
        ...n,
        respostas: updateCommentSuperVotes(n.respostas, comentarioId, newSuperVotes, jaSuperVotou),
      };
    }
    return n;
  });
}

function addReplyToTree(
  tree: PostCommentModel[],
  parentId: number,
  item: PostCommentModel
): PostCommentModel[] {
  return tree.map((n) => {
    if (n.id === parentId) {
      const respostas = Array.isArray(n.respostas) ? n.respostas : [];
      return { ...n, respostas: [item, ...respostas], repliesLoaded: true };
    }
    if (n.respostas?.length) {
      return { ...n, respostas: addReplyToTree(n.respostas, parentId, item) };
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
  disabled = false,
  isSubmitting = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled?: boolean;
  isSubmitting?: boolean;
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
        disabled={disabled}
      />
      <div className="reply-actions">
        <button type="button" className="btn sm" onClick={onCancel} disabled={disabled}>
          Cancelar
        </button>
        <button
          type="button"
          className="btn sm primary"
          onClick={onSubmit}
          disabled={!value.trim() || disabled}
          title="Ctrl+Enter para enviar"
        >
          <span className="ico-send" aria-hidden />
          <span>{isSubmitting ? 'Enviando...' : 'Enviar'}</span>
        </button>
      </div>
    </div>
  );
}

function CommentNode({
  c,
  depth,
  onResponderClick,
  onLoadReplies,
  onVoteComment,
  onSuperVoteComment,
  replyTarget,
  replyText,
  setReplyText,
  cancelReply,
  submitReply,
  onReplyKeyDown,
  isLoadingReplies,
  submittingComment,
  isVoting,
  isSuperVoting,
  onAutorClick,
}: {
  c: PostCommentModel;
  depth: number;
  onResponderClick: (parentId: number) => void;
  onLoadReplies: (comentarioId: number) => void;
  onVoteComment: (comentarioId: number) => void;
  onSuperVoteComment: (comentarioId: number) => void;
  replyTarget: null | 'post' | number;
  replyText: string;
  setReplyText: (v: string) => void;
  cancelReply: () => void;
  submitReply: () => void;
  onReplyKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoadingReplies: boolean;
  submittingComment: boolean;
  isVoting: boolean;
  isSuperVoting: boolean;
  onAutorClick: (autorId: number) => void;
}) {
  const isReplyingHere = replyTarget === c.id;
  const hasReplies = c.respostas && c.respostas.length > 0;
  const canLoadReplies = !c.repliesLoaded && !hasReplies;

  return (
    <div className="comment" style={{ marginLeft: depth * 16 }}>
      <div className="comment-head">
        <div className="post-avatar post-avatar--sm" aria-hidden>
          {c.autor.iniciais}
        </div>
        <div className="author">
          <span 
            className="nome"
            onClick={(e) => {
              e.stopPropagation();
              if (c.autor.id) {
                onAutorClick(c.autor.id);
              }
            }}
            style={{ cursor: c.autor.id ? 'pointer' : 'default' }}
          >
            {c.autor.nome}
          </span>
        </div>
      </div>

      <p className="comment-text">{c.texto}</p>

      <div className="comment-actions">
        <button
          className={`btn sm up ${c.jaVotou ? 'active' : ''} ${isVoting ? 'voting' : ''}`}
          type="button"
          aria-label={c.jaVotou ? 'Remover voto' : 'Votar no comentário'}
          onClick={() => onVoteComment(c.id)}
          disabled={isVoting}
        >
          <span className="ico-up" aria-hidden />
          <span>{c.upvotes}</span>
        </button>
        <button
          className={`btn sm super ${c.jaSuperVotou ? 'active' : ''} ${isSuperVoting ? 'voting' : ''}`}
          type="button"
          aria-label={c.jaSuperVotou ? 'Remover super voto' : 'Super votar comentário'}
          onClick={() => onSuperVoteComment(c.id)}
          disabled={isSuperVoting}
        >
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

        {/* Botão para carregar respostas */}
        {canLoadReplies && (
          <button
            className="btn sm link"
            type="button"
            onClick={() => onLoadReplies(c.id)}
            disabled={isLoadingReplies}
            aria-label="Ver respostas"
          >
            <span className="ico-com" aria-hidden />
            <span>{isLoadingReplies ? 'Carregando...' : 'Ver respostas'}</span>
          </button>
        )}
      </div>

      {isReplyingHere && (
        <ReplyBox
          value={replyText}
          onChange={setReplyText}
          onCancel={cancelReply}
          onSubmit={submitReply}
          onKeyDown={onReplyKeyDown}
          placeholder="Responder este comentário…"
          disabled={submittingComment}
          isSubmitting={submittingComment}
        />
      )}

      {hasReplies && (
        <div className="children">
          {c.respostas!.map((r) => (
            <CommentNode
              key={r.id}
              c={r}
              depth={depth + 1}
              onResponderClick={onResponderClick}
              onLoadReplies={onLoadReplies}
              onVoteComment={onVoteComment}
              onSuperVoteComment={onSuperVoteComment}
              replyTarget={replyTarget}
              replyText={replyText}
              setReplyText={setReplyText}
              cancelReply={cancelReply}
              submitReply={submitReply}
              onReplyKeyDown={onReplyKeyDown}
              isLoadingReplies={isLoadingReplies}
              submittingComment={submittingComment}
              isVoting={isVoting}
              isSuperVoting={isSuperVoting}
              onAutorClick={onAutorClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}