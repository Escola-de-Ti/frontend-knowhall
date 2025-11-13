import React, { useEffect, useRef, useState } from 'react';
import '../../styles/perfil/PerfilAtividades.css';
import { comentarioService, type ComentarioUsuarioDTO } from '../../services/comentarioService';

type Atividade = {
  id: number;
  tipo: 'COMENTARIO' | 'POST' | 'WORKSHOP' | 'VOTO';
  data: string;
  snippet: string;
};

type Props = { idUsuario?: number };

const labelTipo: Record<Atividade['tipo'], string> = {
  COMENTARIO: 'Comentário',
  POST: 'Post',
  WORKSHOP: 'Workshop',
  VOTO: 'Voto',
};

export default function PerfilAtividades({ idUsuario = 1 }: Props) {
  const [itens, setItens] = useState<Atividade[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carregarComentarios = async () => {
      if (!idUsuario) return;
      
      try {
        setLoading(true);
        const comentarios = await comentarioService.listarPorUsuario(idUsuario);
        
        // Converter comentários da API para o formato de Atividade
        const atividadesComentarios: Atividade[] = comentarios.map((comentario) => ({
          id: comentario.comentarioId,
          tipo: 'COMENTARIO' as const,
          data: new Date().toISOString(), // API não retorna data, usando data atual
          snippet: comentario.texto,
        }));
        
        setItens(atividadesComentarios);
      } catch (err) {
        console.error('Erro ao carregar comentários:', err);
        // Mantém array vazio em caso de erro
        setItens([]);
      } finally {
        setLoading(false);
      }
    };

    carregarComentarios();
  }, [idUsuario]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenMenu(null);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const formatarData = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  return (
    <section className="atividades-container" aria-labelledby="atividades-title">
      <header className="atividades-head">
        <div className="atividades-ico" aria-hidden>
          🗓️
        </div>
        <h3 id="atividades-title">Atividades</h3>
      </header>

      {loading ? (
        <p className="atividades-loading">Carregando atividades...</p>
      ) : itens.length === 0 ? (
        <p className="atividades-empty">Nenhuma atividade encontrada.</p>
      ) : (
        <div className="atividades-list">
          {itens.map((a) => (
            <article key={a.id} className="atividade-card">
              <div className="atividade-left">
                <span className="dot" aria-hidden />
                <div className="atividade-meta">
                  <strong className="atividade-tipo">{labelTipo[a.tipo]}</strong>
                  <span className="atividade-data">{formatarData(a.data)}</span>
                </div>
              </div>

              <p className="atividade-snippet">{a.snippet}</p>

              <div className="atividade-actions" ref={menuRef}>
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
                    <button role="menuitem" className="kebab-item">
                      Excluir
                    </button>
                    <button role="menuitem" className="kebab-item">
                      Editar
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
