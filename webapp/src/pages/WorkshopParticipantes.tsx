/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
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

  const naoEhInstrutorDoWorkshop =
    workshop && instrutorIdLogado != null && workshop.instrutorId !== instrutorIdLogado;

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
              <h1 className="wk-title">Participantes</h1>
              <p className="wk-sub">
                {workshop ? workshop.titulo : 'Carregando informações do workshop...'}
              </p>
            </div>
          </div>
        </div>

        {loading && <div className="wk-empty">Carregando participantes...</div>}

        {error && !loading && <div className="wk-empty">Erro: {error}</div>}

        {naoEhInstrutorDoWorkshop && !loading && !error && (
          <div className="wk-empty">
            Você não é instrutor deste workshop. Lista exibida apenas para conferência.
          </div>
        )}

        {!loading && !error && participantes.length === 0 && (
          <div className="wk-empty">Nenhum participante inscrito até o momento.</div>
        )}

        {!loading && !error && participantes.length > 0 && (
          <div className="wk-grid is-enrolled">
            {participantes.map((p) => (
              <article key={p.id} className="wk-card enrolled">
                <header className="wk-row">
                  <h2 className="wk-card-title">{p.usuarioNome}</h2>
                  <span className="wk-chip-status info">{p.status}</span>
                </header>

                <div className="wk-meta">
                  <div className="wk-meta-item">
                    <span className="wk-ico wk-cal" />
                    <span>Inscrito em {formatarDataInscricao(p.dataInscricao)}</span>
                  </div>
                  <div className="wk-meta-item">
                    <span className="wk-ico wk-user" />
                    <span>ID Usuário: {p.usuarioId}</span>
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