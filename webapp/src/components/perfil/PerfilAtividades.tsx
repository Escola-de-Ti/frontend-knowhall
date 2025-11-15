import React, { useEffect, useState } from 'react';
import '../../styles/perfil/PerfilAtividades.css';
import { comentarioService, type ComentarioUsuarioDTO } from '../../services/comentarios.service';

type Atividade = {
  id: number;
  tipo: 'COMENTARIO' | 'POST' | 'WORKSHOP' | 'VOTO';
  data: string;
  snippet: string;
};

type Props = {
  idUsuario?: number;
  isOwnProfile?: boolean;
};

const labelTipo: Record<Atividade['tipo'], string> = {
  COMENTARIO: 'Comentário',
  POST: 'Post',
  WORKSHOP: 'Workshop',
  VOTO: 'Voto',
};

export default function PerfilAtividades({ idUsuario = 1, isOwnProfile = false }: Props) {
  const [itens, setItens] = useState<Atividade[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<number | null>(null);
  const [textoEditado, setTextoEditado] = useState('');
  const [deletando, setDeletando] = useState<number | null>(null);
  const [comentarios, setComentarios] = useState<ComentarioUsuarioDTO[]>([]);

  useEffect(() => {
    const carregarComentarios = async () => {
      if (!idUsuario) return;

      try {
        setLoading(true);
        const comentariosAPI = await comentarioService.listarPorUsuario(idUsuario);
        setComentarios(comentariosAPI);

        const atividadesComentarios: Atividade[] = comentariosAPI.map((comentario) => ({
          id: comentario.comentarioId,
          tipo: 'COMENTARIO' as const,
          data: comentario.dataCriacao,
          snippet: comentario.texto,
        }));

        setItens(atividadesComentarios);
      } catch (err) {
        console.error('Erro ao carregar comentários:', err);
        setItens([]);
        setComentarios([]);
      } finally {
        setLoading(false);
      }
    };

    carregarComentarios();
  }, [idUsuario]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.atividade-actions')) {
        setOpenMenu(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const formatarData = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const handleEditar = (id: number) => {
    const comentario = comentarios.find((c) => c.comentarioId === id);
    if (comentario) {
      setEditando(id);
      setTextoEditado(comentario.texto);
      setOpenMenu(null);
    }
  };

  const handleSalvarEdicao = async (id: number) => {
    if (!textoEditado.trim()) return;

    try {
      await comentarioService.atualizar(id, { texto: textoEditado });

      setComentarios((prev) =>
        prev.map((c) => (c.comentarioId === id ? { ...c, texto: textoEditado } : c))
      );
      setItens((prev) => prev.map((a) => (a.id === id ? { ...a, snippet: textoEditado } : a)));

      setEditando(null);
      setTextoEditado('');
    } catch (err) {
      console.error('Erro ao editar comentário:', err);
      alert('Não foi possível editar o comentário. Tente novamente.');
    }
  };

  const handleCancelarEdicao = () => {
    setEditando(null);
    setTextoEditado('');
  };

  const handleExcluir = (id: number) => {
    setDeletando(id);
    setOpenMenu(null);
  };

  const handleConfirmarExclusao = async (id: number) => {
    try {
      await comentarioService.deletar(id);

      setComentarios((prev) => prev.filter((c) => c.comentarioId !== id));
      setItens((prev) => prev.filter((a) => a.id !== id));

      setDeletando(null);
    } catch (err) {
      console.error('Erro ao excluir comentário:', err);
      alert('Não foi possível excluir o comentário. Tente novamente.');
    }
  };

  const handleCancelarExclusao = () => {
    setDeletando(null);
  };

  return (
    <section className="atividades-container" aria-labelledby="atividades-title">
      <header className="atividades-head">
        <div className="atividades-ico" aria-hidden>
          🗓️
        </div>
        <h3 id="atividades-title">Comentários</h3>
      </header>

      {loading ? (
        <p className="atividades-loading">Carregando comentários...</p>
      ) : itens.length === 0 ? (
        <p className="atividades-empty">Nenhum comentário encontrado.</p>
      ) : (
        <>
          <div className="atividades-list">
            {itens.map((a) => {

              return (
                <article key={a.id} className="atividade-card">
                  <div className="atividade-left">
                    <span className="dot" aria-hidden />
                    <div className="atividade-meta">
                      <strong className="atividade-tipo">{labelTipo[a.tipo]}</strong>
                      <span className="atividade-data">{formatarData(a.data)}</span>
                    </div>
                  </div>

                  {editando === a.id ? (
                    <div className="atividade-edit-area">
                      <textarea
                        className="edit-textarea"
                        value={textoEditado}
                        onChange={(e) => setTextoEditado(e.target.value)}
                        autoFocus
                      />
                      <div className="edit-actions">
                        <button
                          className="edit-btn edit-btn-save"
                          onClick={() => handleSalvarEdicao(a.id)}
                        >
                          Salvar
                        </button>
                        <button className="edit-btn edit-btn-cancel" onClick={handleCancelarEdicao}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="atividade-snippet">{a.snippet}</p>
                  )}

                  {isOwnProfile && (
                    <div className="atividade-actions">
                      <button
                        className="kebab-btn"
                        aria-label="Mais opções"
                        aria-expanded={openMenu === a.id}
                        onClick={() => setOpenMenu((cur) => (cur === a.id ? null : a.id))}
                      >
                        ⋮
                      </button>

                      {openMenu === a.id && (
                        <div role="menu" className="kebab-menu">
                          <button
                            role="menuitem"
                            className="kebab-item"
                            onClick={() => handleExcluir(a.id)}
                          >
                            Excluir
                          </button>
                          <button
                            role="menuitem"
                            className="kebab-item"
                            onClick={() => handleEditar(a.id)}
                          >
                            Editar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {deletando !== null && (
            <div className="delete-modal-overlay" onClick={handleCancelarExclusao}>
              <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                <h4>Confirmar exclusão</h4>
                <p>Tem certeza que deseja excluir este comentário?</p>
                <div className="delete-modal-actions">
                  <button
                    className="delete-btn delete-btn-confirm"
                    onClick={() => handleConfirmarExclusao(deletando)}
                  >
                    Excluir
                  </button>
                  <button className="delete-btn delete-btn-cancel" onClick={handleCancelarExclusao}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
