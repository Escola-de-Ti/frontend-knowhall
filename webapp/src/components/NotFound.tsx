import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <main className="nf-wrap">
        <section className="nf-card">
          <div className="nf-glow" aria-hidden />
          <h1 className="nf-404">404</h1>
          <p className="nf-title">Página não encontrada</p>
          <p className="nf-sub">O link pode estar quebrado ou a página foi movida.</p>

          <div className="nf-actions">
            <button className="nf-btn ghost" onClick={() => navigate(-1)}>
              <span className="ico-back" />
              Voltar
            </button>
            <button className="nf-btn" onClick={() => navigate('/feed')}>
              <span className="ico-home" />
              Ir para o Feed
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
