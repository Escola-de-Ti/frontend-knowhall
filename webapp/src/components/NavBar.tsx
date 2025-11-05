import React from 'react';
import '../styles/NavBar.css';

export default function NavBar() {
  return (
    <header className="nav-root">
      <button className="nav-burger" aria-label="Menu">
        <span />
      </button>

      <div className="nav-logo">
        <img src="/logo_full.png" alt="KnowHall" />
      </div>

      <div className="nav-search">
        <span className="search-ico" aria-hidden />
        <input placeholder="Buscar posts, workshops, pessoas..." aria-label="Buscar" />
      </div>

      <div className="nav-actions">
        <button className="token-chip" aria-label="Saldo de tokens">
          <span className="token-ico" />
          <span className="token-val">2.780</span>
        </button>

        <button className="notif-btn" aria-label="Notificações">
          <span className="bell" aria-hidden />
        </button>

        <div className="profile">
          <div className="avatar">AJ</div>
          <span className="profile-name">Andre Jacob</span>
        </div>
      </div>
    </header>
  );
}
