import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workshopService, WorkshopResponseDTO } from '../services/workshopService';
import NavBar from '../components/NavBar';
import '../styles/Workshops.css';

type EnrolledWorkshop = WorkshopResponseDTO & {
  completed?: boolean;
  rating?: number;
  mine?: boolean;
  enrolled?: boolean;
};

type Tab = 'disponiveis' | 'inscritos' | 'meus';

const PAGE_SIZE = 6;

export default function Workshops() {
  const [tab, setTab] = useState<Tab>('disponiveis');
  const [data, setData] = useState<EnrolledWorkshop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    
    const carregarWorkshops = async () => {
      try {
        const workshops = await workshopService.listar();
        if (mounted) {
          // TODO: Buscar informações de inscrição e ownership do backend
          const workshopsComStatus: EnrolledWorkshop[] = workshops.map(w => ({
            ...w,
            enrolled: false, // Verificar se usuário está inscrito
            mine: false, // Verificar se workshop é do usuário logado
            completed: w.status === 'CONCLUIDO' || w.status === 'ENCERRADO',
          }));
          setData(workshopsComStatus);
        }
      } catch (error) {
        console.error('Erro ao carregar workshops:', error);
        if (mounted) setData([]);
      }
    };

    carregarWorkshops();
    
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [tab]);

  const filtered = useMemo(() => {
    if (tab === 'meus') return data.filter((w) => w.mine);
    if (tab === 'inscritos') return data.filter((w) => w.enrolled);
    return data.filter((w) => !w.enrolled);
  }, [data, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const activeIdx = tab === 'disponiveis' ? 0 : tab === 'inscritos' ? 1 : 2;
  const isInscritos = tab === 'inscritos';
  const isMeus = tab === 'meus';

  return (
    <>
      <NavBar />
      <div className="wk-wrap">
        <div className="wk-header">
          <div className="wk-header-top">
            <button className="wk-back" onClick={() => navigate(-1)}>
              <span className="ico-back" />
              Voltar
            </button>

            <div className="wk-header-center">
              <h1 className="wk-title">Workshops</h1>
              <p className="wk-sub">Aprenda com especialistas da comunidade</p>
            </div>

            <div className="wk-actions">
              <button className="wk-filter">
                <span className="ico-filter" />
                Filtros
              </button>
              <button className="wk-create" onClick={() => navigate('/criar-workshop/')}>
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
            >
              Workshops Disponíveis
            </button>
            <button
              className={`wk-tab ${activeIdx === 1 ? 'is-active' : ''}`}
              onClick={() => setTab('inscritos')}
            >
              Inscritos
            </button>
            <button
              className={`wk-tab ${activeIdx === 2 ? 'is-active' : ''}`}
              onClick={() => setTab('meus')}
            >
              Meus Workshops
            </button>
          </div>
        </div>

        {loading && <div className="wk-empty">Carregando workshops...</div>}
        {error && !loading && <div className="wk-empty">Erro: {error}</div>}

        {!loading && filtered.length === 0 ? (
          <div className="wk-empty">Nada por aqui.</div>
        ) : (
          <div className={`wk-grid ${isInscritos ? 'is-enrolled' : ''}`}>
            {filtered.map((w) => {
              const statusLabel = w.completed ? 'Concluído' : 'Inscrito';
              return (
                <article
                  key={w.id}
                  className={`wk-card ${isInscritos ? 'enrolled' : ''} ${w.completed ? 'done' : ''}`}
                >
                  <header className="wk-row">
                    <h2 className="wk-card-title">{w.titulo}</h2>
                    {typeof w.custo === 'number' && !isInscritos && (
                      <span className="wk-chip-tokens">{w.custo} tokens</span>
                    )}
                    {isInscritos && (
                      <span className={`wk-chip-status ${w.completed ? 'ok' : 'info'}`}>
                        {statusLabel}
                      </span>
                    )}
                  </header>

                  <p className="wk-desc">{w.descricao.descricao}</p>

                  {!isInscritos && (
                    <>
                      <div className="wk-mentor">
                        <div className="wk-avatar">
                          {w.instrutorNome
                            .split(' ')
                            .map((s) => s[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div className="wk-mentor-info">
                          <div className="wk-mentor-name">{w.instrutorNome}</div>
                        </div>
                      </div>

                      <div className="wk-meta">
                        <div className="wk-meta-item">
                          <span className="wk-ico wk-cal" />
                          <span>{workshopService.formatarData(w.dataInicio)}</span>
                        </div>
                        <div className="wk-meta-item">
                          <span className="wk-ico wk-time" />
                          <span>{workshopService.calcularDuracao(w.dataInicio, w.dataTermino)}h</span>
                        </div>
                        <div className="wk-meta-item">
                          <span className="wk-ico wk-clock" />
                          <span>
                            {workshopService.formatarHora(w.dataInicio)} - {workshopService.formatarHora(w.dataTermino)}
                          </span>
                        </div>
                      </div>

                        {!isMeus ? (
                          <div className="wk-cta-row">
                            <button
                              className="wk-cta"
                              onClick={() => navigate(`/workshops/${w.id}`)}
                            >
                              <span className="wk-cta-ico" />
                              <span>Inscreva-se</span>
                            </button>
                          </div>
                        ) : (
                          <div className="wk-card-actions">
                            <button
                              className="wk-btn-edit"
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
                          <span className="wk-inline-text">{workshopService.formatarData(w.dataInicio)}</span>
                        </div>
                        {typeof w.rating === 'number' && (
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
                          onClick={() => navigate(`/workshops/${w.id}`)}
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
          </>
        )}
      </div>
    </>
  );
}
