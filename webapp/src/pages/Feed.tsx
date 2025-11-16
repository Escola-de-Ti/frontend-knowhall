/* eslint-disable @typescript-eslint/no-explicit-any */
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
import FilterMenu, { OrderByOption } from '../components/feed/FilterMenu';
import Loading from '../components/Loading';
import { useLoading } from '../contexts/LoadingContext';
import { workshopService, WorkshopResponseDTO } from '../services/workshopService';

import { useFeed } from '../hooks/useFeed';
import { PostFeedDTO } from '../services/postService';
import { votoService } from '../services/votoService';
import { getRelativeTime, getInitials } from '../utils/feedHelpers';

import { usuarioService, RankingUsuarioDTO } from '../services/usuarioService';

export default function Feed() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const { posts, loading, error, hasMore, orderBy, loadMore, refresh, updatePost, setOrderBy } =
    useFeed(10);

  const observerTarget = useRef<HTMLDivElement>(null);
  const [workshops, setWorkshops] = useState<WorkshopItem[]>([]);
  const [workshopsLoading, setWorkshopsLoading] = useState(true);
  const [workshopsError, setWorkshopsError] = useState<string | null>(null);
  const [rankingList, setRankingList] = useState<RankingUsuarioDTO[]>([]);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingError, setRankingError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<PostDetails | null>(null);
  const [, setComments] = useState<PostCommentModel[]>([]);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const transformWorkshopToItem = (workshop: WorkshopResponseDTO): WorkshopItem => {
    const duracao = workshopService.calcularDuracao(workshop.dataInicio, workshop.dataTermino);
    const dataFormatada = workshopService.formatarData(workshop.dataInicio);
    const vagas = workshop.capacidade ? `${workshop.capacidade} vagas` : 'Ilimitado';

    return {
      id: workshop.id,
      titulo: workshop.titulo,
      data: dataFormatada,
      vagas: vagas,
      duracao: `${duracao}h`,
    };
  };

  useEffect(() => {
    async function carregarWorkshops() {
      try {
        setWorkshopsLoading(true);
        setWorkshopsError(null);

        const response = await workshopService.listarPorStatus('ABERTO');

        const workshopsFuturos = response
          .filter((w) => new Date(w.dataInicio) > new Date())
          .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())
          .slice(0, 4);

        const workshopsFormatados = workshopsFuturos.map(transformWorkshopToItem);

        setWorkshops(workshopsFormatados);
      } catch (err: any) {
        console.error('Erro ao carregar workshops:', err);
        setWorkshopsError('Não foi possível carregar os workshops.');
      } finally {
        setWorkshopsLoading(false);
      }
    }

    carregarWorkshops();
  }, []);

  useEffect(() => {
    async function carregarRanking() {
      try {
        setRankingLoading(true);
        setRankingError(null);

        const response = await usuarioService.buscarRanking();

        setRankingList(response.rankingList.slice(0, 10));
      } catch (err: any) {
        console.error('Erro ao carregar ranking:', err);
        setRankingError('Não foi possível carregar o ranking.');
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

  async function openPost(id: number) {
    showLoading('Carregando post...');
    
    try {
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

      const cmts: PostCommentModel[] = [];

      setCurrent(post);
      setComments(cmts);
      setOpen(true);
    } finally {
      hideLoading();
    }
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
    navigate('/ranking');
  };

  const handleVerMaisWorkshops = () => {
    navigate('/workshops');
  };

  const toggleFilterMenu = () => {
    setFilterMenuOpen((prev) => !prev);
  };

  const handleOrderChange = (newOrder: OrderByOption) => {
    setOrderBy(newOrder);
  };

  return (
    <div className="feed-page">
      <NavBar />

      <main className="feed-container">
        <aside className="feed-left">
          <div className="feed-left-head">
            <button className="btn-create" type="button" onClick={handleCriarPost}>
              <span className="lbl-grad">Criar Post</span>
            </button>
          </div>

          {workshopsLoading ? (
            <div className="ws-panel">
              <Loading size="sm" message="Carregando workshops..." />
            </div>
          ) : workshopsError ? (
            <div className="ws-panel">
              <header className="ws-head">
                <span className="ws-ico" aria-hidden />
                <div className="ws-txt">
                  <h3>Workshops</h3>
                  <p>Fique atento às novidades da semana!</p>
                </div>
              </header>
              <div className="ws-empty ws-error">
                <p>{workshopsError}</p>
              </div>
            </div>
          ) : (
            <WorkshopList itens={workshops} onVerMais={handleVerMaisWorkshops} />
          )}
        </aside>

        <section className="feed-center">
          <div className="feed-filters-bar">
            <button className="btn-filter" type="button" onClick={toggleFilterMenu}>
              <span className="lbl-filter">Ordenar</span>
            </button>

            <FilterMenu
              isOpen={filterMenuOpen}
              onClose={() => setFilterMenuOpen(false)}
              currentOrder={orderBy}
              onOrderChange={handleOrderChange}
            />
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button className="btn-retry" onClick={refresh}>
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
              <Loading message="Carregando posts..." />
            )}

            {!loading && posts.length === 0 && !error && (
              <div className="empty-state">
                <p>Nenhum post encontrado.</p>
              </div>
            )}
          </div>

          <div ref={observerTarget} className="observer-target">
            {loading && posts.length > 0 && (
              <Loading size="md" message="Carregando mais posts..." />
            )}
          </div>

          {!hasMore && posts.length > 0 && (
            <div className="feed-end">
              <p>Você chegou ao fim! 🎉</p>
            </div>
          )}
        </section>

        <aside className="feed-right">
          {rankingLoading ? (
            <div className="rk-panel">
              <Loading size="sm" message="Carregando ranking..." />
            </div>
          ) : rankingError ? (
            <div className="rk-panel">
              <header className="rk-head">
                <span className="rk-trophy" aria-hidden />
                <div className="rk-headtxt">
                  <h3>Top 10 Ranking</h3>
                  <p>Os melhores desenvolvedores da comunidade</p>
                </div>
              </header>
              <div className="rk-empty rk-error">
                <p>{rankingError}</p>
              </div>
            </div>
          ) : (
            <RankingList users={rankingList} onVerMais={handleVerMaisRanking} />
          )}
        </aside>
      </main>

      <PostDetailsModal open={open} onClose={handleCloseModal} post={current} />
    </div>
  );
}