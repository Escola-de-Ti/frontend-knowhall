import React, { useMemo, useRef, useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import '../styles/EditarPerfil.css';
import { editarPerfil, uploadAvatar } from '../services/editar.perfil.service';

type Interesse = string;

export default function EditarPerfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [bio, setBio] = useState('');
  const [buscaInteresse, setBuscaInteresse] = useState('');
  const [selecionados, setSelecionados] = useState<Interesse[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    nome?: string;
    email?: string;
    telefone?: string;
    interesses?: string;
    arquivo?: string;
  }>({});
  const [msg, setMsg] = useState<{ type: 'ok' | 'erro' | null; text: string }>({
    type: null,
    text: '',
  });

  const populares: Interesse[] = [
    'React',
    'JavaScript',
    'Clean Architecture',
    'TypeScript',
    'Node.js',
    'Python',
    'React Native',
  ];

  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('user_profile');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        setNome(u?.nome || '');
        setEmail(u?.email || '');
        setTelefone(u?.telefone || '');
        setBio(u?.bio || '');
        setSelecionados(Array.isArray(u?.interesses) ? u.interesses.slice(0, 10) : []);
      } catch {}
    }
    setProfileLoading(false);
  }, []);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const iniciais = useMemo(
    () =>
      nome
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join(''),
    [nome]
  );

  function toggleInteresse(tag: Interesse) {
    setSelecionados((prev) => {
      if (prev.includes(tag)) {
        const next = prev.filter((t) => t !== tag);
        setErrors((e) => ({ ...e, interesses: undefined }));
        return next;
      }
      if (prev.length >= 10) {
        setErrors((e) => ({ ...e, interesses: 'Você pode selecionar no máximo 10 interesses.' }));
        return prev;
      }
      const next = [...prev, tag];
      setErrors((e) => ({ ...e, interesses: undefined }));
      return next;
    });
  }

  function addPersonalizado() {
    const v = buscaInteresse.trim();
    if (!v) return;
    if (selecionados.length >= 10) {
      setErrors((e) => ({ ...e, interesses: 'Você pode adicionar no máximo 10 interesses.' }));
      return;
    }
    if (!selecionados.includes(v)) setSelecionados((p) => [...p, v]);
    setBuscaInteresse('');
    setErrors((e) => ({ ...e, interesses: undefined }));
  }

  function handleUploadClick() {
    fileRef.current?.click();
  }

  function handleArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    setErrors((er) => ({ ...er, arquivo: undefined }));
    const f = e.target.files?.[0];
    if (!f) return;
    const okTypes = ['image/png', 'image/jpeg', 'image/gif'];
    if (!okTypes.includes(f.type)) {
      setErrors((er) => ({ ...er, arquivo: 'Formato inválido. Use JPG, PNG ou GIF.' }));
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrors((er) => ({ ...er, arquivo: 'Arquivo maior que 5MB.' }));
      return;
    }
    setFile(f);
  }

  function validar() {
    const es: typeof errors = {};
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const foneDigits = telefone.replace(/\D/g, '');
    if (!nome.trim()) es.nome = 'Informe seu nome.';
    if (!email.trim() || !emailOk) es.email = 'E-mail inválido.';
    if (!telefone.trim() || foneDigits.length < 10) es.telefone = 'Telefone inválido.';
    setErrors(es);
    return Object.keys(es).length === 0;
  }

  async function onSalvar() {
    setMsg({ type: null, text: '' });
    if (!validar()) return;
    try {
      setLoading(true);
      const token =
        localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || '';
      const userType =
        localStorage.getItem('user_type') || sessionStorage.getItem('user_type') || 'ALUNO';

      const payload = {
        email,
        telefone: telefone.replace(/\D/g, ''),
        nome,
        biografia: bio,
        tipoUsuario: userType,
        tags: selecionados.map((t) => ({ name: t })),
      };

      await editarPerfil(payload, token);

      if (file) {
        await uploadAvatar(file, token);
      }

      setMsg({ type: 'ok', text: 'Perfil atualizado com sucesso.' });
      const stored = { nome, email, telefone, bio, interesses: selecionados };
      localStorage.setItem('user_profile', JSON.stringify(stored));
    } catch (e: any) {
      setMsg({ type: 'erro', text: e?.message || 'Erro ao salvar.' });
    } finally {
      setLoading(false);
    }
  }

  function onCancelar() {
    window.history.back();
  }

  const desabilitarSalvar = loading || profileLoading;

  return (
    <>
      <NavBar />
      <div className="ep-page">
        <div className="ep-topbar">
          <button className="ep-back" onClick={onCancelar} disabled={loading}>
            &lt; Voltar
          </button>
          <div className="ep-header">
            <h1>Editar Perfil</h1>
            <p>Atualize suas informações e personalize seu perfil</p>
          </div>
        </div>

        {msg.type && (
          <div className={`ep-toast ${msg.type === 'ok' ? 'ep-toast-ok' : 'ep-toast-erro'}`}>
            {msg.text}
          </div>
        )}

        <section className="ep-card ep-avatar-card">
          <div className="ep-card-title">Foto de Perfil</div>
          <div className="ep-avatar-row">
            <div className="ep-avatar">
              {preview ? (
                <img src={preview} alt="avatar" className="ep-avatar-img" />
              ) : (
                iniciais || '??'
              )}
            </div>
            <div className="ep-avatar-actions">
              <button className="ep-link" onClick={handleUploadClick} disabled={loading}>
                Alterar foto
              </button>
              <input
                type="file"
                accept="image/png,image/jpeg,image/gif"
                ref={fileRef}
                onChange={handleArquivo}
                hidden
              />
              <span className="ep-hint">JPG, PNG ou GIF. Máx. 5MB.</span>
              {errors.arquivo && <div className="ep-error">{errors.arquivo}</div>}
            </div>
          </div>
        </section>

        <section className="ep-card">
          <div className="ep-card-title">Informações básicas</div>

          <div className="ep-grid">
            <label className="ep-field">
              <span className="ep-label">
                Nome completo <b>*</b>
              </span>
              <input
                className={`ep-input ep-input-focus-pink ${errors.nome ? 'ep-input-err' : ''}`}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                disabled={profileLoading || loading}
              />
              {errors.nome && <small className="ep-error">{errors.nome}</small>}
            </label>

            <label className="ep-field">
              <span className="ep-label">
                E-mail <b>*</b>
              </span>
              <input
                className={`ep-input ${errors.email ? 'ep-input-err' : ''}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                disabled={profileLoading || loading}
              />
              {errors.email && <small className="ep-error">{errors.email}</small>}
            </label>

            <label className="ep-field">
              <span className="ep-label">
                Telefone <b>*</b>
              </span>
              <input
                className={`ep-input ${errors.telefone ? 'ep-input-err' : ''}`}
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                disabled={profileLoading || loading}
              />
              {errors.telefone && <small className="ep-error">{errors.telefone}</small>}
            </label>
          </div>

          <label className="ep-field">
            <span className="ep-label">Biografia</span>
            <textarea
              className="ep-textarea"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte mais sobre você..."
              disabled={profileLoading || loading}
            />
          </label>
        </section>

        <section className="ep-card">
          <div className="ep-card-title">Áreas de Interesse</div>
          <p className="ep-subtle">Selecione até 10 áreas (atual: {selecionados.length}/10)</p>
          {errors.interesses && <div className="ep-error">{errors.interesses}</div>}

          <div className="ep-chips-wrap">
            {selecionados.map((tag) => (
              <button
                key={`sel-${tag}`}
                className="ep-chip ep-chip-selected"
                onClick={() => toggleInteresse(tag)}
                title="Remover"
                disabled={loading}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="ep-add-row">
            <input
              className="ep-input"
              placeholder="Adicionar interesse personalizado"
              value={buscaInteresse}
              onChange={(e) => setBuscaInteresse(e.target.value)}
              onKeyDown={(e) => (e.key === 'Enter' ? addPersonalizado() : null)}
              disabled={loading}
            />
            <button className="ep-add-btn" onClick={addPersonalizado} disabled={loading}>
              +
            </button>
          </div>

          <div className="ep-populares">
            <div className="ep-pop-title">Interesses Populares</div>
            <div className="ep-chips-wrap">
              {populares.map((tag) => (
                <button
                  key={tag}
                  className={`ep-chip ${selecionados.includes(tag) ? 'ep-chip-selected' : ''}`}
                  onClick={() => toggleInteresse(tag)}
                  disabled={loading}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="ep-actions">
          <button
            className="ep-btn ep-btn-cancelar"
            onClick={onCancelar}
            disabled={desabilitarSalvar}
          >
            Cancelar
          </button>
          <button className="ep-btn ep-btn-salvar" onClick={onSalvar} disabled={desabilitarSalvar}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </>
  );
}
