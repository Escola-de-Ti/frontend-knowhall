import React from 'react';
import '../styles/SideMenu.css';

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  onGo: (path: string) => void;
}

interface ItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const Item: React.FC<ItemProps> = ({ icon, label, active, onClick }) => (
  <button className={`sm-item ${active ? 'sm-active' : ''}`} onClick={onClick}>
    <span className="sm-ico" aria-hidden>
      {icon}
    </span>
    <span className="sm-label">{label}</span>
  </button>
);

const SideMenu: React.FC<SideMenuProps> = ({ open, onClose, onGo }) => (
  <>
    <div className={`sm-overlay ${open ? 'show' : ''}`} onClick={onClose} />
    <aside className={`sm-panel ${open ? 'show' : ''}`} role="dialog" aria-modal="true">
      <div className="sm-content">
        <Item icon="🏠" label="Feed" active onClick={() => onGo('/feed')} />
        <Item icon="📘" label="Workshops" onClick={() => onGo('/workshops')} />
        <Item icon="👤" label="Perfil" onClick={() => onGo('/perfil')} />
        <Item icon="🏆" label="Ranking" onClick={() => onGo('/ranking')} />

        <button className="sm-cta" onClick={() => onGo('/criar-post')}>
          <span className="sm-cta-plus">+</span>
          <span>Criar Post</span>
        </button>
      </div>
    </aside>
  </>
);

export default SideMenu;
