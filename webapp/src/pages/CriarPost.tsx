import React from 'react';
import '../styles/CriarPost.css';

const CriarPost = () => {
  return (
    <div className="new-post-container">
      <h1>Criar Post</h1>
      <p>Compartilhe seu conhecimento com a comunidade!</p>

      <button type="reset" className='button-cancel'>Cancelar</button>
      <button type="submit" className='button-post'>Publicar</button>

      <div className="form-section">
        <h2>Conteúdo do Post</h2>
        <h3>Título</h3>
        <input type="text" placeholder="Digite um título chamativo para o seu post..." />
        <p>0/100 Caracteres</p>

        <h3>Conteúdo</h3>
        <input type="text" placeholder="Compartilhe seu conhecimento, experiência ou dicas..." />
        <p>0/2500 Caracteres</p>

        <h3>Imagens (Opcional)</h3>
        <input className='load-file' type="file" accept="image/*" multiple placeholder='Clique para adicionar imagens ou arraste aqui!'/>
      </div>
    </div>
  );
};

export default CriarPost;
