import React, { useEffect, useRef, useState } from 'react';
import '../../styles/perfil/PerfilAtividades.css';

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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mock: Atividade[] = [
      {
        id: 101,
        tipo: 'COMENTARIO',
        data: '2025-09-13',
        snippet:
          'Vi que muita gente está com dúvida na instalação. O segredo é rodar o comando npm install com a flag --legacy-peer-deps. A nova versão do NPM...',
      },
      {
        id: 100,
        tipo: 'COMENTARIO',
        data: '2025-09-12',
        snippet:
          "Já passei por isso. Tente desativar a 'minimização do mapa de código' (code minimap) e outras extensões que analisam o arquiv...",
      },
      {
        id: 99,
        tipo: 'COMENTARIO',
        data: '2025-09-10',
        snippet:
          'Isso geralmente é problema no driver da placa de rede. Vá ao site da fabricante do seu notebook, procure pelo seu modelo exato e baixe a versão mais rec...',
      },
      {
        id: 98,
        tipo: 'COMENTARIO',
        data: '2025-09-10',
        snippet:
          "De forma simples: com REST, você tem vários 'endereços' (endpoints) e cada um te entrega um pacote fechado de dados. Com GraphQL, voc...",
      },
    ];
    setItens(mock);
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
    </section>
  );
}
