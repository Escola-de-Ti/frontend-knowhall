import React from 'react';
import '../styles/CriarPost.css';

const CriarPost = () => {
  return (
    <div className="new-post-container">
      <h1>Criar Post</h1>
      <p>Compartilhe seu conhecimento com a comunidade!</p>

      <button type="reset" className="button-cancel">
        Cancelar
      </button>
      <button type="submit" className="button-post">
        Publicar
      </button>

      <div className="form-section">
        <h2>Conteúdo do Post</h2>
        <h3>Título</h3>
        <input type="text" placeholder="Digite um título chamativo para o seu post..." />
        <p>0/100 Caracteres</p>

        <h3>Conteúdo</h3>
        <input type="text" placeholder="Compartilhe seu conhecimento, experiência ou dicas..." />
        <p>0/2500 Caracteres</p>

        <h3>Imagens (Opcional)</h3>
        <label className="load-file">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="load-icon"
          >
            <path d="M21 15v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3" />
            <path d="M7 10l5-5 5 5" />
            <path d="M12 5v12" />
          </svg>

          <p>Clique para adicionar imagens ou arraste aqui</p>
          <input type="file" accept="image/*" multiple hidden />
        </label>
      </div>
    </div>
  );
};

export default CriarPost;
