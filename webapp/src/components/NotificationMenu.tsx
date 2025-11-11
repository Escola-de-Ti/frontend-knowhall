import React from 'react';
import '../styles/NotificationMenu.css';

type Props = {
  open: boolean;
  onClose: () => void;
  onGo: (path: string) => void;
};

export default function NotificationMenu({ open, onClose, onGo }: Props) {
  if (!open) return null;

  return (
    <>
      <div className="nm-overlay" onClick={onClose} />
      <div className="nm-panel" role="dialog" aria-modal="true">
        <div className="nm-header">Notificações</div>

        <button className="nm-item" onClick={() => onGo('/post/123')}>
          <span className="nm-dot" />
          <div className="nm-body">
            <div className="nm-title">Novo comentário no seu post</div>
            <div className="nm-sub">há 2 min • “Como aprender React…”</div>
          </div>
        </button>

        <button className="nm-item" onClick={() => onGo('/workshops/ux')}>
          <span className="nm-dot read" />
          <div className="nm-body">
            <div className="nm-title">Workshop UX começa amanhã</div>
            <div className="nm-sub">20:00 • lembrete</div>
          </div>
        </button>

        <button className="nm-ver-todas" onClick={() => onGo('/notificacoes')}>
          Ver todas
        </button>
      </div>
    </>
  );
}
