import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Feed.css';

import NavBar from '../components/NavBar';
import PostCard, { PostModel } from '../components/feed/Post';
import WorkshopList, { WorkshopItem } from '../components/feed/WorkshopList';
import RankingList from '../components/feed/RankingList';
import PostDetailsModal, {
  PostDetails,
  PostCommentModel,
} from '../components/feed/PostDetailsModal';
import { workshopService, WorkshopResponseDTO } from '../services/workshopService';

import { useFeed } from '../hooks/useFeed';
import { PostFeedDTO } from '../services/postService';
import { votoService } from '../services/votoService';
import { getRelativeTime, getInitials } from '../utils/feedHelpers';

import { usuarioService, RankingUsuarioDTO } from '../services/usuarioService'; // Ajuste o caminho se necessário

export default function Feed() {
  const navigate = useNavigate();
  
  const { posts, loading, error, hasMore, loadMore, refresh, updatePost } = useFeed(10);

  const observerTarget = useRef<HTMLDivElement>(null);

  const workshops: WorkshopItem[] = [
    {
      id: 1,
      titulo: 'Introdução ao React Hooks',
      data: '15 Set 2025',
      vagas: '12/20',
      duracao: '2h',
    },
    {
      id: 2,
      titulo: 'Clean Architecture na Prática',
      data: '15 Set 2025',
      vagas: '12/20',
      duracao: '2h',
    },
    { id: 3, titulo: 'Introdução ao MySQL', data: '15 Set 2025', vagas: '12/20', duracao: '2h' },
    { id: 4, titulo: 'SpringBoot + React', data: '15 Set 2025', vagas: '12/20', duracao: '2h' },
  ];

  const [rankingList, setRankingList] = useState<RankingUsuarioDTO[]>([]);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingError, setRankingError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<PostDetails | null>(null);
  const [comments, setComments] = useState<PostCommentModel[]>([]);

  useEffect(() => {
    async function carregarRanking() {
      try {
        setRankingLoading(true);
        setRankingError(null);
        
        const response = await usuarioService.buscarRanking();
        
        setRankingList(response.rankingList.slice(0, 10)); 

      } catch (err: any) {
        console.error("Erro ao carregar ranking:", err);
        setRankingError("Não foi possível carregar o ranking.");
      } finally {
        setRankingLoading(false);
      }
    }
    
    carregarRanking();
  }, []);

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

    const cmts: PostCommentModel[] = [];

    setCurrent(post);
    setComments(cmts);
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

  React.useEffect(() => {
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

  
  const handleCriarPost = () => {
    navigate('/criar-post');
  };

  const handleVerMaisRanking = () => {
    console.log("Clicou em 'Ver mais' no ranking");
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

          <WorkshopList itens={workshops} onVerMais={() => {}} />
          
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
          
          {rankingLoading && (
            <div className="rk-panel" style={{ padding: '20px', textAlign: 'center' }}>
              Carregando ranking...
            </div> 
          )}
          
          {rankingError && (
            <div className="rk-panel" style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
              {rankingError}
            </div>
          )}

          {!rankingLoading && !rankingError && (
            <RankingList 
              users={rankingList} 
              onVerMais={handleVerMaisRanking}
            />
          )}
        </aside>
      </main>

      <PostDetailsModal
        open={open}
        onClose={handleCloseModal}
        post={current}
      />
    </div>
  );
}