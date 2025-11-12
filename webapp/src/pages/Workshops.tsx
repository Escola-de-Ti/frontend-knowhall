import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listWorkshops, UiWorkshop } from '../services/workshops.service';
import NavBar from '../components/NavBar';
import '../styles/Workshops.css';

type EnrolledWorkshop = UiWorkshop & {
  completed?: boolean;
  rating?: number;
};

export default function Workshops() {
  const [tab, setTab] = useState<'disponiveis' | 'inscritos'>('disponiveis');
  const [data, setData] = useState<EnrolledWorkshop[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    listWorkshops()
      .then((r) => {
        if (mounted) setData(r);
      })
      .catch(() => {
        setData([
          {
            id: '1',
            title: 'Introdução ao React Hooks',
            description:
              'Aprenda os conceitos fundamentais dos React Hooks e como utilizá-los em seus projetos.',
            mentor: { name: 'Matheus Rossini' },
            date: '15 Nov 2025',
            durationHours: 2,
            startTime: '19:00',
            endTime: '21:00',
            enrolled: true,
            completed: true,
            rating: 4.7,
          },
          {
            id: '2',
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
          {
            id: '3',
            title: 'Python para Análise de Dados',
            description:
              'Aprenda a manipular, analisar e visualizar dados de forma prática utilizando Python e Pandas.',
            mentor: { name: 'Andre Jacob' },
            date: '15 Dez 2025',
            durationHours: 2,
            startTime: '19:00',
            endTime: '21:00',
            enrolled: false,
          },
          {
            id: '4',
            title: 'Desenvolvimento Mobile com Flutter',
            description:
              'Crie aplicativos nativos de alta performance para Android e iOS com um único código-fonte.',
            mentor: { name: 'Kauan Bertalha' },
            date: '15 Dez 2025',
            durationHours: 2,
            startTime: '19:00',
            endTime: '21:00',
            enrolled: false,
          },
        ]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      tab === 'disponiveis' ? data.filter((w) => !w.enrolled) : data.filter((w) => w.enrolled),
    [data, tab]
  );

  const isInscritos = tab === 'inscritos';

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

            <button className="wk-filter">
              <span className="ico-filter" />
              Filtros
            </button>
          </div>
        </div>

        <div className="wk-tabs-wrap">
          <div className="wk-tabs">
            <span className={`wk-tabs-thumb ${isInscritos ? 'is-right' : 'is-left'}`} />
            <button
              className={`wk-tab ${!isInscritos ? 'is-active' : ''}`}
              onClick={() => setTab('disponiveis')}
            >
              Workshops Disponíveis
            </button>
            <button
              className={`wk-tab ${isInscritos ? 'is-active' : ''}`}
              onClick={() => setTab('inscritos')}
            >
              Inscritos
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
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
                    <h2 className="wk-card-title">{w.title}</h2>
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

                      <div className="wk-cta-row">
                        <button className="wk-cta" onClick={() => navigate(`/workshops/${w.id}`)}>
                          <span className="wk-cta-ico" />
                          <span>Inscreva-se</span>
                        </button>
                      </div>
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
        )}
      </div>
    </>
  );
}
