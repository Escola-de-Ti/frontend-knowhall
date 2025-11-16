/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/EditarWorkshop.css';
import NavBar from '../components/NavBar';
import {
  workshopService,
  type WorkshopResponseDTO,
  type WorkshopUpdateDTO,
} from '../services/workshopService';
import { useNotification } from '../contexts/NotificationContext';

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function maskBrDate(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseBrDate(value?: string): Date | null {
  if (!value) return null;
  const clean = value.trim();
  const parts = clean.split('/');
  if (parts.length !== 3) return null;

  const [dStr, mStr, yStr] = parts;
  const day = Number(dStr);
  const month = Number(mStr);
  const year = Number(yStr);

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    day <= 0 ||
    month <= 0 ||
    month > 12
  ) {
    return null;
  }

  const dt = new Date(year, month - 1, day);
  if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) {
    return null;
  }

  return dt;
}

function isoToBrDate(iso?: string | null): string {
  if (!iso) return '';
  const [datePart] = iso.split('T');
  if (!datePart) return '';
  const [year, month, day] = datePart.split('-');
  if (!year || !month || !day) return '';
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}

function toIsoDayFromBr(date: string, end?: boolean): string | undefined {
  const dt = parseBrDate(date);
  if (!dt) return undefined;
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  const base = `${year}-${month}-${day}`;
  return `${base}${end ? 'T23:59:59' : 'T00:00:00'}`;
}

function calcDurationDays(start?: string, end?: string) {
  const s = parseBrDate(start);
  const e = parseBrDate(end);
  if (!s || !e || e < s) return null;
  const diffDays = Math.round((e.getTime() - s.getTime()) / 86_400_000) + 1;
  return diffDays === 1 ? '1 dia' : `${diffDays} dias`;
}

function fmtDate(d?: string) {
  if (!d) return '-';
  return d;
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

  const startDateObj = parseBrDate(dataInicio);
  const endDateObj = parseBrDate(dataTermino);

  const fieldErrors = {
    titulo: !titulo ? 'Obrigatório' : '',
    tema: !tema ? 'Obrigatório' : '',
    descricao: !descricaoTxt ? 'Obrigatório' : '',
    dataInicio: !dataInicio ? 'Obrigatório' : !startDateObj ? 'Data inválida' : '',
    dataTermino: !dataTermino
      ? 'Obrigatório'
      : !endDateObj
        ? 'Data inválida'
        : startDateObj && endDateObj && endDateObj < startDateObj
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
        setDataInicio(isoToBrDate(wk.dataInicio));
        setDataTermino(isoToBrDate(wk.dataTermino));
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

    const inicioIso = toIsoDayFromBr(dataInicio, false);
    const terminoIso = toIsoDayFromBr(dataTermino, true);

    const custoNum = Number(custo);
    const capacidadeNum = Number(capacidade);

    if (Number.isNaN(custoNum) || Number.isNaN(capacidadeNum)) {
      setErrorGlobal('Custo e capacidade devem ser numéricos');
      return;
    }

    const payload: WorkshopUpdateDTO = {
      titulo,
      linkMeet,
      dataInicio: inicioIso,
      dataTermino: terminoIso,
      custo: custoNum,
      capacidade: capacidadeNum,
      descricao: {
        tema,
        descricao: descricaoTxt,
      },
    };

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
          <div className="ws-layout">
            <div className="ws-header-left">
              <button type="button" className="ws-btn-back" onClick={() => navigate(-1)}>
                <span className="ws-ico-back" />
                Voltar
              </button>
            </div>

            <div className="ws-head-text">
              <h1>Editar Workshop</h1>
              <p>Carregando dados do workshop...</p>
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
        <div className="ws-layout">
          <div className="ws-header-left">
            <button type="button" className="ws-btn-back" onClick={() => navigate(-1)}>
              <span className="ws-ico-back" />
              Voltar
            </button>
          </div>

          <div className="ws-head-text">
            <h1>Editar Workshop</h1>
            <p>Ajuste título, datas, custo e descrição.</p>
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

            <div className="ws-form-grid">
              <div
                className={`ws-field ws-field-full ${
                  touched.titulo && fieldErrors.titulo ? 'ws-invalid' : ''
                }`}
              >
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

              <div
                className={`ws-field ws-field-date ${
                  touched.dataInicio && fieldErrors.dataInicio ? 'ws-invalid' : ''
                }`}
              >
                <label htmlFor="dataInicio">Data de início *</label>
                <input
                  id="dataInicio"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={dataInicio}
                  onChange={(e) => setDataInicio(maskBrDate(e.target.value))}
                  onBlur={() => markTouched('dataInicio')}
                  placeholder="dd/mm/aaaa"
                  aria-invalid={!!(touched.dataInicio && fieldErrors.dataInicio)}
                />
                <span className="ws-field-hint">Formato: dd/mm/aaaa</span>
                {touched.dataInicio && fieldErrors.dataInicio && (
                  <span className="ws-field-error">{fieldErrors.dataInicio}</span>
                )}
              </div>

              <div
                className={`ws-field ws-field-date ${
                  touched.dataTermino && fieldErrors.dataTermino ? 'ws-invalid' : ''
                }`}
              >
                <label htmlFor="dataTermino">Data final *</label>
                <input
                  id="dataTermino"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={dataTermino}
                  onChange={(e) => setDataTermino(maskBrDate(e.target.value))}
                  onBlur={() => markTouched('dataTermino')}
                  placeholder="dd/mm/aaaa"
                  aria-invalid={!!(touched.dataTermino && fieldErrors.dataTermino)}
                />
                <span className="ws-field-hint">Formato: dd/mm/aaaa</span>
                {touched.dataTermino && fieldErrors.dataTermino && (
                  <span className="ws-field-error">{fieldErrors.dataTermino}</span>
                )}
              </div>

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
                <span className="ws-field-hint">
                  Esse valor é debitado do aluno e creditado ao instrutor.
                </span>
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
                <span className="ws-field-hint">Quantidade máxima de participantes.</span>
                {touched.capacidade && fieldErrors.capacidade && (
                  <span className="ws-field-error">{fieldErrors.capacidade}</span>
                )}
              </div>

              <div
                className={`ws-field ws-field-full ${
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

              {errorGlobal && <div className="ws-alert ws-error ws-field-full">{errorGlobal}</div>}
            </div>
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