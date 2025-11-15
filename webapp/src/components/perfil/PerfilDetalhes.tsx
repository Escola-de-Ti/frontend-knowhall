import React from 'react';
import '../../styles/perfil/PerfilDetalhes.css';

type PerfilDetalhesProps = {
  id_usuario: number;
  email: string;
  cpf?: string;
  telefone?: string;
  telefone2?: string;
  nome: string;
  biografia?: string;
  id_imagem_perfil?: string;
  status_usuario?: string;
  tipo_usuario?: string;
  interesses: string[];
  onEditar?: () => void;
  onInteresseClick?: (tag: string) => void;
};

export default function PerfilDetalhes({
  id_usuario,
  email,
  nome,
  biografia,
  id_imagem_perfil,
  status_usuario,
  tipo_usuario,
  interesses,
  onEditar,
  onInteresseClick,
}: PerfilDetalhesProps) {
  const initials =
    nome
      ?.trim()
      ?.split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('') || 'U';

  return (
    <section
      className="perfil-details-container"
      data-userid={id_usuario}
      data-status={status_usuario}
      data-tipo={tipo_usuario}
    >
      <header className="perfil-head">
        <div className="perfil-avatar">
          {id_imagem_perfil ? <img src={id_imagem_perfil} alt={nome} /> : <span>{initials}</span>}
        </div>
        <h2 className="perfil-name">{nome}</h2>
        <span className="perfil-email">{email}</span>
      </header>

      {biografia && <p className="perfil-bio">{biografia}</p>}

      {onEditar && (
        <div className="perfil-actions">
          <button className="perfil-edit-btn" onClick={onEditar}>
            Editar Perfil
          </button>
        </div>
      )}

      <div className="perfil-interests">
        <h3>Áreas de Interesse:</h3>
        <div className="perfil-tags">
          {interesses?.map((tag) => (
            <button key={tag} className="perfil-tag" onClick={() => onInteresseClick?.(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
