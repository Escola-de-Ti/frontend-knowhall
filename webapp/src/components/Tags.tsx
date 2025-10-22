import React, { useState } from "react";
import "../styles/Tags.css";

const Tags: React.FC = () => {
  const [tags, setTags] = useState<string[]>(["MySQL"]);
  const [input, setInput] = useState("");

  const suggested = [
    "React", "JavaScript", "Clean Architecture",
    "TypeScript", "Node.js", "Python", "React Native"
  ];

  const addTag = () => {
    const value = input.trim();
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
      setInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
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
          onKeyDown={(e) => e.key === "Enter" && addTag()}
        />
        <button type="button" onClick={addTag}>Adicionar</button>
      </div>

      <div className="tags-list">
        {tags.map((tag) => (
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

      <p className="tags-suggested-label">Tags sugeridas:</p>

      <div className="tags-list">
        {suggested.map((tag) => (
          <span
            key={tag}
            className="tag-item suggested"
            onClick={() => !tags.includes(tag) && setTags([...tags, tag])}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Tags;