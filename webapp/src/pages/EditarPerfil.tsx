import React, { useMemo, useRef, useState } from 'react';
import NavBar from '../components/NavBar';
import '../styles/EditarPerfil.css';
import { editarPerfil } from '../services/editar.perfil.service';

type Interesse = string;

export default function EditarPerfil() {
  const [nome, setNome] = useState('Andre Jacob');
  const [email, setEmail] = useState('andre@jacobemail.com');
  const [telefone, setTelefone] = useState('(44) 9 9988-7746');
  const [bio, setBio] = useState('');
  const [buscaInteresse, setBuscaInteresse] = useState('');
  const [selecionados, setSelecionados] = useState<Interesse[]>(['MySQL']);
  const [loading, setLoading] = useState(false);

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
    setSelecionados((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function addPersonalizado() {
    const v = buscaInteresse.trim();
    if (!v) return;
    if (!selecionados.includes(v)) setSelecionados((p) => [...p, v]);
    setBuscaInteresse('');
  }

  function handleUploadClick() {
    fileRef.current?.click();
  }

  function handleArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
  }

  async function onSalvar() {
    try {
      setLoading(true);
      const token =
        localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || '';
      const payload = {
        email,
        telefone: telefone.replace(/\D/g, ''),
        nome,
        biografia: bio,
        tipoUsuario: 'ALUNO',
        tags: selecionados.map((t) => ({ name: t })),
      };
      await editarPerfil(payload, token);
      alert('Perfil atualizado');
    } catch (e: any) {
      alert(e.message || 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  function onCancelar() {
    window.history.back();
  }

  return (
    <>
      <NavBar />
      <div className="ep-page">
        <div className="ep-topbar">
          <button className="ep-back" onClick={onCancelar}>
            &lt; Voltar
          </button>
          <div className="ep-header">
            <h1>Editar Perfil</h1>
            <p>Atualize suas informações e personalize seu perfil</p>
          </div>
        </div>

        <section className="ep-card ep-avatar-card">
          <div className="ep-card-title">Foto de Perfil</div>
          <div className="ep-avatar-row">
            <div className="ep-avatar">{iniciais || 'AJ'}</div>
            <div className="ep-avatar-actions">
              <button className="ep-link" onClick={handleUploadClick}>
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
                className="ep-input ep-input-focus-pink"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
              />
            </label>

            <label className="ep-field">
              <span className="ep-label">
                E-mail <b>*</b>
              </span>
              <input
                className="ep-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </label>

            <label className="ep-field">
              <span className="ep-label">
                Telefone <b>*</b>
              </span>
              <input
                className="ep-input"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
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
            />
          </label>
        </section>

        <section className="ep-card">
          <div className="ep-card-title">Áreas de Interesse</div>
          <p className="ep-subtle">Selecione até 10 áreas (atual: {selecionados.length}/10)</p>

          <div className="ep-chips-wrap">
            {selecionados.map((tag) => (
              <button
                key={`sel-${tag}`}
                className="ep-chip ep-chip-selected"
                onClick={() => toggleInteresse(tag)}
                title="Remover"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="ep-add-row">
            <input
              className="ep-input"
              placeholder="Adicionar interesse Personalizado"
              value={buscaInteresse}
              onChange={(e) => setBuscaInteresse(e.target.value)}
              onKeyDown={(e) => (e.key === 'Enter' ? addPersonalizado() : null)}
            />
            <button className="ep-add-btn" onClick={addPersonalizado}>
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
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="ep-actions">
          <button className="ep-btn ep-btn-cancelar" onClick={onCancelar} disabled={loading}>
            Cancelar
          </button>
          <button className="ep-btn ep-btn-salvar" onClick={onSalvar} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </>
  );
}
