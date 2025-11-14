import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';
import NotificationMenu from '../components/NotificationMenu';
import { authService } from '../services/authService';
import '../styles/NavBar.css';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    setMenuOpen(false);
    setNotifOpen(false);
  };

  function handleLogout() {
    authService.logout();
    navigate('/login');
  }

  return (
    <>
      <header className="nav-root">
        <button className="nav-burger" aria-label="Menu" onClick={() => setMenuOpen(true)}>
          <span />
        </button>

        <button className="nav-logo" onClick={() => go('/feed')} aria-label="Ir para o Feed">
          <img src="/logo_full.png" alt="KnowHall" />
        </button>

        <div className="nav-search">
          <span className="search-ico" aria-hidden />
          <input placeholder="Buscar posts, workshops, pessoas..." aria-label="Buscar" />
        </div>

        <div className="nav-actions">
          <button className="token-chip" aria-label="Saldo de tokens">
            <img src="/token_ico.svg" alt="Token" className="token-ico" />
            <span className="token-val">2.780</span>
          </button>

          <div className="notif-wrap">
            <button
              className="notif-btn"
              aria-label="Notificações"
              onClick={() => setNotifOpen((v) => !v)}
            >
              <span className="bell" aria-hidden />
            </button>
            <NotificationMenu open={notifOpen} onClose={() => setNotifOpen(false)} onGo={go} />
          </div>

          <button className="profile" onClick={() => go('/perfil')}>
            <div className="avatar">AJ</div>
            <span className="profile-name">Andre Jacob</span>
          </button>

          <button className="nav-logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} onGo={go} />
    </>
  );
}