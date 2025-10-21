import React from 'react';
import '../styles/CriarPost.css';
import Recompensas from '../components/Recompensas';
import DicasPost from '../components/DicasPosts';

const CriarPost: React.FC = () => {
  return (
    <div className="new-post-container">
      <div className="np-header">
        <div className="np-head-text">
          <h1>Criar Post</h1>
          <p>Compartilhe seu conhecimento com a comunidade</p>
        </div>

        <div className="np-actions">
          <button type="reset" className="button-cancel">
            Cancelar
          </button>
          <button type="submit" className="button-post">
            Publicar
          </button>
        </div>
      </div>

      <div className="np-grid">
        <Recompensas />

        <section className="np-card">
          <h2>Conteúdo do Post</h2>

          <div className="np-field">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Digite um título chamativo para seu post..."
              maxLength={100}
            />
            <span className="np-counter">0/100 Caracteres</span>
          </div>

          <div className="np-field">
            <label htmlFor="content">Conteúdo</label>
            <textarea
              id="content"
              name="content"
              placeholder="Compartilhe seu conhecimento, experiência ou dicas..."
              rows={8}
              maxLength={2500}
            />
            <span className="np-counter">0/2500 Caracteres</span>
          </div>

          <div className="np-field">
            <label>Imagens (opcional)</label>
            <label className="load-file">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="load-icon"
                aria-hidden="true"
              >
                <path d="M21 15v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3" />
                <path d="M7 10l5-5 5 5" />
                <path d="M12 5v12" />
              </svg>
              <p>Clique para adicionar imagens ou arraste aqui</p>
              <input type="file" name="images" accept="image/*" multiple hidden />
            </label>
          </div>
        </section>

        <DicasPost />
      </div>
    </div>
  );
};

export default CriarPost;
