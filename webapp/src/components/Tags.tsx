import React, { useState, useEffect } from 'react';
import '../styles/Tags.css';
import { tagService, TagResponseDTO } from '../services/tagService';

interface TagsProps {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

const Tags: React.FC<TagsProps> = ({ value, onChange, maxTags = 10 }) => {
  const [input, setInput] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<TagResponseDTO[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const fetchPopularTags = async () => {
      setLoadingSuggestions(true);
      try {
        const tags = await tagService.getMostPopular(10);
        setSuggestedTags(tags);
      } catch (error) {
        console.error('Erro ao buscar tags populares:', error);
        setSuggestedTags([
          { id: '1', name: 'React' },
          { id: '2', name: 'JavaScript' },
          { id: '3', name: 'TypeScript' },
          { id: '4', name: 'Node.js' },
          { id: '5', name: 'Python' },
        ]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchPopularTags();
  }, []);

  const addTag = () => {
    const tagName = input.trim();

    if (!tagName) return;

    if (value.includes(tagName)) {
      setInput('');
      return;
    }

    if (value.length >= maxTags) {
      alert(`Você pode adicionar no máximo ${maxTags} tags`);
      return;
    }

    onChange([...value, tagName]);
    setInput('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const addSuggestedTag = (tagName: string) => {
    if (value.includes(tagName)) return;

    if (value.length >= maxTags) {
      alert(`Você pode adicionar no máximo ${maxTags} tags`);
      return;
    }

    onChange([...value, tagName]);
  };

  return (
    <div className="tags-container">
      <label className="tags-title"># Tags</label>

      <div className="tags-input-row">
        <input
          type="text"
          placeholder="Digite e adicione sua tag..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          maxLength={50}
        />
        <button type="button" onClick={addTag}>
          Adicionar
        </button>
      </div>

      {value.length > 0 && (
        <>
          <p className="tags-info">
            {value.length} {value.length === 1 ? 'tag selecionada' : 'tags selecionadas'}
            {maxTags && ` (máximo: ${maxTags})`}
          </p>
          <div className="tags-list">
            {value.map((tag) => (
              <span
                key={tag}
                className="tag-item added"
                title="Clique para remover"
                onClick={() => removeTag(tag)}
              >
                {tag} ✕
              </span>
            ))}
          </div>
        </>
      )}

      <p className="tags-suggested-label">
        {loadingSuggestions ? 'Carregando tags populares...' : 'Tags sugeridas:'}
      </p>

      <div className="tags-list">
        {suggestedTags.map((tag) => (
          <span
            key={tag.id}
            className={`tag-item suggested ${value.includes(tag.name) ? 'disabled' : ''}`}
            onClick={() => addSuggestedTag(tag.name)}
            title={value.includes(tag.name) ? 'Tag já adicionada' : 'Clique para adicionar'}
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Tags;
