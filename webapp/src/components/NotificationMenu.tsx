import React from 'react';
import '../styles/NotificationMenu.css';

export type NotificationItem = {
  id: string | number;
  title: string;
  subtitle?: string;
  path?: string;
  read?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onGo: (path: string) => void;
  items: NotificationItem[];
  onMarkAsRead?: (id: string | number) => void;
};

export default function NotificationMenu({ open, onClose, onGo, items, onMarkAsRead }: Props) {
  if (!open) return null;

  const handleClick = (item: NotificationItem) => {
    if (onMarkAsRead) onMarkAsRead(item.id);
    if (item.path) onGo(item.path);
    onClose();
  };

  return (
    <>
      <div className="nm-overlay" onClick={onClose} />
      <div className="nm-panel" role="dialog" aria-modal="true">
        <div className="nm-header">Notificações</div>

        {items.length === 0 && <div className="nm-empty">Você ainda não tem notificações.</div>}

        {items.map((item) => (
          <button key={item.id} className="nm-item" type="button" onClick={() => handleClick(item)}>
            <span className={`nm-dot ${item.read ? 'read' : ''}`} />
            <div className="nm-body">
              <div className="nm-title">{item.title}</div>
              {item.subtitle && <div className="nm-sub">{item.subtitle}</div>}
            </div>
          </button>
        ))}

        {items.length > 0 && (
          <button
            className="nm-ver-todas"
            type="button"
            onClick={() => {
              onGo('/notificacoes');
              onClose();
            }}
          >
            Ver todas
          </button>
        )}
      </div>
    </>
  );
}
