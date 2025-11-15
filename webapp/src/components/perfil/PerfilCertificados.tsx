import React, { useEffect, useState } from 'react';
import '../../styles/perfil/PerfilCertificados.css';

type Certificado = {
  id: number;
  titulo: string;
  emissor: string;
  ano: number;
  url: string;
};

export default function PerfilCertificados() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [abertos, setAbertos] = useState<number[]>([]);

  useEffect(() => {
    const mock: Certificado[] = [
      { id: 1, titulo: 'AWS Cloud Practitioner', emissor: 'Amazon', ano: 2024, url: '#' },
      { id: 2, titulo: 'AWS Cloud Practitioner', emissor: 'Amazon', ano: 2024, url: '#' },
      { id: 3, titulo: 'AWS Cloud Practitioner', emissor: 'Amazon', ano: 2024, url: '#' },
      { id: 4, titulo: 'AWS Cloud Practitioner', emissor: 'Amazon', ano: 2024, url: '#' },
    ];
    setCertificados(mock);
  }, []);

  const handleAbrir = (id: number, url: string) => {
    window.open(url, '_blank');
    setAbertos((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <section className="certificados-container" aria-labelledby="certificados-title">
      <header className="certificados-head">
        <div className="certificados-ico" aria-hidden>
          💾
        </div>
        <h3 id="certificados-title">Certificados</h3>
      </header>

      <div className="certificados-list">
        {certificados.map((c) => {
          const aberto = abertos.includes(c.id);
          return (
            <article key={c.id} className="certificado-card">
              <div className="certificado-thumb" aria-hidden>
                <img src="/img-placeholder.svg" alt="" />
              </div>

              <div className="certificado-info">
                <h4>{c.titulo}</h4>
                <p>
                  {c.emissor} • {c.ano}
                </p>
              </div>

              <button
                onClick={() => handleAbrir(c.id, c.url)}
                className={`btn-exibir ${aberto ? 'btn-vermelho' : ''}`}
              >
                <span>🔗</span> Exibir Certificado
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
