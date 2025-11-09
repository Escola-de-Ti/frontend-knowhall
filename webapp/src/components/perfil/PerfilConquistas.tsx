import React from 'react';
import '../../styles/perfil/PerfilConquistas.css';

const data = [
  { id: 1, emoji: '🎯', titulo: 'Primeiro Post', desc: 'Publicou seu primeiro post' },
  { id: 2, emoji: '🧑‍🏫', titulo: 'Mentor', desc: 'Ajudou 10+ pessoas' },
  { id: 3, emoji: '👍', titulo: '100 Upvotes', desc: '50+ posts sobre React' },
  { id: 4, emoji: '✨', titulo: 'Super Contributor', desc: '100+ contribuições' },
  { id: 5, emoji: '🎓', titulo: 'Mentor', desc: 'Conduziu 5+ workshops' },
  { id: 6, emoji: '👑', titulo: 'Community Leader', desc: 'Top 10 do ranking' },
];

export default function PerfilConquistas() {
  return (
    <section className="badges-container">
      <header className="badges-head">
        <div className="badges-ico">🏆</div>
        <h2>Badges e Conquistas</h2>
      </header>

      <div className="badges-grid">
        {data.map((b) => (
          <article key={b.id} className="badge-card">
            <div className="badge-emoji">{b.emoji}</div>
            <div className="badge-info">
              <h3>{b.titulo}</h3>
              <p>{b.desc}</p>
              <span className="badge-pill">Conquistado</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
