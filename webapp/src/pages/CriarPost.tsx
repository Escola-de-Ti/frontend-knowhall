import React, { useMemo, useState } from 'react';
import '../styles/CriarPost.css';
import Recompensas from '../components/Recompensas';
import DicasPost from '../components/DicasPosts';
import Tags from '../components/Tags';
import ImagePicker from '../components/ImagePicker';
import { uploadImagem } from '../services/imagem.service';
import { http } from '../api/http';

const CriarPost: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [title,setTitle] = useState('');
  const [content,setContent] = useState('');
  const [tags,setTags] = useState<string[]>(['MySQL']);
  const [loading,setLoading] = useState(false)

  const titleCount = useMemo(()=> `${title.length}/100 Caracteres`,[title])
  const contentCount = useMemo(()=> `${content.length}/2500 Caracteres`,[content])

  async function onSubmit(){
    if(!title.trim() || !content.trim()){ alert('Preencha título e conteúdo'); return }
    setLoading(true)
    try{
      const uploaded: Array<{id:number,url?:string}> = []
      for(const f of images){
        const r = await uploadImagem(f, 'post')
        uploaded.push(r)
      }
      await http.post('/api/posts', {
        titulo: title,
        conteudo: content,
        tags,
        imagens: uploaded.map(u=>u.id),
      })
      alert('Post publicado')
      setTitle(''); setContent(''); setImages([]); setTags(['MySQL'])
    }catch{
      alert('Erro ao publicar')
    }finally{ setLoading(false) }
  }

  function onCancel(){
    setTitle(''); setContent(''); setImages([]); setTags(['MySQL'])
  }

  return (
    <div className="new-post-container">
      <div className="np-header">
        <div className="np-head-text">
          <h1>Criar Post</h1>
          <p>Compartilhe seu conhecimento com a comunidade</p>
        </div>

        <div className="np-actions">
          <button type="button" className="button-cancel" onClick={onCancel}>Cancelar</button>
          <button type="button" className="button-post" disabled={loading} onClick={onSubmit}>
            {loading ? 'Publicando...' : 'Publicar'}
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
              value={title}
              onChange={e=> setTitle(e.target.value.slice(0,100))}
              placeholder="Digite um título chamativo para seu post..."
              maxLength={100}
            />
            <span className="np-counter">{titleCount}</span>
          </div>

          <div className="np-field">
            <label htmlFor="content">Conteúdo</label>
            <textarea
              id="content"
              value={content}
              onChange={e=> setContent(e.target.value.slice(0,2500))}
              placeholder="Compartilhe seu conhecimento, experiência ou dicas..."
              rows={8}
              maxLength={2500}
            />
            <span className="np-counter">{contentCount}</span>
          </div>

          <div className="np-field">
            <label>Imagens (opcional)</label>
            <ImagePicker value={images} onChange={setImages} maxFiles={10} maxSizeMB={10} />
          </div>
        </section>

        <DicasPost />

        <section className="np-card">
          <h2>Tags</h2>
          <Tags />
        </section>
      </div>
    </div>
  );
};

export default CriarPost;