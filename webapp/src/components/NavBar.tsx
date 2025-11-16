import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';
import NotificationMenu from '../components/NotificationMenu';
import { authService } from '../services/authService';
import { useNotification } from '../contexts/NotificationContext';
import { useUser } from '../contexts/UserContext';
import { usuarioService, RankingUsuarioDTO } from '../services/usuarioService';
import '../styles/NavBar.css';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RankingUsuarioDTO[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const results = await usuarioService.buscarPorNome(searchQuery.trim());
          setSearchResults(results);
          setSearchOpen(true);
        } catch (error) {
          console.error('Erro ao buscar usuários:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setSearchOpen(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleUserClick = (userId: number) => {
    setSearchQuery('');
    setSearchOpen(false);
    navigate(`/perfil/${userId}`);
  };

  return (
    <>
      <header className="nav-root">
        <button className="nav-burger" aria-label="Menu" onClick={() => setMenuOpen(true)}>
          <span />
        </button>
        <button className="nav-logo" onClick={() => go('/feed')} aria-label="Ir para o Feed">
          <img src="/logo_full.png" alt="KnowHall" />
        </button>
        <div className="nav-search-wrapper" ref={searchRef}>
          <div className="nav-search">
            <span className="search-ico" aria-hidden />
            <input
              placeholder="Buscar usuários..."
              aria-label="Buscar usuários"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setSearchOpen(true)}
            />
          </div>
          {searchOpen && (
            <div className="search-dropdown">
              {isSearching ? (
                <div className="search-loading">Buscando...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <button
                    key={user.id}
                    className="search-result-item"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <div className="search-user-info">
                      <span className="search-user-name">{user.nome}</span>
                      <span className="search-user-stats">
                        Nível {user.nivel} • {user.qntdXp.toLocaleString('pt-BR')} XP • #{user.posicao}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="search-empty">Nenhum usuário encontrado</div>
              )}
            </div>
          )}
        </div>
        <div className="nav-actions">
          <button className="token-chip" aria-label="Saldo de tokens">
            <img src="/token_ico.svg" alt="Token" className="token-ico" />
            <span className="token-val">{userData?.qntdToken?.toLocaleString('pt-BR') || '0'}</span>
          </button>
          <div className="notif-wrap">
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