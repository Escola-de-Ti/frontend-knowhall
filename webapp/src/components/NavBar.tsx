import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';
import NotificationMenu from '../components/NotificationMenu';
import { authService } from '../services/authService';
import { useNotification } from '../contexts/NotificationContext';
import { useUser } from '../contexts/UserContext';
import '../styles/NavBar.css';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const { items, markAsRead } = useNotification();
  const { user: userData, clearUser } = useUser();

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const go = (path: string) => {
    navigate(path);
    setMenuOpen(false);
    setNotifOpen(false);
  };

  function handleLogout() {
    clearUser();
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
            <span className="token-val">{userData?.qntdToken?.toLocaleString('pt-BR') || '0'}</span>
          </button>

          <div className="notif-wrap">
            <button
              className="notif-btn"
              aria-label="Notificações"
              onClick={() => setNotifOpen((v) => !v)}
            >
              <span className="bell" aria-hidden />
            </button>
            <NotificationMenu
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
              onGo={go}
              items={items}
              onMarkAsRead={markAsRead}
            />
          </div>

          <button className="profile" onClick={() => go('/perfil')}>
            {userData?.idImagemPerfil ? (
              <img 
                src={userData.urlImagemPerfil || ''} 
                alt={userData.nome}
                className="avatar-img"
              />
            ) : (
              <div className="avatar">{getInitials(userData?.nome || '')}</div>
            )}
            <span className="profile-name">{userData?.nome || 'Carregando...'}</span>
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
