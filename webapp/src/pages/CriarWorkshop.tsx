import React, { useMemo, useState } from 'react';
import '../styles/CriarWorkshop.css';
import NavBar from '../components/NavBar';
import { createWorkshop } from '../services/workshops.service';
import Tags from '../components/Tags';

function toIsoDay(date: string, end?: boolean) {
  if (!date) return date;
  return end ? `${date}T23:59:59` : `${date}T00:00:00`;
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
  if (!start || !end) return null;
  const s = new Date(start + 'T00:00:00').getTime();
  const e = new Date(end + 'T00:00:00').getTime();
  if (isNaN(s) || isNaN(e) || e < s) return null;
  const days = Math.round((e - s) / 86_400_000) + 1;
  return days === 1 ? '1 dia' : `${days} dias`;
}

function fmtDate(d?: string) {
  if (!d) return '-';
  const dt = new Date(d + 'T00:00:00');
  if (isNaN(dt.getTime())) return '-';
  return dt.toLocaleDateString('pt-BR');
}

export default function CriarWorkshop() {
  const [titulo, setTitulo] = useState('');
  const [tema, setTema] = useState('');
  const [descricaoTxt, setDescricaoTxt] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataTermino, setDataTermino] = useState('');
  const [linkMeet, setLinkMeet] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    titulo: false,
    tema: false,
    descricao: false,
    dataInicio: false,
    dataTermino: false,
    linkMeet: false,
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
  };

  const hasErrors = Object.values(fieldErrors).some(Boolean);

  function markTouched(name: keyof typeof touched) {
    setTouched((t) => ({ ...t, [name]: true }));
  }

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
      });
      return;
    }

    const inicioIso = toIsoDay(dataInicio, false);
    const terminoIso = toIsoDay(dataTermino, true);

    try {
      setLoading(true);

      await createWorkshop({
        titulo,
        tema,
        descricao: descricaoTxt,
        dataInicio: inicioIso,
        dataTermino: terminoIso,
        linkMeet,
      });

      resetForm();
      alert('Workshop criado com sucesso');
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
    setTouched({
      titulo: false,
      tema: false,
      descricao: false,
      dataInicio: false,
      dataTermino: false,
      linkMeet: false,
    });
    setErrorGlobal(null);
  }

  return (
    <>
      <NavBar />

      <div className="ws-container">
        <div className="ws-header">
          <div className="ws-head-text">
            <h1>Criar Workshop</h1>
            <p>Compartilhe seu conhecimento com a comunidade.</p>
          </div>
          <div className="ws-actions">
            <button type="button" className="ws-btn-cancel" onClick={resetForm}>
              Cancelar
            </button>
            <button
              type="button"
              className="ws-btn-save"
              disabled={loading || hasErrors}
              onClick={onSubmit}
            >
              {loading ? 'Salvando...' : 'Publicar'}
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
              <h2 className="ws-title-gradient">Dicas para bons Workshops:</h2>
              <ul className="ws-tips-list">
                <li>Use um título claro e descritivo</li>
                <li>Defina bem o tema e o público-alvo</li>
                <li>Inclua exemplos práticos ou código quando possível</li>
              </ul>
            </section>
          </aside>

          <section className="ws-card ws-tags">
            <Tags />
          </section>
        </div>
      </div>
    </>
  );
}
