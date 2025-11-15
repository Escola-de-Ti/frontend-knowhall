import React, { useEffect, useMemo, useRef, useState } from 'react';

type Preview = { id: string; file: File; url: string };

type ImagePickerProps = {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
};

const ImagePicker: React.FC<ImagePickerProps> = ({
  value,
  onChange,
  maxFiles = 10,
  maxSizeMB = 10,
}) => {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    const next: Preview[] = value.map((file, i) => ({
      id: `${file.name}-${file.size}-${i}-${crypto.randomUUID()}`,
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews(next);
    return () => next.forEach((p) => URL.revokeObjectURL(p.url));
  }, [value]);

  const remaining = useMemo(() => Math.max(0, maxFiles - value.length), [maxFiles, value.length]);

  function pickMore() {
    inputRef.current?.click();
  }

  function validate(files: File[]) {
    const valid: File[] = [];
    for (const f of files) {
      if (!f.type.startsWith('image/')) continue;
      if (f.size > maxSizeMB * 1024 * 1024) continue;
      valid.push(f);
    }
    return valid.slice(0, remaining);
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    const valid = validate(incoming);

    const dedup = valid.filter(
      (nf) => !value.some((v) => v.name === nf.name && v.size === nf.size)
    );

    if (dedup.length === 0) return;
    onChange([...value, ...dedup]);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }

  function onRemove(id: string) {
    const keep = previews.filter((p) => p.id !== id).map((p) => p.file);
    onChange(keep);
  }

  return (
    <div className="uploader">
      {/* Dropzone / botão */}
      <div
        className={`load-file ${remaining === 0 ? 'disabled' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={pickMore}
        role="button"
        aria-label="Adicionar imagens"
        tabIndex={0}
      >
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
        <p>
          {remaining > 0
            ? 'Clique para adicionar imagens ou arraste aqui'
            : 'Limite de imagens atingido'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {previews.length > 0 && (
        <div className="thumbs">
          {previews.map((p) => (
            <figure key={p.id} className="thumb">
              <img src={p.url} alt={p.file.name} />
              <figcaption className="thumb-cap">
                <span title={p.file.name}>{p.file.name}</span>
                <button
                  type="button"
                  className="thumb-remove"
                  onClick={() => onRemove(p.id)}
                  aria-label={`Remover ${p.file.name}`}
                >
                  ✕
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagePicker;
