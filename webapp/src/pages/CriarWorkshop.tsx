import React, { useMemo, useState } from 'react';
import '../styles/CriarWorkshop.css';
import NavBar from '../components/NavBar';
import {
  createWorkshop,
  type CreateWorkshopPayload,
  type CreateWorkshopResponse,
} from '../services/criar.workshop.service';
import Tags from '../components/Tags';

type Props = {
  apiUrl?: string;
  onSuccess?: (data: CreateWorkshopResponse) => void;
};

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
function toIso(date: string, time: string) {
  if (!date) return '';
  const t = time && /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : '00:00:00';
  return `${date}T${t}`;
}

export default function CriarWorkshop({ apiUrl = '/api/workshops', onSuccess }: Props) {
  const [titulo, setTitulo] = useState('');
  const [custo, setCusto] = useState('');
  const [descricaoTxt, setDescricaoTxt] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [linkMeet, setLinkMeet] = useState('');
  const [preReq, setPreReq] = useState('');
  const [rewards, setRewards] = useState('•\n•\n•\n•');

  const [loading, setLoading] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    titulo: false,
    custo: false,
    descricao: false,
    data: false,
    hora: false,
    linkMeet: false,
    preReq: false,
  });

  const titleCount = useMemo(() => `${titulo.length}/100`, [titulo]);
  const descCount = useMemo(() => `${descricaoTxt.length}/2500`, [descricaoTxt]);

  const fieldErrors = {
    titulo: !titulo ? 'Obrigatório' : '',
    custo: !custo ? 'Obrigatório' : '',
    descricao: !descricaoTxt ? 'Obrigatório' : '',
    data: !data ? 'Obrigatório' : '',
    hora: !hora ? 'Obrigatório' : '',
    linkMeet: !linkMeet ? 'Obrigatório' : !isValidUrl(linkMeet) ? 'URL inválida' : '',
    preReq: '',
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
        custo: true,
        descricao: true,
        data: true,
        hora: true,
        linkMeet: true,
        preReq: true,
      });
      return;
    }
    const inicio = toIso(data, hora);
    const payload = {
      instrutorId: 1,
      titulo,
      linkMeet,
      dataInicio: inicio,
      dataTermino: inicio,
      descricao: { tema: preReq, descricao: descricaoTxt },
    } as unknown as CreateWorkshopPayload;

    try {
      setLoading(true);
      const resp = await createWorkshop(apiUrl, payload);
      onSuccess?.(resp);
      resetForm();
    } catch (e: any) {
      setErrorGlobal(e?.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitulo('');
    setCusto('');
    setDescricaoTxt('');
    setData('');
    setHora('');
    setLinkMeet('');
    setPreReq('');
    setRewards('•\n•\n•\n•');
    setTouched({
      titulo: false,
      custo: false,
      descricao: false,
      data: false,
      hora: false,
      linkMeet: false,
      preReq: false,
    });
    setErrorGlobal(null);
  }

  return (
    <>
      <NavBar />
      <div className="ws-container">
        <div className="ws-header ws-header-center">
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
                  <span className="ws-summary-label">Custo</span>
                  <span className="ws-chip">{custo || '-'}</span>
                </li>
                <li className="ws-summary-row">
                  <span className="ws-summary-label">Data</span>
                  <span className="ws-chip">{data || '-'}</span>
                </li>
                <li className="ws-summary-row">
                  <span className="ws-summary-label">Horário</span>
                  <span className="ws-chip">{hora || '-'}</span>
                </li>
                <li className="ws-summary-row">
                  <span className="ws-summary-label">Meet</span>
                  <span className="ws-chip">{linkMeet ? 'Pronto' : '-'}</span>
                </li>
              </ul>
            </section>
          </aside>

          <section className="ws-card ws-center">
            <h2 className="ws-title-gradient">Conteúdo do Workshop</h2>

            <div className="ws-row-2">
              <div
                className={`ws-field ${touched.titulo && fieldErrors.titulo ? 'ws-invalid' : ''}`}
              >
                <label htmlFor="titulo">
                  Título <span className="req">*</span>
                </label>
                <div className="ws-input-wrap">
                  <input
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value.slice(0, 100))}
                    onBlur={() => markTouched('titulo')}
                    placeholder="Digite um título chamativo para seu post..."
                    maxLength={100}
                    aria-invalid={!!(touched.titulo && fieldErrors.titulo)}
                  />
                  <span className="ws-counter">{titleCount}</span>
                </div>
                {touched.titulo && fieldErrors.titulo && (
                  <span className="ws-field-error">{fieldErrors.titulo}</span>
                )}
              </div>

              <div className={`ws-field ${touched.custo && fieldErrors.custo ? 'ws-invalid' : ''}`}>
                <label htmlFor="custo">
                  Custo <span className="req">*</span>
                </label>
                <input
                  id="custo"
                  value={custo}
                  onChange={(e) => setCusto(e.target.value)}
                  onBlur={() => markTouched('custo')}
                  placeholder="Ex: 250"
                  aria-invalid={!!(touched.custo && fieldErrors.custo)}
                />
                {touched.custo && fieldErrors.custo && (
                  <span className="ws-field-error">{fieldErrors.custo}</span>
                )}
              </div>
            </div>

            <div
              className={`ws-field ${touched.descricao && fieldErrors.descricao ? 'ws-invalid' : ''}`}
            >
              <label htmlFor="descricao">
                Descrição <span className="req">*</span>
              </label>
              <div className="ws-input-wrap">
                <textarea
                  id="descricao"
                  value={descricaoTxt}
                  onChange={(e) => setDescricaoTxt(e.target.value.slice(0, 2500))}
                  onBlur={() => markTouched('descricao')}
                  placeholder="Compartilhe seu conhecimento, experiência ou dicas..."
                  rows={8}
                  maxLength={2500}
                  aria-invalid={!!(touched.descricao && fieldErrors.descricao)}
                />
                <span className="ws-counter">{descCount}</span>
              </div>
              {touched.descricao && fieldErrors.descricao && (
                <span className="ws-field-error">{fieldErrors.descricao}</span>
              )}
            </div>

            <div className="ws-row-3">
              <div className={`ws-field ${touched.data && fieldErrors.data ? 'ws-invalid' : ''}`}>
                <label htmlFor="data">
                  Data <span className="req">*</span>
                </label>
                <input
                  id="data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  onBlur={() => markTouched('data')}
                  placeholder="dd/mm/aaaa"
                  aria-invalid={!!(touched.data && fieldErrors.data)}
                />
                {touched.data && fieldErrors.data && (
                  <span className="ws-field-error">{fieldErrors.data}</span>
                )}
              </div>

              <div className={`ws-field ${touched.hora && fieldErrors.hora ? 'ws-invalid' : ''}`}>
                <label htmlFor="hora">
                  Horário <span className="req">*</span>
                </label>
                <input
                  id="hora"
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  onBlur={() => markTouched('hora')}
                  placeholder="--:--"
                  aria-invalid={!!(touched.hora && fieldErrors.hora)}
                />
                {touched.hora && fieldErrors.hora && (
                  <span className="ws-field-error">{fieldErrors.hora}</span>
                )}
              </div>

              <div
                className={`ws-field ${touched.linkMeet && fieldErrors.linkMeet ? 'ws-invalid' : ''}`}
              >
                <label htmlFor="linkMeet">
                  Link do Google Meet <span className="req">*</span>
                </label>
                <input
                  id="linkMeet"
                  type="url"
                  value={linkMeet}
                  onChange={(e) => setLinkMeet(e.target.value)}
                  onBlur={() => markTouched('linkMeet')}
                  placeholder="https://meet.google.com/..."
                  aria-invalid={!!(touched.linkMeet && fieldErrors.linkMeet)}
                />
                {touched.linkMeet && fieldErrors.linkMeet && (
                  <span className="ws-field-error">{fieldErrors.linkMeet}</span>
                )}
                <span className="ws-hint">Obs: Um link será gerado automaticamente</span>
              </div>
            </div>

            <div className="ws-row-1">
              <div
                className={`ws-field ${touched.preReq && fieldErrors.preReq ? 'ws-invalid' : ''}`}
              >
                <label htmlFor="prereq">Pré-requisitos</label>
                <input
                  id="prereq"
                  value={preReq}
                  onChange={(e) => setPreReq(e.target.value)}
                  onBlur={() => markTouched('preReq')}
                  placeholder="Ex: React básico, JavaScript ES6+, ..."
                />
              </div>
            </div>

            <div className="ws-row-1">
              <label className="ws-rewards-label">Recompensas por conduzir o Wortshop</label>
              <textarea
                className="ws-rewards"
                value={rewards}
                onChange={(e) => setRewards(e.target.value)}
                rows={4}
              />
            </div>

            {errorGlobal && <div className="ws-alert ws-error">{errorGlobal}</div>}
          </section>

          <aside className="ws-right">
            <section className="ws-card ws-tips-card">
              <h3>Dicas para bons Workshops:</h3>
              <ul className="ws-tips-list">
                <li className="ws-tip-item">
                  <span>Use um título claro e descritivo</span>
                </li>
                <li className="ws-tip-item">
                  <span>Adicione tags relevantes para facilitar a descoberta</span>
                </li>
                <li className="ws-tip-item">
                  <span>Inclua exemplos práticos ou código quando possível</span>
                </li>
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
