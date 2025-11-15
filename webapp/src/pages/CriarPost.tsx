/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CriarPost.css';
import NavBar from '../components/NavBar';
import Recompensas from '../components/Recompensas';
import DicasPost from '../components/DicasPosts';
import Tags from '../components/Tags';
import ImagePicker from '../components/ImagePicker';
import { tagService } from '../services/tagService';
import { authService } from '../services/authService';
import { postService } from '../services/postService';
import { imagemService } from '../services/imagemService';

interface FormData {
  titulo: string;
  descricao: string;
  tags: string[];
  imagens: File[];
}

interface FormErrors {
  titulo?: string;
  descricao?: string;
  tags?: string;
  geral?: string;
}

const CriarPost: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descricao: '',
    tags: [],
    imagens: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const titleCount = useMemo(() => `${formData.titulo.length}/100 caracteres`, [formData.titulo]);

  const contentCount = useMemo(
    () => `${formData.descricao.length}/2500 caracteres`,
    [formData.descricao]
  );

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'O título é obrigatório';
    } else if (formData.titulo.length < 10) {
      newErrors.titulo = 'O título deve ter no mínimo 10 caracteres';
    } else if (formData.titulo.length > 100) {
      newErrors.titulo = 'O título deve ter no máximo 100 caracteres';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'A descrição é obrigatória';
    } else if (formData.descricao.length < 20) {
      newErrors.descricao = 'A descrição deve ter no mínimo 20 caracteres';
    } else if (formData.descricao.length > 2500) {
      newErrors.descricao = 'A descrição deve ter no máximo 2500 caracteres';
    }

    if (!authService.isAuthenticated()) {
      newErrors.geral = 'Você precisa estar logado para criar um post';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({
      ...prev,
      tags,
    }));

    if (errors.tags) {
      setErrors((prev) => ({
        ...prev,
        tags: undefined,
      }));
    }
  };

  const handleImagesChange = (images: File[]) => {
    setFormData((prev) => ({
      ...prev,
      imagens: images,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccessMessage('');
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let tagIds: number[] = [];

      if (formData.tags.length > 0) {
        tagIds = await tagService.processMultipleTags(formData.tags);
      }

      const postData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        tagIds: tagIds.map(id => id.toString()),
      };

      const postCriado = await postService.criar(postData);

      if (formData.imagens.length > 0) {
        const uploadPromises = formData.imagens.map(imagem =>
          imagemService.upload(imagem, {
            type: 'POST',
            id_type: Number(postCriado.id),
          })
        );

        await Promise.all(uploadPromises);
      }

      setSuccessMessage('Post publicado com sucesso! ✨');

      setFormData({
        titulo: '',
        descricao: '',
        tags: [],
        imagens: [],
      });

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao criar post:', error);

      if (error.response?.status === 401) {
        setErrors({ geral: 'Sessão expirada. Faça login novamente.' });
        setTimeout(() => {
          authService.logout();
          navigate('/login');
        }, 2000);
      } else if (error.response?.status === 400) {
        setErrors({
          geral: 'Dados inválidos. Verifique os campos e tente novamente.',
        });
      } else if (error.message) {
        setErrors({ geral: error.message });
      } else {
        setErrors({
          geral: 'Erro ao publicar post. Tente novamente mais tarde.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      titulo: '',
      descricao: '',
      tags: [],
      imagens: [],
    });
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <>
      <NavBar />
      <div className="new-post-container">
        <div className="np-header">
          <div className="np-head-text">
            <h1>Criar Post</h1>
            <p>Compartilhe seu conhecimento com a comunidade</p>
          </div>

          <div className="np-actions">
            <button
              type="button"
              className="button-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" form="post-form" className="button-post" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}

        {errors.geral && <div className="error-message">{errors.geral}</div>}

        <form id="post-form" className="np-grid" onSubmit={handleSubmit}>
          <Recompensas />

          <section className="np-card">
            <h2>Conteúdo do Post</h2>

            <div className="np-field">
              <label htmlFor="titulo">
                Título <span className="required">*</span>
              </label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                value={formData.titulo}
                onChange={handleInputChange}
                placeholder="Digite um título chamativo para seu post..."
                maxLength={100}
                disabled={loading}
                className={errors.titulo ? 'input-error' : ''}
              />
              <span className="np-counter">{titleCount}</span>
              {errors.titulo && <span className="error">{errors.titulo}</span>}
            </div>

            <div className="np-field">
              <label htmlFor="descricao">
                Descrição <span className="required">*</span>
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Compartilhe seu conhecimento, experiência ou dicas..."
                rows={8}
                maxLength={2500}
                disabled={loading}
                className={errors.descricao ? 'input-error' : ''}
              />
              <span className="np-counter">{contentCount}</span>
              {errors.descricao && <span className="error">{errors.descricao}</span>}
            </div>

            <div className="np-field">
              <label>Imagens (máximo 3)</label>
              <ImagePicker
                value={formData.imagens}
                onChange={handleImagesChange}
                maxFiles={3}
                maxSizeMB={10}
              />
            </div>
          </section>

          <DicasPost />

          <section className="np-card">
            <h2>Tags</h2>
            <Tags value={formData.tags} onChange={handleTagsChange} maxTags={10} />
            {errors.tags && <span className="error">{errors.tags}</span>}
          </section>
        </form>
      </div>
    </>
  );
};

export default CriarPost;