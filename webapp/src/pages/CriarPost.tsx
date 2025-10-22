import React, { useState } from 'react';
import '../styles/CriarPost.css';
import Recompensas from '../components/Recompensas';
import DicasPost from '../components/DicasPosts';
import Tags from '../components/Tags';
import ImagePicker from '../components/ImagePicker';

const CriarPost: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);

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

            {}
            <ImagePicker
              value={images}
              onChange={setImages}
              maxFiles={10}
              maxSizeMB={10}
            />
          </div>
        </section>

        <DicasPost />
        <Tags />
      </div>
    </div>
  );
};

export default CriarPost;