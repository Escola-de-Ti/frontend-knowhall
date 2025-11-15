import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/perfil/PerfilSlide.css';

type Props = {
  tabs: string[];
  value: string;
  onChange: (tab: string) => void;
};

export default function PerfilSlide({ tabs, value, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useMemo(() => tabs.map(() => React.createRef<HTMLButtonElement>()), [tabs]);
  const [box, setBox] = useState({ x: 0, w: 0 });

  const recalc = () => {
    const i = Math.max(0, tabs.indexOf(value));
    const btn = btnRefs[i]?.current;
    const el = containerRef.current;
    if (!btn || !el) return;
    const x = btn.offsetLeft;
    const w = btn.offsetWidth;
    setBox({ x, w });
  };

  useEffect(() => {
    recalc();
  }, [value, tabs.join('|')]);

  useEffect(() => {
    const ro = new ResizeObserver(recalc);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', recalc);
    return () => {
      window.removeEventListener('resize', recalc);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="perfil-slide"
      role="tablist"
      style={
        {
          '--x': `${box.x}px`,
          '--w': `${box.w}px`,
        } as React.CSSProperties
      }
    >
      <div className="perfil-slide-indicator" aria-hidden />
      {tabs.map((t, i) => {
        const active = t === value;
        return (
          <button
            key={t}
            ref={btnRefs[i]}
            className={`perfil-slide-tab${active ? ' is-active' : ''}`}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t)}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
