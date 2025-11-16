/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CriarWorkshop.css';
import NavBar from '../components/NavBar';
import Loading from '../components/Loading';
import { workshopService } from '../services/workshopService';
import { useNotification } from '../contexts/NotificationContext';

function maskDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const len = digits.length;

  if (len <= 2) return digits;
  if (len <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseMaskedDate(value?: string): Date | null {
  if (!value) return null;
  const parts = value.split('/');
  if (parts.length !== 3) return null;

  const [dayStr, monthStr, yearStr] = parts;
  if (yearStr.length !== 4) return null;

  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;

  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

function toIsoDate(masked: string): string | null {
  const date = parseMaskedDate(masked);
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function toIsoDay(masked: string, end?: boolean): string | null {
  const iso = toIsoDate(masked);
  if (!iso) return null;
  return end ? `${iso}T23:59:59` : `${iso}T00:00:00`;
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function calcDurationDays(start?: string, end?: string) {
  const startDate = parseMaskedDate(start);
  const endDate = parseMaskedDate(end);
  if (!startDate || !endDate || endDate < startDate) return null;

  const s = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const e = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  const days = Math.round((e - s) / 86_400_000) + 1;
  return days === 1 ? '1 dia' : `${days} dias`;
}

function fmtDate(masked?: string) {
  if (!masked) return '-';
  return masked;
}

export default function CriarWorkshop() {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [titulo, setTitulo] = useState('');
  const [tema, setTema] = useState('');
  const [descricaoTxt, setDescricaoTxt] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataTermino, setDataTermino] = useState('');
  const [linkMeet, setLinkMeet] = useState('');
  const [custo, setCusto] = useState('');
  const [capacidade, setCapacidade] = useState('');

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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

  const startDateObj = parseMaskedDate(dataInicio);
  const endDateObj = parseMaskedDate(dataTermino);

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
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  async function onSubmit() {
    setErrorGlobal(null);

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

    const inicioIso = toIsoDay(dataInicio, false);
    const terminoIso = toIsoDay(dataTermino, true);

    if (!inicioIso || !terminoIso) {
      setErrorGlobal('Datas inválidas, verifique os campos.');
      return;
    }

    const custoNum = Number(custo);
    const capacidadeNum = Number(capacidade);

    if (Number.isNaN(custoNum) || Number.isNaN(capacidadeNum)) {
      setErrorGlobal('Custo e capacidade devem ser numéricos');
      return;
    }

    try {
      setLoading(true);

      await workshopService.criar({
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
      });

      resetForm();

      addNotification({
        title: 'Workshop criado com sucesso',
        subtitle: 'Ele já está em "Meus Workshops".',
        path: '/workshops',
      });

      navigate('/workshops');
    } catch (e: any) {
      setErrorGlobal(e?.message || 'Erro inesperado ao criar workshop');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitulo('');
    setTema('');
    setDescricaoTxt('');
    setDataInicio('');
    setDataTermino('');
    setLinkMeet('');
    setCusto('');
    setCapacidade('');
    setTouched({
      titulo: false,
      tema: false,
      descricao: false,
      dataInicio: false,
      dataTermino: false,
      linkMeet: false,
      custo: false,
      capacidade: false,
    });
    setErrorGlobal(null);
  }

  if (initialLoading || loading) {
    return (
      <>
        <NavBar />
        <div className="ws-container">
          <Loading
            fullscreen
            message={initialLoading ? 'Carregando tela...' : 'Salvando workshop...'}
          />
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
            <h1>Criar Workshop</h1>
            <p>Compartilhe seu conhecimento com a comunidade.</p>
          </div>

          <div className="ws-actions">
            <button type="button" className="ws-btn-cancel" onClick={resetForm}>
              Cancelar
            </button>
            <button type="button" className="ws-btn-save" disabled={loading} onClick={onSubmit}>
              Publicar
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
                  value={dataInicio}
                  onChange={(e) => setDataInicio(maskDate(e.target.value))}
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
                  value={dataTermino}
                  onChange={(e) => setDataTermino(maskDate(e.target.value))}
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
              <h2 className="ws-title-gradient">Dicas para bons Workshops:</h2>
              <ul className="ws-tips-list">
                <li>Use um título claro e descritivo</li>
                <li>Defina bem o tema e o público-alvo</li>
                <li>Inclua exemplos práticos ou código quando possível</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
