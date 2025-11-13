import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listWorkshops, UiWorkshop } from '../services/workshops.service';
import NavBar from '../components/NavBar';
import '../styles/Workshops.css';

type EnrolledWorkshop = UiWorkshop & {
  completed?: boolean;
  rating?: number;
  mine?: boolean;
  tokens?: number;
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

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const r = await listWorkshops();
        if (mounted) setData(r as EnrolledWorkshop[]);
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar workshops');
        if (mounted) {
          setData([
            {
              id: '1',
              title: 'Back-end com Node.js',
              description:
                'Crie APIs REST rápidas e escaláveis para a web utilizando Node.js e o framework Express.',
              mentor: { name: 'Andre Jacob' },
              date: '15 Set 2024',
              durationHours: 2,
              startTime: '19:00',
              endTime: '21:00',
              enrolled: false,
              mine: true,
              tokens: 500,
            },
            {
              id: '2',
              title: 'Python para Análise de Dados',
              description:
                'Aprenda a manipular, analisar e visualizar dados de forma prática utilizando Python e a biblioteca Pandas.',
              mentor: { name: 'Andre Jacob' },
              date: '15 Set 2024',
              durationHours: 2,
              startTime: '19:00',
              endTime: '21:00',
              enrolled: false,
              mine: true,
              tokens: 650,
            },
            {
              id: '3',
              title: 'Cloud com AWS',
              description:
                'Domine os conceitos e serviços essenciais da computação em nuvem com a Amazon Web Services (AWS).',
              mentor: { name: 'Andre Jacob' },
              date: '15 Set 2024',
              durationHours: 2,
              startTime: '19:00',
              endTime: '21:00',
              enrolled: false,
              mine: true,
              tokens: 700,
            },
            {
              id: '4',
              title: 'TypeScript Avançado',
              description: 'Workshop sobre funcionalidades avançadas do TypeScript.',
              mentor: { name: 'Gabriel Marassi' },
              date: '21 Nov 2025',
              durationHours: 1.5,
              startTime: '20:00',
              endTime: '21:30',
              enrolled: true,
              rating: 4.7,
            },
          ]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

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
          <>
            <div className={`wk-grid ${isInscritos ? 'is-enrolled' : ''}`}>
              {paginated.map((w) => {
                const statusLabel = w.completed ? 'Concluído' : 'Inscrito';
                return (
                  <article
                    key={w.id}
                    className={`wk-card ${isInscritos ? 'enrolled' : ''} ${
                      w.completed ? 'done' : ''
                    }`}
                  >
                    <header className="wk-row">
                      <h2 className="wk-card-title">{w.title}</h2>
                      {typeof w.tokens === 'number' && !isInscritos && (
                        <span className="wk-chip-tokens">{w.tokens} tokens</span>
                      )}
                      {isInscritos && (
                        <span className={`wk-chip-status ${w.completed ? 'ok' : 'info'}`}>
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
