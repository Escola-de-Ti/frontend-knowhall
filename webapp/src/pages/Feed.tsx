/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Feed.css';
import NavBar from '../components/NavBar';
import PostCard, { PostModel } from '../components/feed/Post';
import WorkshopList, { WorkshopItem } from '../components/feed/WorkshopList';
import RankingList, { RankUser } from '../components/feed/RankingList';
import PostDetailsModal, { PostDetails } from '../components/feed/PostDetailsModal';
import { workshopService, WorkshopResponseDTO } from '../services/workshopService';
import { useFeed } from '../hooks/useFeed';
import { PostFeedDTO } from '../services/postService';
import { votoService } from '../services/votoService';
import { getRelativeTime, getInitials } from '../utils/feedHelpers';

export default function Feed() {
  const navigate = useNavigate();

  const { posts, loading, error, hasMore, loadMore, refresh, updatePost } = useFeed(10);
  const observerTarget = useRef<HTMLDivElement>(null);

  const [workshops, setWorkshops] = useState<WorkshopItem[]>([]);
  const [wsLoading, setWsLoading] = useState(false);

  const ranking: RankUser[] = [
    { id: 1, nome: 'Matheus Rossini', iniciais: 'MR', nivel: 18, tokens: '5.650' },
    { id: 2, nome: 'Kauan Bertalha', iniciais: 'KB', nivel: 17, tokens: '5.450' },
    { id: 3, nome: 'Andre Jacob', iniciais: 'AJ', nivel: 15, tokens: '5.630' },
    { id: 4, nome: 'Gabriel Marassi', iniciais: 'GM', nivel: 14, tokens: '4.860' },
    { id: 5, nome: 'Willyan Tomaz', iniciais: 'WT', nivel: 13, tokens: '4.560' },
    { id: 6, nome: 'Fulano Beltrano', iniciais: 'FB', nivel: 12, tokens: '4.310' },
    { id: 7, nome: 'Ciclano Souza', iniciais: 'CS', nivel: 12, tokens: '4.200' },
    { id: 8, nome: 'Bruno Dias', iniciais: 'BD', nivel: 11, tokens: '3.990' },
    { id: 9, nome: 'Lari Santos', iniciais: 'LS', nivel: 11, tokens: '3.820' },
    { id: 10, nome: 'Gabi Ferreira', iniciais: 'GF', nivel: 10, tokens: '3.600' },
  ];

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<PostDetails | null>(null);

  const handleCloseModal = () => {
    setOpen(false);
    setCurrent(null);
    refresh();
  };

  const transformPostToModel = (post: PostFeedDTO): PostModel => {
    return {
      id: parseInt(post.id),
      autor: {
        id: parseInt(post.usuarioId),
        nome: post.nomeUsuario,
        iniciais: getInitials(post.nomeUsuario),
        nivel: 10,
      },
      titulo: post.titulo,
      corpo: post.descricao,
      tags: post.tags.map((tag) => tag.name),
      metrica: {
        comentarios: 0,
        upvotes: post.totalUpVotes,
      },
      tempo: getRelativeTime(post.dataCriacao),
      jaVotou: post.jaVotou,
    };
  };

  const handleVote = async (postId: number) => {
    try {
      const response = await votoService.votarEmPost(postId.toString());

      updatePost(postId.toString(), {
        jaVotou: response.votado,
        totalUpVotes: response.totalUpVotes,
      });
    } catch (error: any) {
      console.error('Erro ao votar:', error);
      alert(error.message || 'Erro ao processar voto. Tente novamente.');
    }
  };

  function openPost(id: number) {
    const postApi = posts.find((p) => parseInt(p.id) === id);
    if (!postApi) return;

    const post: PostDetails = {
      id,
      titulo: postApi.titulo,
      corpo: postApi.descricao,
      autor: {
        id: parseInt(postApi.usuarioId),
        nome: postApi.nomeUsuario,
        iniciais: getInitials(postApi.nomeUsuario),
        nivel: 10,
      },
      tags: postApi.tags.map((tag) => tag.name),
      metrica: {
        upvotes: postApi.totalUpVotes,
        supervotes: 0,
        comentarios: 0,
      },
      tempo: getRelativeTime(postApi.dataCriacao),
      jaVotou: postApi.jaVotou,
    };

    setCurrent(post);
    setOpen(true);
  }

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading) {
        loadMore();
      }
    },
    [hasMore, loading, loadMore]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const option = {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleObserver]);

  useEffect(() => {
    async function loadWorkshops() {
      try {
        setWsLoading(true);

        const data: WorkshopResponseDTO[] = await workshopService.listar({
          status: 'ABERTO',
        });

        const mapped: WorkshopItem[] = data.slice(0, 4).map((w) => {
          let vagas = 'Encerrado';

          if (w.status === 'ABERTO') {
            vagas = 'Inscrições abertas';
          } else if (w.status === 'EM_ANDAMENTO') {
            vagas = 'Em andamento';
          }

          return {
            id: w.id,
            titulo: w.titulo,
            data: workshopService.formatarData(w.dataInicio),
            vagas,
            duracao: `${workshopService.calcularDuracao(w.dataInicio, w.dataTermino)}h`,
          };
        });

        setWorkshops(mapped);
      } catch (e) {
        console.error('Erro ao carregar workshops', e);
        setWorkshops([]);
      } finally {
        setWsLoading(false);
      }
    }

    loadWorkshops();
  }, []);

  const handleCriarPost = () => {
    navigate('/criar-post');
  };

  return (
    <div className="feed-page">
      <NavBar />

      <main className="feed-container">
        <aside className="feed-left">
          <div className="feed-left-head">
            <button className="btn-create" type="button" onClick={handleCriarPost}>
              <span className="ico-plus" aria-hidden />
              <span className="lbl-grad">Criar Post</span>
            </button>
          </div>

          {wsLoading ? (
            <aside className="ws-panel">
              <header className="ws-head">
                <span className="ws-ico" aria-hidden />
                <div className="ws-txt">
                  <h3>Workshops</h3>
                  <p>Carregando workshops...</p>
                </div>
              </header>
            </aside>
          ) : (
            <WorkshopList itens={workshops} onVerMais={() => navigate('/workshops')} />
          )}
        </aside>

        <section className="feed-center">
          <div className="feed-filters-bar">
            <button className="btn-filter" type="button" onClick={() => {}}>
              <span className="ico-filter" aria-hidden />
              <span className="lbl-filter">Filtros</span>
            </button>
          </div>

          {error && (
            <div className="error-message" style={{ margin: '20px 0', textAlign: 'center' }}>
              {error}
              <button
                onClick={refresh}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                Tentar novamente
              </button>
            </div>
          )}

          <div className="posts-stack">
            {posts.map((p) => (
              <PostCard
                key={p.id}
                post={transformPostToModel(p)}
                onMoreClick={() => openPost(parseInt(p.id))}
                onVote={handleVote}
              />
            ))}

            {loading && posts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Carregando posts...</p>
              </div>
            )}

            {!loading && posts.length === 0 && !error && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Nenhum post encontrado.</p>
              </div>
            )}
          </div>

          <div ref={observerTarget} style={{ height: '20px', margin: '20px 0' }}>
            {loading && posts.length > 0 && (
              <div style={{ textAlign: 'center' }}>
                <p>Carregando mais posts...</p>
              </div>
            )}
          </div>

          {!hasMore && posts.length > 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
              <p>Você chegou ao fim! 🎉</p>
            </div>
          )}
        </section>

        <aside className="feed-right">
          <RankingList users={ranking} onVerMais={() => {}} />
        </aside>
      </main>

      <PostDetailsModal open={open} onClose={handleCloseModal} post={current} />
    </div>
  );
}
