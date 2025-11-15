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
import { usuarioService } from '../services/usuarioService';
import { useNotification } from '../contexts/NotificationContext';
import NavBar from '../components/NavBar';
import '../styles/Workshops.css';
import '../styles/FilterMenu.css';

type Tab = 'disponiveis' | 'inscritos' | 'meus';

type TipoUsuario = 'ALUNO' | 'INSTRUTOR' | 'ADMINISTRADOR';

interface UiWorkshop {
  id: number;
  title: string;
  description: string;
  mentor: { name: string; id: number };
  date: string;
  rawDate: string;
  rawEndDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  status: WorkshopStatus;
  tokens?: number;
  rating?: number;
  meetLink?: string;
}

interface WorkshopFilterState {
  startDate: string;
  endDate: string;
  minTokens: string;
  maxTokens: string;
}

interface WorkshopFilterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  filters: WorkshopFilterState;
  onChange: (next: WorkshopFilterState) => void;
  onClear: () => void;
}

function WorkshopFilterMenu({
  isOpen,
  onClose,
  filters,
  onChange,
  onClear,
}: WorkshopFilterMenuProps) {
  if (!isOpen) return null;

  const handleChange =
    (field: keyof WorkshopFilterState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...filters, [field]: e.target.value });
    };

  const handleClear = () => {
    onClear();
    onClose();
  };

  const handleApply = () => {
    onClose();
  };

  return (
    <>
      <div className="filter-menu-overlay" onClick={onClose} />
      <div className="filter-menu wk-filter-menu">
        <div className="filter-option wk-filter-header">
          <span>Filtros de Workshops</span>
        </div>

        <div className="filter-option">
          <div className="wk-filter-group">
            <span className="wk-filter-label">Data inicial</span>
            <input
              type="date"
              className="wk-filter-input"
              value={filters.startDate}
              onChange={handleChange('startDate')}
            />
          </div>
        </div>

        <div className="filter-option">
          <div className="wk-filter-group">
            <span className="wk-filter-label">Data final</span>
            <input
              type="date"
              className="wk-filter-input"
              value={filters.endDate}
              onChange={handleChange('endDate')}
            />
          </div>
        </div>

        <div className="filter-option">
          <div className="wk-filter-group">
            <span className="wk-filter-label">Tokens mínimos</span>
            <input
              type="number"
              min={0}
              className="wk-filter-input"
              value={filters.minTokens}
              onChange={handleChange('minTokens')}
            />
          </div>
        </div>

        <div className="filter-option">
          <div className="wk-filter-group">
            <span className="wk-filter-label">Tokens máximos</span>
            <input
              type="number"
              min={0}
              className="wk-filter-input"
              value={filters.maxTokens}
              onChange={handleChange('maxTokens')}
            />
          </div>
        </div>

        <button type="button" className="filter-option wk-filter-clear" onClick={handleClear}>
          Limpar filtros
        </button>

        <button
          type="button"
          className="filter-option active wk-filter-apply"
          onClick={handleApply}
        >
          Aplicar
        </button>
      </div>
    </>
  );
}

const PAGE_SIZE = 6;

function mapToUi(w: WorkshopResponseDTO): UiWorkshop {
  return {
    id: w.id,
    title: w.titulo,
    description: w.descricao?.descricao ?? '',
    mentor: { name: w.instrutorNome, id: w.instrutorId },
    date: workshopService.formatarData(w.dataInicio),
    rawDate: w.dataInicio,
    rawEndDate: w.dataTermino,
    startTime: workshopService.formatarHora(w.dataInicio),
    endTime: workshopService.formatarHora(w.dataTermino),
    durationHours: workshopService.calcularDuracao(w.dataInicio, w.dataTermino),
    status: w.status,
    tokens: w.custo,
    rating: undefined,
    meetLink: w.linkMeet,
  };
}

function getStatusChipLabelInscritos(status: WorkshopStatus): string {
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

function isWorkshopExpired(w: UiWorkshop): boolean {
  const end = new Date(w.rawEndDate);
  if (Number.isNaN(end.getTime())) return false;
  return end.getTime() < Date.now() && (w.status === 'ABERTO' || w.status === 'EM_ANDAMENTO');
}

function getStatusChipLabelList(w: UiWorkshop, isInscritos: boolean): string {
  if (isInscritos) return getStatusChipLabelInscritos(w.status);

  if (isWorkshopExpired(w)) return 'Expirado';

  switch (w.status) {
    case 'ABERTO':
      return 'Disponível';
    case 'EM_ANDAMENTO':
      return 'Em andamento';
    case 'CONCLUIDO':
      return 'Concluído';
    default:
      return w.status;
  }
}

function getStatusChipClass(w: UiWorkshop, isInscritos: boolean): string {
  if (isInscritos) return w.status === 'CONCLUIDO' ? 'ok' : 'info';

  if (isWorkshopExpired(w)) return 'warn';
  if (w.status === 'CONCLUIDO') return 'ok';
  if (w.status === 'EM_ANDAMENTO') return 'info';
  if (w.status === 'ABERTO') return 'info';

  return 'info';
}

export default function Workshops() {
  const [tab, setTab] = useState<Tab>('disponiveis');
  const [allData, setAllData] = useState<UiWorkshop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [inscrevendoId, setInscrevendoId] = useState<number | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<WorkshopFilterState>({
    startDate: '',
    endDate: '',
    minTokens: '',
    maxTokens: '',
  });

  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { addNotification } = useNotification();

  useEffect(() => {
    let mounted = true;

    async function loadTipoUsuario() {
      try {
        const email = authService.getUserEmail();

        if (!email) {
          if (mounted) {
            setTipoUsuario('ALUNO');
            setUsuarioId(null);
          }
          return;
        }

        const usuarios = await usuarioService.listar();
        if (!mounted) return;

        const usuario = usuarios.find(
          (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
        );

        const rawTipo = (usuario?.tipoUsuario || '').toUpperCase();
        let tipo: TipoUsuario = 'ALUNO';

        if (rawTipo === 'INSTRUTOR') tipo = 'INSTRUTOR';
        else if (rawTipo === 'ADMINISTRADOR') tipo = 'ADMINISTRADOR';

        setTipoUsuario(tipo);

        const idNumber = usuario ? Number(usuario.id) : NaN;
        setUsuarioId(Number.isNaN(idNumber) ? null : idNumber);
      } catch (e) {
        console.error('Erro ao buscar tipo do usuário:', e);
        if (mounted) {
          setTipoUsuario('ALUNO');
          setUsuarioId(null);
        }
      }
    }

    loadTipoUsuario();

    return () => {
      mounted = false;
    };
  }, []);

  const isInstrutor = tipoUsuario === 'INSTRUTOR';
  const isAdmin = tipoUsuario === 'ADMINISTRADOR';

  const canCreateWorkshop = !!tipoUsuario && (isInstrutor || isAdmin);
  const canSeeMeusTab = !!tipoUsuario && (isInstrutor || isAdmin);

  const emptyMessage = useMemo(() => {
    if (tab === 'inscritos') return 'Você ainda não está inscrito em nenhum workshop.';
    if (tab === 'meus') return 'Você ainda não criou nenhum workshop.';
    return 'Nenhum workshop disponível no momento.';
  }, [tab]);

  useEffect(() => {
    if (!canSeeMeusTab && tab === 'meus') {
      setTab('disponiveis');
    }
  }, [canSeeMeusTab, tab]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        let workshops: WorkshopResponseDTO[] = [];

        if (tab === 'disponiveis') {
          workshops = await workshopService.listarPorStatus('ABERTO');
        } else if (tab === 'meus' && canSeeMeusTab) {
          if (usuarioId != null) {
            const todos = await workshopService.listar();
            workshops = todos.filter((w) => w.instrutorId === usuarioId);
          } else {
            workshops = [];
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
        setAllData(workshops.map(mapToUi));
        setPage(1);
      } catch (e: any) {
        if (!mounted) return;
        console.error(e);
        const resp = e?.response?.data;
        const msg = resp?.message || resp?.error || e?.message || 'Erro ao carregar workshops';
        setError(msg);
        setAllData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (tipoUsuario !== null) {
      load();
    }

    return () => {
      mounted = false;
    };
  }, [tab, canSeeMeusTab, tipoUsuario, usuarioId]);

  useEffect(() => {
    setPage(1);
  }, [tab, filters.startDate, filters.endDate, filters.minTokens, filters.maxTokens]);

  const filtered = useMemo(() => {
    let list = [...allData];
    const { startDate, endDate, minTokens, maxTokens } = filters;

    if (startDate) {
      const start = new Date(`${startDate}T00:00:00`);
      list = list.filter((w) => {
        const d = new Date(w.rawDate);
        return !Number.isNaN(d.getTime()) && d >= start;
      });
    }

    if (endDate) {
      const end = new Date(`${endDate}T23:59:59`);
      list = list.filter((w) => {
        const d = new Date(w.rawDate);
        return !Number.isNaN(d.getTime()) && d <= end;
      });
    }

    if (minTokens !== '') {
      const min = Number(minTokens);
      if (!Number.isNaN(min)) {
        list = list.filter((w) => (w.tokens ?? 0) >= min);
      }
    }

    if (maxTokens !== '') {
      const max = Number(maxTokens);
      if (!Number.isNaN(max)) {
        list = list.filter((w) => (w.tokens ?? 0) <= max);
      }
    }

    return list;
  }, [allData, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const activeIdx = tab === 'disponiveis' ? 0 : tab === 'inscritos' ? 1 : canSeeMeusTab ? 2 : 0;
  const isInscritos = tab === 'inscritos';
  const isMeus = tab === 'meus';

  const showEmpty = !loading && !error && filtered.length === 0;
  const showContent = !loading && !error && filtered.length > 0;

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

  function handleVerInscritos(w: UiWorkshop) {
    navigate(`/workshops/${w.id}/inscritos`);
  }

  function handleOpenFilters() {
    setIsFilterOpen(true);
  }

  function handleClearFilters() {
    setFilters({
      startDate: '',
      endDate: '',
      minTokens: '',
      maxTokens: '',
    });
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
              <button
                className={`wk-filter ${isFilterOpen ? 'is-open' : ''}`}
                type="button"
                onClick={handleOpenFilters}
              >
                <span className="ico-filter" />
                Filtros
              </button>
              {canCreateWorkshop && (
                <button
                  className="wk-create"
                  type="button"
                  onClick={() => navigate('/criar-workshop/')}
                >
                  <span className="ico-plus" />
                  Criar Workshop
                </button>
              )}
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
            {canSeeMeusTab && (
              <button
                className={`wk-tab ${activeIdx === 2 ? 'is-active' : ''}`}
                onClick={() => setTab('meus')}
                type="button"
              >
                Meus Workshops
              </button>
            )}
          </div>
        </div>

        {loading && <div className="wk-empty">Carregando workshops...</div>}
        {error && !loading && <div className="wk-empty">Erro: {error}</div>}

        {showEmpty && <div className="wk-empty">{emptyMessage}</div>}

        {showContent && (
          <>
            <div className={`wk-grid ${isInscritos ? 'is-enrolled' : ''}`}>
              {paginated.map((w) => {
                const statusLabel = getStatusChipLabelList(w, isInscritos);
                const statusClass = getStatusChipClass(w, isInscritos);
                const expired = isWorkshopExpired(w);

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

                      <span className={`wk-chip-status ${statusClass}`}>{statusLabel}</span>
                    </header>

                    <p className="wk-desc">{w.description}</p>

                    {!isInscritos && (
                      <>
                        <div
                          className="wk-mentor"
                          onClick={() => navigate(`/perfil/${w.mentor.id}`)}
                          style={{ cursor: 'pointer' }}
                        >
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
                        </div>

                        {!isMeus ? (
                          <div className="wk-cta-row">
                            <button
                              className="wk-cta"
                              type="button"
                              disabled={inscrevendoId === w.id || expired}
                              onClick={() => handleInscrever(w)}
                            >
                              <span className="wk-cta-ico" />
                              <span>
                                {expired
                                  ? 'Encerrado'
                                  : inscrevendoId === w.id
                                    ? 'Inscrevendo...'
                                    : 'Inscreva-se'}
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
                            <button
                              className="wk-btn-edit"
                              type="button"
                              onClick={() => handleVerInscritos(w)}
                            >
                              <span className="ico-users" />
                              Ver inscritos
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

      <WorkshopFilterMenu
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        onClear={handleClearFilters}
      />
    </>
  );
}
