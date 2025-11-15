/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  workshopService,
  type WorkshopResponseDTO,
  type WorkshopStatus,
} from '../services/workshopService';
import { authService } from '../services/authService';
import { inscricaoService } from '../services/inscricaoService';
import { useNotification } from '../contexts/NotificationContext';
import NavBar from '../components/NavBar';
import '../styles/Workshops.css';

type Tab = 'disponiveis' | 'inscritos' | 'meus';

interface UiWorkshop {
  id: number;
  title: string;
  description: string;
  mentor: { name: string };
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  status: WorkshopStatus;
  tokens?: number;
  rating?: number;
  meetLink?: string;
}

const PAGE_SIZE = 6;

function mapToUi(w: WorkshopResponseDTO): UiWorkshop {
  return {
    id: w.id,
    title: w.titulo,
    description: w.descricao?.descricao ?? '',
    mentor: { name: w.instrutorNome },
    date: workshopService.formatarData(w.dataInicio),
    startTime: workshopService.formatarHora(w.dataInicio),
    endTime: workshopService.formatarHora(w.dataTermino),
    durationHours: workshopService.calcularDuracao(w.dataInicio, w.dataTermino),
    status: w.status,
    tokens: w.custo,
    rating: undefined,
    meetLink: w.linkMeet,
  };
}

function getStatusChipLabel(status: WorkshopStatus): string {
  switch (status) {
    case 'CONCLUIDO':
      return 'Concluído';
    case 'EM_ANDAMENTO':
      return 'Em andamento';
    case 'ABERTO':
    default:
      return 'Inscrito';
  }
}

export default function Workshops() {
  const [tab, setTab] = useState<Tab>('disponiveis');
  const [data, setData] = useState<UiWorkshop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [inscrevendoId, setInscrevendoId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const emptyMessage = useMemo(() => {
    if (tab === 'inscritos') {
      return 'Você ainda não está inscrito em nenhum workshop.';
    }
    if (tab === 'meus') {
      return 'Você ainda não criou nenhum workshop.';
    }
    return 'Nenhum workshop disponível no momento.';
  }, [tab]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        let workshops: WorkshopResponseDTO[] = [];

        if (tab === 'disponiveis') {
          workshops = await workshopService.listarPorStatus('ABERTO');
        } else if (tab === 'meus') {
          const instrutorId = authService.getInstrutorId();

          if (instrutorId != null) {
            workshops = await workshopService.buscarPorInstrutor(instrutorId);
          } else {
            console.warn(
              'Não foi possível identificar o instrutor pelo token. Carregando todos e tentando filtrar pelo nome.'
            );
            const todos = await workshopService.listar();
            const nomeInstrutor = authService.getUsuarioNome();
            workshops = nomeInstrutor
              ? todos.filter((w) => w.instrutorNome === nomeInstrutor)
              : todos;
          }
        } else if (tab === 'inscritos') {
          const inscricoes = await inscricaoService.listarMinhas();

          if (inscricoes.length === 0) {
            workshops = [];
          } else {
            const detalhes = await Promise.all(
              inscricoes.map((i) => workshopService.buscarPorId(i.workshopId))
            );
            workshops = detalhes;
          }
        } else {
          workshops = [];
        }

        if (!mounted) return;
        setData(workshops.map(mapToUi));
        setPage(1);
      } catch (e: any) {
        if (!mounted) return;
        console.error(e);
        const resp = e?.response?.data;
        const msg = resp?.message || resp?.error || e?.message || 'Erro ao carregar workshops';
        setError(msg);
        setData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [tab]);

  useEffect(() => {
    setPage(1);
  }, [tab]);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, page]);

  const activeIdx = tab === 'disponiveis' ? 0 : tab === 'inscritos' ? 1 : 2;
  const isInscritos = tab === 'inscritos';
  const isMeus = tab === 'meus';

  const showEmpty = !loading && !error && data.length === 0;
  const showContent = !loading && !error && data.length > 0;

  async function handleInscrever(w: UiWorkshop) {
    try {
      setInscrevendoId(w.id);
      setError(null);

      await inscricaoService.inscrever(w.id);

      addNotification({
        title: 'Inscrição realizada',
        subtitle: `Você foi inscrito em "${w.title}".`,
        path: '/workshops?tab=inscritos',
      });

      setTab('inscritos');
    } catch (e: any) {
      const resp = e?.response?.data;
      const msg = resp?.message || resp?.error || e?.message || 'Erro ao realizar inscrição';
      setError(msg);
    } finally {
      setInscrevendoId(null);
    }
  }

  function handleEntrar(w: UiWorkshop) {
    if (!w.meetLink) {
      addNotification({
        title: 'Link indisponível',
        subtitle: 'Este workshop ainda não possui link do Meet configurado.',
      });
      return;
    }

    try {
      const url = new URL(w.meetLink);
      window.open(url.toString(), '_blank', 'noopener,noreferrer');
    } catch {
      addNotification({
        title: 'Link inválido',
        subtitle: 'O link do Meet parece inválido. Fale com o instrutor.',
      });
    }
  }

  return (
    <>
      <NavBar />
      <div className="wk-wrap">
        <div className="wk-header">
          <div className="wk-header-top">
            <button className="wk-back" onClick={() => navigate(-1)} type="button">
              <span className="ico-back" />
              Voltar
            </button>

            <div className="wk-header-center">
              <h1 className="wk-title">Workshops</h1>
              <p className="wk-sub">Aprenda com especialistas da comunidade</p>
            </div>

            <div className="wk-actions">
              <button className="wk-filter" type="button">
                <span className="ico-filter" />
                Filtros
              </button>
              <button
                className="wk-create"
                type="button"
                onClick={() => navigate('/criar-workshop/')}
              >
                <span className="ico-plus" />
                Criar Workshop
              </button>
            </div>
          </div>
        </div>

        <div className="wk-tabs-wrap">
          <div className="wk-tabs">
            <span className={`wk-tabs-thumb pos-${activeIdx}`} />
            <button
              className={`wk-tab ${activeIdx === 0 ? 'is-active' : ''}`}
              onClick={() => setTab('disponiveis')}
              type="button"
            >
              Workshops Disponíveis
            </button>
            <button
              className={`wk-tab ${activeIdx === 1 ? 'is-active' : ''}`}
              onClick={() => setTab('inscritos')}
              type="button"
            >
              Inscritos
            </button>
            <button
              className={`wk-tab ${activeIdx === 2 ? 'is-active' : ''}`}
              onClick={() => setTab('meus')}
              type="button"
            >
              Meus Workshops
            </button>
          </div>
        </div>

        {loading && <div className="wk-empty">Carregando workshops...</div>}
        {error && !loading && <div className="wk-empty">Erro: {error}</div>}

        {showEmpty && <div className="wk-empty">{emptyMessage}</div>}

        {showContent && (
          <>
            <div className={`wk-grid ${isInscritos ? 'is-enrolled' : ''}`}>
              {paginated.map((w) => {
                const statusLabel = getStatusChipLabel(w.status);

                return (
                  <article
                    key={w.id}
                    className={`wk-card ${isInscritos ? 'enrolled' : ''} ${
                      w.status === 'CONCLUIDO' ? 'done' : ''
                    }`}
                  >
                    <header className="wk-row">
                      <h2 className="wk-card-title">{w.title}</h2>
                      {typeof w.tokens === 'number' && !isInscritos && (
                        <span className="wk-chip-tokens">{w.tokens} tokens</span>
                      )}
                      {isInscritos && (
                        <span
                          className={`wk-chip-status ${w.status === 'CONCLUIDO' ? 'ok' : 'info'}`}
                        >
                          {statusLabel}
                        </span>
                      )}
                    </header>

                    <p className="wk-desc">{w.description}</p>

                    {!isInscritos && (
                      <>
                        <div className="wk-mentor">
                          <div className="wk-avatar">
                            {w.mentor.name
                              .split(' ')
                              .map((s) => s[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <div className="wk-mentor-info">
                            <div className="wk-mentor-name">{w.mentor.name}</div>
                          </div>
                        </div>

                        <div className="wk-meta">
                          <div className="wk-meta-item">
                            <span className="wk-ico wk-cal" />
                            <span>{w.date}</span>
                          </div>
                          <div className="wk-meta-item">
                            <span className="wk-ico wk-time" />
                            <span>{w.durationHours}h</span>
                          </div>
                          <div className="wk-meta-item">
                            <span className="wk-ico wk-clock" />
                            <span>
                              {w.startTime} - {w.endTime}
                            </span>
                          </div>
                        </div>

                        {!isMeus ? (
                          <div className="wk-cta-row">
                            <button
                              className="wk-cta"
                              type="button"
                              disabled={inscrevendoId === w.id}
                              onClick={() => handleInscrever(w)}
                            >
                              <span className="wk-cta-ico" />
                              <span>
                                {inscrevendoId === w.id ? 'Inscrevendo...' : 'Inscreva-se'}
                              </span>
                            </button>
                          </div>
                        ) : (
                          <div className="wk-card-actions">
                            <button
                              className="wk-btn-edit"
                              type="button"
                              onClick={() => navigate(`/workshops/${w.id}/editar`)}
                            >
                              <span className="ico-edit" />
                              Editar Configurações
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {isInscritos && (
                      <div className="wk-enroll-footer">
                        <div className="wk-enroll-meta">
                          <div className="wk-inline">
                            <span className="wk-ico wk-cal" />
                            <span className="wk-inline-text">{w.date}</span>
                          </div>
                          {typeof w.rating === 'number' && (
                            <div className="wk-inline">
                              <span className="wk-ico wk-star" />
                              <span className="wk-inline-text">{w.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <button
                          className="wk-btn-join"
                          type="button"
                          onClick={() => handleEntrar(w)}
                        >
                          <span className="ico-video" />
                          Entrar
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="wk-pagination">
                <button
                  type="button"
                  className="wk-page-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </button>
                <span className="wk-page-info">
                  Página {page} de {totalPages}
                </span>
                <button
                  type="button"
                  className="wk-page-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
