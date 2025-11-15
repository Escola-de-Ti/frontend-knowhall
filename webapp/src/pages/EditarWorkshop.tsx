/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/CriarWorkshop.css';
import NavBar from '../components/NavBar';
import { workshopService, type WorkshopResponseDTO } from '../services/workshopService';
import { useNotification } from '../contexts/NotificationContext';

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function calcDurationDays(start?: string, end?: string) {
  if (!start || !end) return null;
  const s = new Date(start + 'T00:00:00').getTime();
  const e = new Date(end + 'T00:00:00').getTime();
  if (Number.isNaN(s) || Number.isNaN(e) || e < s) return null;
  const days = Math.round((e - s) / 86_400_000) + 1;
  return days === 1 ? '1 dia' : `${days} dias`;
}

function fmtDate(d?: string) {
  if (!d) return '-';
  const dt = new Date(d + 'T00:00:00');
  if (Number.isNaN(dt.getTime())) return '-';
  return dt.toLocaleDateString('pt-BR');
}

export default function EditarWorkshop() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addNotification } = useNotification();

  const workshopId = Number(id);
  const idInvalido = !Number.isFinite(workshopId) || workshopId <= 0;

  const [titulo, setTitulo] = useState('');
  const [tema, setTema] = useState('');
  const [descricaoTxt, setDescricaoTxt] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataTermino, setDataTermino] = useState('');
  const [linkMeet, setLinkMeet] = useState('');
  const [custo, setCusto] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [loadingInit, setLoadingInit] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    titulo: false,
    tema: false,
    descricao: false,
    dataInicio: false,
    dataTermino: false,
    linkMeet: false,
    custo: false,
    capacidade: false,
  });

  const titleCount = useMemo(() => `${titulo.length}/100 Caracteres`, [titulo]);
  const descCount = useMemo(() => `${descricaoTxt.length}/1000 Caracteres`, [descricaoTxt]);
  const duracao = useMemo(
    () => calcDurationDays(dataInicio, dataTermino),
    [dataInicio, dataTermino]
  );

  const fieldErrors = {
    titulo: !titulo ? 'Obrigatório' : '',
    tema: !tema ? 'Obrigatório' : '',
    descricao: !descricaoTxt ? 'Obrigatório' : '',
    dataInicio: !dataInicio ? 'Obrigatório' : '',
    dataTermino: !dataTermino
      ? 'Obrigatório'
      : dataInicio && new Date(dataTermino) < new Date(dataInicio)
        ? 'dataFinal deve ser igual ou após dataInicio'
        : '',
    linkMeet: !linkMeet ? 'Obrigatório' : !isValidUrl(linkMeet) ? 'URL inválida' : '',
    custo: custo === '' ? 'Obrigatório' : Number(custo) < 0 ? 'Não pode ser negativo' : '',
    capacidade: capacidade === '' ? 'Obrigatório' : '',
  };

  const hasErrors = Object.values(fieldErrors).some(Boolean);

  function markTouched(name: keyof typeof touched) {
    setTouched((t) => ({ ...t, [name]: true }));
  }

  useEffect(() => {
    if (idInvalido) {
      setErrorGlobal('Workshop inválido');
      setLoadingInit(false);
      return;
    }

    let mounted = true;

    async function load() {
      try {
        const wk: WorkshopResponseDTO = await workshopService.buscarPorId(workshopId);

        if (!mounted) return;

        setTitulo(wk.titulo ?? '');
        setTema(wk.descricao?.tema ?? '');
        setDescricaoTxt(wk.descricao?.descricao ?? '');
        setLinkMeet(wk.linkMeet ?? '');
        setCusto(wk.custo != null ? String(wk.custo) : '');
        setCapacidade(wk.capacidade != null ? String(wk.capacidade) : '');
        setDataInicio(wk.dataInicio ? wk.dataInicio.slice(0, 10) : '');
        setDataTermino(wk.dataTermino ? wk.dataTermino.slice(0, 10) : '');
      } catch (e: any) {
        const resp = e?.response?.data;
        const msg = resp?.message || resp?.error || e?.message || 'Erro ao carregar workshop';
        setErrorGlobal(msg);
      } finally {
        if (mounted) setLoadingInit(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [idInvalido, workshopId]);

  async function onSubmit() {
    setErrorGlobal(null);

    if (idInvalido) {
      setErrorGlobal('Workshop inválido');
      return;
    }

    if (hasErrors) {
      setTouched({
        titulo: true,
        tema: true,
        descricao: true,
        dataInicio: true,
        dataTermino: true,
        linkMeet: true,
        custo: true,
        capacidade: true,
      });
      return;
    }

    const payload = {
      titulo,
      descricao: {
        tema,
        descricao: descricaoTxt,
      },
    };

    console.log('Payload PATCH /workshops:', {
      id: workshopId,
      body: payload,
    });

    try {
      setSaving(true);

      await workshopService.atualizar(workshopId, payload);

      addNotification({
        title: 'Workshop atualizado com sucesso',
        subtitle: 'As alterações foram salvas.',
        path: '/workshops',
      });

      navigate('/workshops');
    } catch (e: any) {
      const resp = e?.response?.data;
      console.log('Erro ao atualizar workshop:', {
        status: e?.response?.status,
        data: resp,
      });

      const msg =
        resp?.message || resp?.error || e?.message || 'Erro inesperado ao atualizar workshop';

      setErrorGlobal(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loadingInit) {
    return (
      <>
        <NavBar />
        <div className="ws-container">
          <div className="ws-header">
            <div className="ws-header-left">
              <button type="button" className="ws-btn-back" onClick={() => navigate(-1)}>
                <span className="ws-ico-back" />
                Voltar
              </button>

              <div className="ws-head-text">
                <h1>Editar Workshop</h1>
                <p>Carregando dados do workshop...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />

      <div className="ws-container">
        <div className="ws-header">
          <div className="ws-header-left">
            <button type="button" className="ws-btn-back" onClick={() => navigate(-1)}>
              <span className="ws-ico-back" />
              Voltar
            </button>

            <div className="ws-head-text">
              <h1>Editar Workshop</h1>
              <p>Ajuste título, datas, custo e descrição.</p>
            </div>
          </div>

          <div className="ws-actions">
            <button type="button" className="ws-btn-cancel" onClick={() => navigate('/workshops')}>
              Cancelar
            </button>
            <button
              type="button"
              className="ws-btn-save"
              disabled={saving || hasErrors}
              onClick={onSubmit}
            >
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </div>

        <div className="ws-grid">
          <aside className="ws-left">
            <section className="ws-card ws-summary">
              <h3 className="ws-summary-title">Resumo do Workshop</h3>
              <ul className="ws-summary-list">
                <li className="ws-summary-row">
                  <span className="ws-summary-label">Título</span>
                  <span className="ws-chip ws-blue-chip">{titulo || '-'}</span>
                </li>
                <li className="ws-summary-row">
                  <span className="ws-summary-label">Tema</span>
                  <span className="ws-chip ws-pink-chip">{tema || '-'}</span>
                </li>
                <li className="ws-summary-row">
                  <span className="ws-summary-label">Período</span>
                  <span className="ws-chip">
                    {dataInicio || dataTermino
                      ? `${fmtDate(dataInicio)} → ${fmtDate(dataTermino)}`
                      : '-'}
                  </span>
                </li>
                <li className="ws-summary-row">
                  <span className="ws-summary-label">Duração</span>
                  <span className="ws-chip ws-green-chip">{duracao ?? '-'}</span>
                </li>
                <li className="ws-summary-row">
                  <span className="ws-summary-label">Custo</span>
                  <span className="ws-chip">{custo !== '' ? `${custo} tokens` : '-'}</span>
                </li>
                <li className="ws-summary-row">
                  <span className="ws-summary-label">Capacidade</span>
                  <span className="ws-chip">{capacidade !== '' ? capacidade : '-'}</span>
                </li>
                <li className="ws-summary-row">
                  <span className="ws-summary-label">Link Meet</span>
                  <span className="ws-chip">{linkMeet ? 'Pronto' : '-'}</span>
                </li>
              </ul>
            </section>
          </aside>

          <section className="ws-card ws-center">
            <h2 className="ws-title-gradient">Conteúdo do Workshop</h2>

            <div className={`ws-field ${touched.titulo && fieldErrors.titulo ? 'ws-invalid' : ''}`}>
              <label htmlFor="titulo">Título *</label>
              <div className="ws-input-wrap">
                <input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value.slice(0, 100))}
                  onBlur={() => markTouched('titulo')}
                  placeholder="Ex: Spring Boot Avançado: Performance e Escalabilidade"
                  maxLength={100}
                  aria-invalid={!!(touched.titulo && fieldErrors.titulo)}
                />
                <span className="ws-counter">{titleCount}</span>
              </div>
              {touched.titulo && fieldErrors.titulo && (
                <span className="ws-field-error">{fieldErrors.titulo}</span>
              )}
            </div>

            <div className="ws-row-2">
              <div className={`ws-field ${touched.tema && fieldErrors.tema ? 'ws-invalid' : ''}`}>
                <label htmlFor="tema">Tema *</label>
                <input
                  id="tema"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  onBlur={() => markTouched('tema')}
                  placeholder="Ex: Backend Java"
                  aria-invalid={!!(touched.tema && fieldErrors.tema)}
                />
                {touched.tema && fieldErrors.tema && (
                  <span className="ws-field-error">{fieldErrors.tema}</span>
                )}
              </div>

              <div
                className={`ws-field ${
                  touched.linkMeet && fieldErrors.linkMeet ? 'ws-invalid' : ''
                }`}
              >
                <label htmlFor="linkMeet">Link do Google Meet *</label>
                <input
                  id="linkMeet"
                  type="url"
                  value={linkMeet}
                  onChange={(e) => setLinkMeet(e.target.value)}
                  onBlur={() => markTouched('linkMeet')}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  aria-invalid={!!(touched.linkMeet && fieldErrors.linkMeet)}
                />
                {touched.linkMeet && fieldErrors.linkMeet && (
                  <span className="ws-field-error">{fieldErrors.linkMeet}</span>
                )}
              </div>
            </div>

            <div className="ws-row-2 ws-dates">
              <div
                className={`ws-field ${
                  touched.dataInicio && fieldErrors.dataInicio ? 'ws-invalid' : ''
                }`}
              >
                <label htmlFor="dataInicio">Data de início *</label>
                <input
                  id="dataInicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  onBlur={() => markTouched('dataInicio')}
                  aria-invalid={!!(touched.dataInicio && fieldErrors.dataInicio)}
                />
                {touched.dataInicio && fieldErrors.dataInicio && (
                  <span className="ws-field-error">{fieldErrors.dataInicio}</span>
                )}
              </div>

              <div
                className={`ws-field ${
                  touched.dataTermino && fieldErrors.dataTermino ? 'ws-invalid' : ''
                }`}
              >
                <label htmlFor="dataTermino">Data final *</label>
                <input
                  id="dataTermino"
                  type="date"
                  value={dataTermino}
                  min={dataInicio || undefined}
                  onChange={(e) => setDataTermino(e.target.value)}
                  onBlur={() => markTouched('dataTermino')}
                  aria-invalid={!!(touched.dataTermino && fieldErrors.dataTermino)}
                />
                {touched.dataTermino && fieldErrors.dataTermino && (
                  <span className="ws-field-error">{fieldErrors.dataTermino}</span>
                )}
              </div>
            </div>

            <div className="ws-row-2">
              <div className={`ws-field ${touched.custo && fieldErrors.custo ? 'ws-invalid' : ''}`}>
                <label htmlFor="custo">Custo (tokens) *</label>
                <input
                  id="custo"
                  type="number"
                  min={0}
                  value={custo}
                  onChange={(e) => setCusto(e.target.value)}
                  onBlur={() => markTouched('custo')}
                  aria-invalid={!!(touched.custo && fieldErrors.custo)}
                />
                {touched.custo && fieldErrors.custo && (
                  <span className="ws-field-error">{fieldErrors.custo}</span>
                )}
              </div>

              <div
                className={`ws-field ${
                  touched.capacidade && fieldErrors.capacidade ? 'ws-invalid' : ''
                }`}
              >
                <label htmlFor="capacidade">Capacidade *</label>
                <input
                  id="capacidade"
                  type="number"
                  min={1}
                  value={capacidade}
                  onChange={(e) => setCapacidade(e.target.value)}
                  onBlur={() => markTouched('capacidade')}
                  aria-invalid={!!(touched.capacidade && fieldErrors.capacidade)}
                />
                {touched.capacidade && fieldErrors.capacidade && (
                  <span className="ws-field-error">{fieldErrors.capacidade}</span>
                )}
              </div>
            </div>

            <div
              className={`ws-field ${
                touched.descricao && fieldErrors.descricao ? 'ws-invalid' : ''
              }`}
            >
              <label htmlFor="descricao">Descrição *</label>
              <div className="ws-input-wrap">
                <textarea
                  id="descricao"
                  value={descricaoTxt}
                  onChange={(e) => setDescricaoTxt(e.target.value.slice(0, 1000))}
                  onBlur={() => markTouched('descricao')}
                  placeholder="Descreva o foco do workshop, pré-requisitos, público-alvo..."
                  rows={6}
                  maxLength={1000}
                  aria-invalid={!!(touched.descricao && fieldErrors.descricao)}
                />
                <span className="ws-counter">{descCount}</span>
              </div>
              {touched.descricao && fieldErrors.descricao && (
                <span className="ws-field-error">{fieldErrors.descricao}</span>
              )}
            </div>

            {errorGlobal && <div className="ws-alert ws-error">{errorGlobal}</div>}
          </section>

          <aside className="ws-right">
            <section className="ws-card">
              <h2 className="ws-title-gradient">Dicas:</h2>
              <ul className="ws-tips-list">
                <li>Atualize o título para refletir melhor o conteúdo.</li>
                <li>Revise datas, custo e capacidade.</li>
                <li>Deixe a descrição clara para quem está chegando agora.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
