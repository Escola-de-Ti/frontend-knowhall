import React, { useState } from "react";
import "../styles/Tags.css";

const TagsSection: React.FC = () => {
  const [tags, setTags] = useState<string[]>(["MySQL"]);
  const [input, setInput] = useState("");

  const suggested = [
    "React", "JavaScript", "Clean Architecture",
    "TypeScript", "Node.js", "Python", "React Native"
  ];

  const addTag = () => {
    if (input && !tags.includes(input)) {
      setTags([...tags, input]);
      setInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="np-tag">
      <label># Tags</label>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Digite e adicione sua tag..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTag()}
        />
        <button onClick={addTag}>Adicionar</button>
      </div>

      <div className="tag-list" style={{ marginTop: "10px" }}>
        {tags.map((tag) => (
          <span
            key={tag}
            className="tag-item"
            onClick={() => removeTag(tag)}
            style={{ borderColor: "#6c6fec", color: "#6c6fec" }}
          >
            {tag} ✕
          </span>
        ))}
      </div>

      <p style={{ marginTop: "18px", fontSize: "15px", fontWeight: "600" }}>
        Tags sugeridas:
      </p>

      <div className="tag-list">
        {suggested.map((tag) => (
          <span
            key={tag}
            className="tag-item"
            onClick={() => !tags.includes(tag) && setTags([...tags, tag])}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagsSection;