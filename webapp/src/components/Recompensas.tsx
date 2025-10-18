import React from 'react';

type Linha = { label: string; valor: string; color: 'green' | 'pink' | 'blue' };
type CardProps = { titulo: string; linhas: Linha[] };

const RecompensasCard: React.FC<CardProps> = ({ titulo, linhas }) => {
  return (
    <div className="rewards-card">
      <h3 className="rewards-title">{titulo}</h3>
      <ul className="rewards-list">
        {linhas.map((l, i) => (
          <li key={i} className="rewards-row">
            <span className="rewards-label">{l.label}</span>
            <span className={`rewards-value ${l.color}`}>{l.valor}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Recompensas: React.FC = () => {
  return (
    <div className="rewards-stack">
      <RecompensasCard
        titulo="Recompensas para o Autor"
        linhas={[
          { label: 'Respostas destaques:', valor: '+100 tokens', color: 'green' },
          { label: 'A cada 25 upvotes:', valor: '+100 tokens', color: 'pink' },
        ]}
      />
      <RecompensasCard
        titulo="Recompensas para respostas"
        linhas={[
          { label: 'Respostas destaques:', valor: '+100 tokens', color: 'green' },
          { label: 'Super Vote:', valor: '+200 tokens', color: 'blue' },
          { label: 'A cada 5 upvotes:', valor: '+50 tokens', color: 'pink' },
        ]}
      />
    </div>
  );
};

export default Recompensas;
