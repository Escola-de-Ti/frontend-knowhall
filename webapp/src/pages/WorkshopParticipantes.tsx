/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Loading from '../components/Loading';
import { workshopService, type WorkshopResponseDTO } from '../services/workshopService';
import { inscricaoService, type InscricaoResponseDTO } from '../services/inscricaoService';
import '../styles/Workshops.css';
import { authService } from '../services/authService';

export default function WorkshopParticipantes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const workshopId = Number(id);

  const [workshop, setWorkshop] = useState<WorkshopResponseDTO | null>(null);
  const [participantes, setParticipantes] = useState<InscricaoResponseDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const instrutorIdLogado = authService.getInstrutorId();

  useEffect(() => {
    if (!Number.isFinite(workshopId) || workshopId <= 0) {
      setError('Workshop inválido');
      setLoading(false);
      return;
    }

    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [wk, inscritos] = await Promise.all([
          workshopService.buscarPorId(workshopId),
          inscricaoService.listarParticipantes(workshopId),
        ]);

        if (!mounted) return;

        setWorkshop(wk);
        setParticipantes(inscritos);
      } catch (e: any) {
        console.error(e);
        const resp = e?.response?.data;
        const msg = resp?.message || resp?.error || e?.message || 'Erro ao carregar participantes';
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [workshopId]);

  function formatarDataInscricao(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

  function getInitials(name: string | null | undefined) {
    if (!name) return '?';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function getStatusClass(status: string | null | undefined) {
    if (!status) return 'info';
    const s = status.toLowerCase();
    if (s.includes('confirm') || s.includes('aprov')) return 'ok';
    if (s.includes('cancel') || s.includes('recus')) return 'warn';
    return 'info';
  }

  const naoEhInstrutorDoWorkshop =
    workshop && instrutorIdLogado != null && workshop.instrutorId !== instrutorIdLogado;

  const filteredParticipantes = participantes.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const nome = p.usuarioNome?.toLowerCase() ?? '';
    const id = String(p.usuarioId ?? '');
    return nome.includes(term) || id.includes(term);
  });

  const handleClickParticipante = (usuarioId: number) => {
    navigate(`/perfil/${usuarioId}`);
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Loading fullscreen message="Carregando participantes..." />
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <Loading fullscreen message={error} />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="wk-wrap">
        <div className="wk-header">
          <div className="wk-header-top">
            <button
              className="wk-back"
              onClick={() => navigate('/workshops?tab=meus')}
              type="button"
            >
              <span className="ico-back" />
              Voltar
            </button>

            <div className="wk-header-center">
              <div className="wk-header-badge-row">
                <h1 className="wk-title">Participantes</h1>
                {participantes.length > 0 && (
                  <span className="wk-header-badge">
                    {participantes.length}
                  </span>
                )}
              </div>
              <p className="wk-sub wk-sub-workshop">
                {workshop ? workshop.titulo : 'Carregando informações do workshop...'}
              </p>
            </div>
          </div>
        </div>

        {naoEhInstrutorDoWorkshop && (
          <div className="wk-info-banner">
            <span className="wk-ico wk-info-icon" />
            <span>Você não é instrutor deste workshop. Lista exibida apenas para conferência.</span>
          </div>
        )}

        {participantes.length === 0 && (
          <div className="wk-empty-state">
            <div className="wk-empty-icon-wrapper">
              <span className="wk-empty-icon" />
            </div>
            <h3 className="wk-empty-title">Nenhum participante ainda</h3>
            <p className="wk-empty-desc">
              Este workshop ainda não possui inscrições confirmadas.
              {workshop && workshop.instrutorId === instrutorIdLogado && (
                <> Compartilhe o link do workshop para atrair mais participantes!</>
              )}
            </p>
          </div>
        )}

        {participantes.length > 0 && (
          <div className="wk-participants-toolbar">
            <div className="wk-participants-search">
              <span className="wk-ico wk-search" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar participante pelo nome ou ID..."
              />
            </div>
            <div className="wk-participants-count">
              {filteredParticipantes.length} de {participantes.length} participantes
            </div>
          </div>
        )}

        {participantes.length > 0 && filteredParticipantes.length === 0 && (
          <div className="wk-empty-state wk-empty-search">
            <div className="wk-empty-icon-wrapper small">
              <span className="wk-ico wk-search" />
            </div>
            <h3 className="wk-empty-title small">Nenhum resultado encontrado</h3>
            <p className="wk-empty-desc">Tente ajustar os termos da busca ou limpar o filtro.</p>
          </div>
        )}

        {filteredParticipantes.length > 0 && (
          <div className="wk-grid is-enrolled">
            {filteredParticipantes.map((p) => (
              <article key={p.id} className="wk-card enrolled">
                <header className="wk-card-header">
                  <div 
                    className="wk-participant-main clickable"
                    onClick={() => handleClickParticipante(p.usuarioId)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClickParticipante(p.usuarioId);
                      }
                    }}
                  >
                    <div className="wk-avatar">{getInitials(p.usuarioNome)}</div>
                    <div className="wk-participant-texts">
                      <h2 className="wk-card-title">{p.usuarioNome}</h2>
                    </div>
                  </div>

                  <span className={`wk-chip-status ${getStatusClass(p.status)}`}>{p.status}</span>
                </header>

                <div className="wk-meta wk-meta-full">
                  <div className="wk-meta-item">
                    <span className="wk-ico wk-cal" />
                    <span>Inscrito em {formatarDataInscricao(p.dataInscricao)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
